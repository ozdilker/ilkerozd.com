import { NextResponse } from 'next/server';
import { assertAdminEnabled } from '@/lib/adminGuard';
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/mutations';
import type { GalleryItemInput } from '@/lib/mutations';
import { getDb } from '@/lib/db';

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

  const gorsel = typeof body.gorsel === 'string' ? body.gorsel.trim() : '';
  if (!gorsel) {
    return NextResponse.json({ error: 'Görsel zorunludur' }, { status: 400 });
  }

  const data: GalleryItemInput = {
    gorsel,
    baslik: typeof body.baslik === 'string' ? body.baslik : undefined,
    aciklama: typeof body.aciklama === 'string' ? body.aciklama : undefined,
    sira: typeof body.sira === 'number' ? body.sira : undefined,
  };

  const id = createGalleryItem(data);
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
  const existing = db.prepare('SELECT id FROM gallery WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Galeri öğesi bulunamadı' }, { status: 404 });
  }

  const data: Partial<GalleryItemInput> = {};

  if (typeof body.gorsel === 'string') {
    const trimmed = body.gorsel.trim();
    if (!trimmed) {
      return NextResponse.json({ error: 'Görsel boş olamaz' }, { status: 400 });
    }
    data.gorsel = trimmed;
  }
  if (typeof body.baslik === 'string') data.baslik = body.baslik;
  if (typeof body.aciklama === 'string') data.aciklama = body.aciklama;
  if (typeof body.sira === 'number') data.sira = body.sira;

  updateGalleryItem(id, data, db);
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

  deleteGalleryItem(id);
  return NextResponse.json({ ok: true });
}
