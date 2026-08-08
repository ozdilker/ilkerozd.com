import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import { initSchema } from './db';
import {
  getSettings,
  getAllProducts,
  getPublishedProducts,
  getProductBySlug,
  getFeaturedProducts,
  getGallery,
} from './queries';

function seedDb() {
  const db = new Database(':memory:');
  initSchema(db);
  return db;
}

describe('getPublishedProducts', () => {
  it('yalnızca yayındaki ürünleri sıralı döndürür', () => {
    const db = seedDb();
    db.prepare(`INSERT INTO products (baslik,slug,kisa_aciklama,detay,kapak_gorsel,canli_link,github_link,teknolojiler,sira,yayinda,olusturma) VALUES
      ('B','b','','','','','','["Next.js"]',2,1,''),
      ('A','a','','','','','','[]',1,1,''),
      ('Gizli','g','','','','','','[]',3,0,'')`).run();
    const rows = getPublishedProducts(db);
    expect(rows.map(r => r.slug)).toEqual(['a', 'b']);
    expect(rows[1].teknolojiler).toEqual(['Next.js']);
  });

  it('yayinda alanını boolean olarak döndürür', () => {
    const db = seedDb();
    db.prepare(`INSERT INTO products (baslik,slug,teknolojiler,sira,yayinda) VALUES
      ('A','a','[]',1,1)`).run();
    const rows = getPublishedProducts(db);
    expect(rows[0].yayinda).toBe(true);
    expect(typeof rows[0].yayinda).toBe('boolean');
  });
});

describe('getAllProducts', () => {
  it('yayında olsun olmasın tüm ürünleri sira ASC sırasıyla döndürür', () => {
    const db = seedDb();
    db.prepare(`INSERT INTO products (baslik,slug,teknolojiler,sira,yayinda) VALUES
      ('B','b','[]',2,1),
      ('A','a','[]',1,0),
      ('C','c','[]',3,0)`).run();
    const rows = getAllProducts(db);
    expect(rows.map((r) => r.slug)).toEqual(['a', 'b', 'c']);
    expect(rows.map((r) => r.yayinda)).toEqual([false, true, false]);
  });
});

describe('getProductBySlug', () => {
  it('bulunan ürünü döndürür', () => {
    const db = seedDb();
    db.prepare(`INSERT INTO products (baslik,slug,teknolojiler,sira,yayinda) VALUES
      ('A','a','["React"]',1,1)`).run();
    const row = getProductBySlug('a', db);
    expect(row).not.toBeNull();
    expect(row?.baslik).toBe('A');
    expect(row?.teknolojiler).toEqual(['React']);
  });

  it('bulunamazsa null döndürür', () => {
    const db = seedDb();
    const row = getProductBySlug('yok', db);
    expect(row).toBeNull();
  });
});

describe('getFeaturedProducts', () => {
  it('yayındaki ürünleri sira ASC sırasıyla limitli döndürür', () => {
    const db = seedDb();
    db.prepare(`INSERT INTO products (baslik,slug,teknolojiler,sira,yayinda) VALUES
      ('C','c','[]',3,1),
      ('A','a','[]',1,1),
      ('B','b','[]',2,1),
      ('Gizli','g','[]',0,0)`).run();
    const rows = getFeaturedProducts(2, db);
    expect(rows.map(r => r.slug)).toEqual(['a', 'b']);
  });

  it('varsayılan limit 3 kullanır', () => {
    const db = seedDb();
    db.prepare(`INSERT INTO products (baslik,slug,teknolojiler,sira,yayinda) VALUES
      ('A','a','[]',1,1),
      ('B','b','[]',2,1),
      ('C','c','[]',3,1),
      ('D','d','[]',4,1)`).run();
    const rows = getFeaturedProducts(undefined, db);
    expect(rows.length).toBe(3);
  });
});

describe('getGallery', () => {
  it('sira ASC sırasıyla döndürür', () => {
    const db = seedDb();
    db.prepare(`INSERT INTO gallery (gorsel,baslik,aciklama,sira) VALUES
      ('img-b.png','B','',2),
      ('img-a.png','A','',1)`).run();
    const rows = getGallery(db);
    expect(rows.map(r => r.gorsel)).toEqual(['img-a.png', 'img-b.png']);
  });
});

describe('getSettings', () => {
  it('tekil settings satırını döndürür', () => {
    const db = seedDb();
    db.prepare(`UPDATE settings SET isim = 'İlker Özdemir' WHERE id = 1`).run();
    const settings = getSettings(db);
    expect(settings.isim).toBe('İlker Özdemir');
  });
});
