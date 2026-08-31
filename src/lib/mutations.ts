import type Database from 'better-sqlite3';
import { getDb } from './db';
import type { Product, GalleryItem, Settings } from './types';

/**
 * `createProduct`/`updateProduct` için girdi tipi (id ve olusturma hariç).
 * `baslik` zorunlu, geri kalan alanlar opsiyoneldir (verilmezse varsayılan
 * değerler kullanılır; slug boşsa baslik'ten türetilir).
 */
export type ProductInput = Pick<Product, 'baslik'> & Partial<Omit<Product, 'id' | 'olusturma' | 'baslik'>>;

/**
 * `createGalleryItem`/`updateGalleryItem` için girdi tipi (id hariç).
 * `gorsel` zorunlu, geri kalan alanlar opsiyoneldir.
 */
export type GalleryItemInput = Pick<GalleryItem, 'gorsel'> & Partial<Omit<GalleryItem, 'id' | 'gorsel'>>;

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
};

/**
 * Türkçe başlıktan URL-uyumlu bir slug türetir: Türkçe locale ile küçük
 * harfe çevirir (İ→i, I→ı doğru eşlenir), Türkçe karakterleri sadeleştirir
 * (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u), alfanümerik olmayan karakter dizilerini
 * tek bir tireye indirger ve baştaki/sondaki tireleri kırpar.
 */
export function turkishSlugify(text: string): string {
  const lowered = text.toLocaleLowerCase('tr-TR');
  const simplified = lowered.replace(/[çğıöşü]/g, (ch) => TURKISH_CHAR_MAP[ch] ?? ch);
  return simplified.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Yeni bir ürün ekler. `slug` boş/verilmemişse `baslik`ten türetilir.
 * `teknolojiler` JSON string olarak, `yayinda` 0/1 olarak yazılır.
 * Yeni kaydın id'sini döndürür.
 */
export function createProduct(data: ProductInput, db: Database.Database = getDb()): number {
  const slug = data.slug && data.slug.trim() !== '' ? data.slug : turkishSlugify(data.baslik);

  const result = db
    .prepare(
      `INSERT INTO products
        (baslik, slug, kisa_aciklama, detay, kapak_gorsel, canli_link, github_link, teknolojiler, tur, gorseller, sira, yayinda)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.baslik,
      slug,
      data.kisa_aciklama ?? '',
      data.detay ?? '',
      data.kapak_gorsel ?? '',
      data.canli_link ?? '',
      data.github_link ?? '',
      JSON.stringify(data.teknolojiler ?? []),
      data.tur === 'mobil' ? 'mobil' : 'web',
      JSON.stringify(data.gorseller ?? []),
      data.sira ?? 0,
      data.yayinda === undefined || data.yayinda ? 1 : 0
    );

  return Number(result.lastInsertRowid);
}

/** Verilen alanları günceller; belirtilmeyen alanlar değişmeden kalır. */
export function updateProduct(
  id: number,
  data: Partial<ProductInput>,
  db: Database.Database = getDb()
): void {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.baslik !== undefined) {
    fields.push('baslik = ?');
    values.push(data.baslik);
  }
  if (data.slug !== undefined) {
    fields.push('slug = ?');
    values.push(data.slug);
  }
  if (data.kisa_aciklama !== undefined) {
    fields.push('kisa_aciklama = ?');
    values.push(data.kisa_aciklama);
  }
  if (data.detay !== undefined) {
    fields.push('detay = ?');
    values.push(data.detay);
  }
  if (data.kapak_gorsel !== undefined) {
    fields.push('kapak_gorsel = ?');
    values.push(data.kapak_gorsel);
  }
  if (data.canli_link !== undefined) {
    fields.push('canli_link = ?');
    values.push(data.canli_link);
  }
  if (data.github_link !== undefined) {
    fields.push('github_link = ?');
    values.push(data.github_link);
  }
  if (data.teknolojiler !== undefined) {
    fields.push('teknolojiler = ?');
    values.push(JSON.stringify(data.teknolojiler));
  }
  if (data.tur !== undefined) {
    fields.push('tur = ?');
    values.push(data.tur === 'mobil' ? 'mobil' : 'web');
  }
  if (data.gorseller !== undefined) {
    fields.push('gorseller = ?');
    values.push(JSON.stringify(data.gorseller));
  }
  if (data.sira !== undefined) {
    fields.push('sira = ?');
    values.push(data.sira);
  }
  if (data.yayinda !== undefined) {
    fields.push('yayinda = ?');
    values.push(data.yayinda ? 1 : 0);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

/** Ürünü id'ye göre siler. */
export function deleteProduct(id: number, db: Database.Database = getDb()): void {
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

/** `ids` dizisindeki sıraya göre her ürünün `sira` alanını index olarak ayarlar. */
export function reorderProducts(ids: number[], db: Database.Database = getDb()): void {
  const stmt = db.prepare('UPDATE products SET sira = ? WHERE id = ?');
  const applyOrder = db.transaction((idList: number[]) => {
    idList.forEach((id, index) => {
      stmt.run(index, id);
    });
  });
  applyOrder(ids);
}

/** Yeni bir galeri öğesi ekler, yeni kaydın id'sini döndürür. */
export function createGalleryItem(
  data: GalleryItemInput,
  db: Database.Database = getDb()
): number {
  const result = db
    .prepare('INSERT INTO gallery (gorsel, baslik, aciklama, sira) VALUES (?, ?, ?, ?)')
    .run(data.gorsel, data.baslik ?? '', data.aciklama ?? '', data.sira ?? 0);
  return Number(result.lastInsertRowid);
}

/** Verilen alanları günceller; belirtilmeyen alanlar değişmeden kalır. */
export function updateGalleryItem(
  id: number,
  data: Partial<GalleryItemInput>,
  db: Database.Database = getDb()
): void {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.gorsel !== undefined) {
    fields.push('gorsel = ?');
    values.push(data.gorsel);
  }
  if (data.baslik !== undefined) {
    fields.push('baslik = ?');
    values.push(data.baslik);
  }
  if (data.aciklama !== undefined) {
    fields.push('aciklama = ?');
    values.push(data.aciklama);
  }
  if (data.sira !== undefined) {
    fields.push('sira = ?');
    values.push(data.sira);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  db.prepare(`UPDATE gallery SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

/** Galeri öğesini id'ye göre siler. */
export function deleteGalleryItem(id: number, db: Database.Database = getDb()): void {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(id);
}

const SETTINGS_KEYS: (keyof Settings)[] = [
  'isim',
  'unvan',
  'hero_tagline',
  'hero_gorsel',
  'kapak_gorsel_2',
  'hakkimda_gorsel',
  'iletisim_gorsel',
  'hakkimda_metin',
  'email',
  'github',
  'linkedin',
  'twitter',
];

/** Tekil settings satırını (id=1) verilen alanlarla günceller. */
export function updateSettings(data: Partial<Settings>, db: Database.Database = getDb()): void {
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const key of SETTINGS_KEYS) {
    const value = data[key];
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return;
  }

  values.push(1);
  db.prepare(`UPDATE settings SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}
