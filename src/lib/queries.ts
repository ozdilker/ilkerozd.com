import type Database from 'better-sqlite3';
import { getDb } from './db';
import type { Product, GalleryItem, Settings } from './types';

interface ProductRow {
  id: number;
  baslik: string;
  slug: string;
  kisa_aciklama: string;
  detay: string;
  kapak_gorsel: string;
  canli_link: string;
  github_link: string;
  teknolojiler: string;
  tur: string;
  gorseller: string;
  sira: number;
  yayinda: number;
  olusturma: string;
}

/** DB satırındaki `teknolojiler` JSON string'ini ve `yayinda` 0/1 değerini uygun tiplere çevirir. */
function mapProduct(row: ProductRow): Product {
  return {
    ...row,
    teknolojiler: JSON.parse(row.teknolojiler) as string[],
    gorseller: JSON.parse(row.gorseller) as string[],
    tur: row.tur === 'mobil' ? 'mobil' : 'web',
    yayinda: row.yayinda === 1,
  };
}

/** Tekil settings satırını (id=1) döndürür. */
export function getSettings(db: Database.Database = getDb()): Settings {
  return db.prepare('SELECT * FROM settings WHERE id = 1').get() as Settings;
}

/** Yalnızca yayında (yayinda=1) olan ürünleri sira ASC sırasıyla döndürür. */
export function getPublishedProducts(db: Database.Database = getDb()): Product[] {
  const rows = db
    .prepare('SELECT * FROM products WHERE yayinda = 1 ORDER BY sira ASC')
    .all() as ProductRow[];
  return rows.map(mapProduct);
}

/** Tüm ürünleri (yayında/taslak fark etmeksizin) sira ASC sırasıyla döndürür. Admin listesi için kullanılır. */
export function getAllProducts(db: Database.Database = getDb()): Product[] {
  const rows = db.prepare('SELECT * FROM products ORDER BY sira ASC').all() as ProductRow[];
  return rows.map(mapProduct);
}

/** Slug'a göre ürünü döndürür; bulunamazsa null döner. */
export function getProductBySlug(
  slug: string,
  db: Database.Database = getDb()
): Product | null {
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as
    | ProductRow
    | undefined;
  return row ? mapProduct(row) : null;
}

/** Yayındaki ürünlerden sira ASC sırasıyla ilk `limit` kadarını döndürür. */
export function getFeaturedProducts(
  limit = 3,
  db: Database.Database = getDb()
): Product[] {
  const rows = db
    .prepare('SELECT * FROM products WHERE yayinda = 1 ORDER BY sira ASC LIMIT ?')
    .all(limit) as ProductRow[];
  return rows.map(mapProduct);
}

/** Galeri öğelerini sira ASC sırasıyla döndürür. */
export function getGallery(db: Database.Database = getDb()): GalleryItem[] {
  return db.prepare('SELECT * FROM gallery ORDER BY sira ASC').all() as GalleryItem[];
}
