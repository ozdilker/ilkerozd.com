import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import { initSchema } from './db';

describe('initSchema', () => {
  it('üç tabloyu oluşturur ve settings tek satır ekler', () => {
    const db = new Database(':memory:');
    initSchema(db);
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table'"
    ).all().map((r: any) => r.name);
    expect(tables).toEqual(expect.arrayContaining(['products', 'gallery', 'settings']));
    const count = db.prepare('SELECT COUNT(*) c FROM settings').get() as any;
    expect(count.c).toBe(1);
  });

  it('eski products şemasına tur/gorseller kolonlarını ekler ve satırı korur', () => {
    const db = new Database(':memory:');
    // tur/gorseller kolonları OLMAYAN eski şema:
    db.exec(`CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      baslik TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      kisa_aciklama TEXT NOT NULL DEFAULT '',
      detay TEXT NOT NULL DEFAULT '',
      kapak_gorsel TEXT NOT NULL DEFAULT '',
      canli_link TEXT NOT NULL DEFAULT '',
      github_link TEXT NOT NULL DEFAULT '',
      teknolojiler TEXT NOT NULL DEFAULT '[]',
      sira INTEGER NOT NULL DEFAULT 0,
      yayinda INTEGER NOT NULL DEFAULT 1,
      olusturma TEXT NOT NULL DEFAULT ''
    )`);
    db.prepare('INSERT INTO products (baslik, slug) VALUES (?, ?)').run('Eski Ürün', 'eski-urun');

    initSchema(db);

    const cols = (db.prepare('PRAGMA table_info(products)').all() as any[]).map((c) => c.name);
    expect(cols).toContain('tur');
    expect(cols).toContain('gorseller');

    const row = db.prepare('SELECT * FROM products WHERE slug = ?').get('eski-urun') as any;
    expect(row.baslik).toBe('Eski Ürün');
    expect(row.tur).toBe('web');
    expect(row.gorseller).toBe('[]');
  });
});
