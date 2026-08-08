import { NextResponse } from 'next/server';
import { assertAdminEnabled } from '@/lib/adminGuard';
import { reorderProducts } from '@/lib/mutations';

/**
 * Ürünlerin sırasını günceller. Body: `{ ids: number[] }` — dizideki
 * sıraya göre her ürünün `sira` alanı index olarak ayarlanır.
 */
export async function POST(req: Request): Promise<Response> {
  assertAdminEnabled();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi' }, { status: 400 });
  }

  const ids = (body as Record<string, unknown> | null)?.ids;
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'number' && Number.isInteger(id))) {
    return NextResponse.json({ error: 'ids sayı dizisi olmalıdır' }, { status: 400 });
  }

  reorderProducts(ids as number[]);
  return NextResponse.json({ ok: true });
}
