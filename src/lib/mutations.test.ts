import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import { initSchema } from './db';
import { getProductBySlug, getSettings, getGallery } from './queries';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateSettings,
} from './mutations';

function seedDb() {
  const db = new Database(':memory:');
  initSchema(db);
  return db;
}

describe('createProduct / deleteProduct', () => {
  it('oluşturulan ürün getProductBySlug ile bulunur', () => {
    const db = seedDb();
    const id = createProduct(
      {
        baslik: 'Test Ürün',
        slug: 'test-urun',
        kisa_aciklama: 'kısa',
        detay: 'detay',
        kapak_gorsel: '',
        canli_link: '',
        github_link: '',
        teknolojiler: ['Next.js', 'TypeScript'],
        sira: 1,
        yayinda: true,
      },
      db
    );
    expect(typeof id).toBe('number');
    const product = getProductBySlug('test-urun', db);
    expect(product).not.toBeNull();
    expect(product?.baslik).toBe('Test Ürün');
    expect(product?.teknolojiler).toEqual(['Next.js', 'TypeScript']);
    expect(product?.yayinda).toBe(true);
  });

  it('silinen ürün getProductBySlug ile artık bulunamaz', () => {
    const db = seedDb();
    const id = createProduct({ baslik: 'Silinecek', slug: 'silinecek' }, db);
    deleteProduct(id, db);
    expect(getProductBySlug('silinecek', db)).toBeNull();
  });

  it('slug boşsa baslikten türetilir (Türkçe karakter sadeleştirme)', () => {
    const db = seedDb();
    createProduct({ baslik: 'Görsel İşleyici Pro' }, db);
    const product = getProductBySlug('gorsel-isleyici-pro', db);
    expect(product).not.toBeNull();
    expect(product?.baslik).toBe('Görsel İşleyici Pro');
  });

  it('teknolojiler verilmezse boş dizi ile başlar, yayinda varsayılan true', () => {
    const db = seedDb();
    createProduct({ baslik: 'Varsayılan', slug: 'varsayilan' }, db);
    const product = getProductBySlug('varsayilan', db);
    expect(product?.teknolojiler).toEqual([]);
    expect(product?.yayinda).toBe(true);
  });
});

describe('updateProduct', () => {
  it('verilen alanları günceller, diğerlerini korur', () => {
    const db = seedDb();
    const id = createProduct(
      { baslik: 'Eski', slug: 'eski', teknolojiler: ['React'], yayinda: true },
      db
    );
    updateProduct(id, { baslik: 'Yeni', teknolojiler: ['Vue'], yayinda: false }, db);
    const product = getProductBySlug('eski', db);
    expect(product?.baslik).toBe('Yeni');
    expect(product?.teknolojiler).toEqual(['Vue']);
    expect(product?.yayinda).toBe(false);
  });
});

describe('reorderProducts', () => {
  it('sira değerini id dizisindeki index sırasına göre ayarlar', () => {
    const db = seedDb();
    const idA = createProduct({ baslik: 'A', slug: 'a', sira: 0 }, db);
    const idB = createProduct({ baslik: 'B', slug: 'b', sira: 1 }, db);
    const idC = createProduct({ baslik: 'C', slug: 'c', sira: 2 }, db);

    reorderProducts([idC, idA, idB], db);

    const rows = db
      .prepare('SELECT id, sira FROM products ORDER BY id ASC')
      .all() as { id: number; sira: number }[];
    const siraById = new Map(rows.map((r) => [r.id, r.sira]));
    expect(siraById.get(idC)).toBe(0);
    expect(siraById.get(idA)).toBe(1);
    expect(siraById.get(idB)).toBe(2);
  });
});

describe('gallery CRUD', () => {
  it('createGalleryItem / updateGalleryItem / deleteGalleryItem', () => {
    const db = seedDb();
    const id = createGalleryItem({ gorsel: 'a.png', baslik: 'A', aciklama: '', sira: 1 }, db);
    expect(getGallery(db).map((g) => g.gorsel)).toEqual(['a.png']);

    updateGalleryItem(id, { baslik: 'Güncel' }, db);
    expect(getGallery(db)[0].baslik).toBe('Güncel');

    deleteGalleryItem(id, db);
    expect(getGallery(db)).toEqual([]);
  });
});

describe('updateSettings', () => {
  it('isim alanını günceller, getSettings yansıtır', () => {
    const db = seedDb();
    updateSettings({ isim: 'İlker Özdemir' }, db);
    const settings = getSettings(db);
    expect(settings.isim).toBe('İlker Özdemir');
  });

  it('sayfa görseli alanlarını yazar ve okur', () => {
    const db = seedDb();
    updateSettings(
      {
        kapak_gorsel_2: '/uploads/y.jpg',
        hakkimda_gorsel: '/uploads/x.jpg',
        iletisim_gorsel: '/uploads/z.jpg',
      },
      db,
    );
    const s = getSettings(db);
    expect(s.kapak_gorsel_2).toBe('/uploads/y.jpg');
    expect(s.hakkimda_gorsel).toBe('/uploads/x.jpg');
    expect(s.iletisim_gorsel).toBe('/uploads/z.jpg');
  });
});
