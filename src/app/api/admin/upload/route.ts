import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { assertAdminEnabled } from '@/lib/adminGuard';

const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);

/**
 * Multipart form-data ile gelen `file` alanını doğrular ve
 * `public/uploads/` altına çakışmasız (uuid) bir adla yazar.
 * Başarılıysa `{ path: '/uploads/<ad>.<ext>' }` döndürür.
 */
export async function POST(req: Request): Promise<Response> {
  assertAdminEnabled();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Geçersiz form verisi' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
  }

  const ext = path.extname(file.name).slice(1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: 'Geçersiz dosya türü' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

  return NextResponse.json({ path: `/uploads/${filename}` }, { status: 201 });
}
