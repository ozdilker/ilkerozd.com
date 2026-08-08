import { NextResponse } from 'next/server';
import { assertAdminEnabled } from '@/lib/adminGuard';
import { createProduct, updateProduct, deleteProduct, turkishSlugify } from '@/lib/mutations';
import type { ProductInput } from '@/lib/mutations';
import { getDb } from '@/lib/db';
import { getProductBySlug } from '@/lib/queries';

/**
 * Verilen slug'ın (aynı ürün hariç) veritabanında tekil olmasını sağlar;
 * çakışma varsa `-2`, `-3` ... son eki ekleyerek benzersiz bir aday üretir.
 */
function ensureUniqueSlug(slug: string, excludeId?: number): string {
  let candidate = slug;
  let suffix = 2;

  for (;;) {
    const existing = getProductBySlug(candidate);
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
}

/**
 * Slug güvenliği: gelen slug boş/boşluksa `baslik`ten türetilir; türetim de
 * boş çıkarsa (örn. başlık sadece sembollerden oluşuyorsa) zaman damgalı
 * benzersiz bir slug'a düşer. Ardından veritabanındaki mevcut kayıtlarla
 * çakışmaması için benzersizleştirilir.
 */
function resolveSlug(rawSlug: unknown, baslik: string, excludeId?: number): string {
  let slug = typeof rawSlug === 'string' ? rawSlug.trim() : '';

  if (!slug) {
    slug = turkishSlugify(baslik);
  }
  if (!slug) {
    slug = `urun-${Date.now()}`;
  }

  return ensureUniqueSlug(slug, excludeId);
}

async function parseJsonBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  assertAdminEnabled();

  const body = await parseJsonBody(req);
  if (!body) {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi' }, { status: 400 });
  }

  const baslik = typeof body.baslik === 'string' ? body.baslik.trim() : '';
  if (!baslik) {
    return NextResponse.json({ error: 'Başlık zorunludur' }, { status: 400 });
  }

  const slug = resolveSlug(body.slug, baslik);

  const data: ProductInput = {
    baslik,
    slug,
    kisa_aciklama: typeof body.kisa_aciklama === 'string' ? body.kisa_aciklama : undefined,
    detay: typeof body.detay === 'string' ? body.detay : undefined,
    kapak_gorsel: typeof body.kapak_gorsel === 'string' ? body.kapak_gorsel : undefined,
    canli_link: typeof body.canli_link === 'string' ? body.canli_link : undefined,
    github_link: typeof body.github_link === 'string' ? body.github_link : undefined,
    teknolojiler: Array.isArray(body.teknolojiler) ? (body.teknolojiler as string[]) : undefined,
    sira: typeof body.sira === 'number' ? body.sira : undefined,
    yayinda: typeof body.yayinda === 'boolean' ? body.yayinda : undefined,
  };

  const id = createProduct(data);
  return NextResponse.json({ id }, { status: 201 });
}

export async function PUT(req: Request): Promise<Response> {
  assertAdminEnabled();

  const body = await parseJsonBody(req);
  if (!body) {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi' }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Geçersiz id' }, { status: 400 });
  }

  const db = getDb();
  const existingRow = db.prepare('SELECT baslik FROM products WHERE id = ?').get(id) as
    | { baslik: string }
    | undefined;
  if (!existingRow) {
    return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
  }

  const data: Partial<ProductInput> = {};

  if (typeof body.baslik === 'string') {
    const trimmed = body.baslik.trim();
    if (!trimmed) {
      return NextResponse.json({ error: 'Başlık boş olamaz' }, { status: 400 });
    }
    data.baslik = trimmed;
  }

  if ('slug' in body) {
    const baslikForSlug = data.baslik ?? existingRow.baslik;
    data.slug = resolveSlug(body.slug, baslikForSlug, id);
  }

  if (typeof body.kisa_aciklama === 'string') data.kisa_aciklama = body.kisa_aciklama;
  if (typeof body.detay === 'string') data.detay = body.detay;
  if (typeof body.kapak_gorsel === 'string') data.kapak_gorsel = body.kapak_gorsel;
  if (typeof body.canli_link === 'string') data.canli_link = body.canli_link;
  if (typeof body.github_link === 'string') data.github_link = body.github_link;
  if (Array.isArray(body.teknolojiler)) data.teknolojiler = body.teknolojiler as string[];
  if (typeof body.sira === 'number') data.sira = body.sira;
  if (typeof body.yayinda === 'boolean') data.yayinda = body.yayinda;

  updateProduct(id, data, db);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request): Promise<Response> {
  assertAdminEnabled();

  const { searchParams } = new URL(req.url);
  let idParam: unknown = searchParams.get('id');

  if (idParam === null) {
    const body = await parseJsonBody(req);
    idParam = body?.id ?? null;
  }

  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Geçersiz id' }, { status: 400 });
  }

  deleteProduct(id);
  return NextResponse.json({ ok: true });
}
