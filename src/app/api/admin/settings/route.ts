import { NextResponse } from 'next/server';
import { assertAdminEnabled } from '@/lib/adminGuard';
import { updateSettings } from '@/lib/mutations';
import type { Settings } from '@/lib/types';

const SETTINGS_KEYS: (keyof Settings)[] = [
  'isim',
  'unvan',
  'hero_tagline',
  'hero_gorsel',
  'hakkimda_metin',
  'email',
  'github',
  'linkedin',
  'twitter',
];

export async function PUT(req: Request): Promise<Response> {
  assertAdminEnabled();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi' }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const data: Partial<Settings> = {};

  for (const key of SETTINGS_KEYS) {
    const value = record[key];
    if (typeof value === 'string') {
      data[key] = value;
    }
  }

  updateSettings(data);
  return NextResponse.json({ ok: true });
}
