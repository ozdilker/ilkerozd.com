import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';

let dbInstance: Database.Database | null = null;

/**
 * Üç tabloyu (products, gallery, settings) oluşturur ve settings
 * tablosuna id=1 olan tek satırı (yoksa) ekler.
 */
export function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      baslik TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      kisa_aciklama TEXT NOT NULL DEFAULT '',
      detay TEXT NOT NULL DEFAULT '',
      kapak_gorsel TEXT NOT NULL DEFAULT '',
      canli_link TEXT NOT NULL DEFAULT '',
      github_link TEXT NOT NULL DEFAULT '',
      teknolojiler TEXT NOT NULL DEFAULT '[]',
      tur TEXT NOT NULL DEFAULT 'web',
      gorseller TEXT NOT NULL DEFAULT '[]',
      sira INTEGER NOT NULL DEFAULT 0,
      yayinda INTEGER NOT NULL DEFAULT 1,
      olusturma TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gorsel TEXT NOT NULL,
      baslik TEXT NOT NULL DEFAULT '',
      aciklama TEXT NOT NULL DEFAULT '',
      sira INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      isim TEXT NOT NULL DEFAULT '',
      unvan TEXT NOT NULL DEFAULT '',
      hero_tagline TEXT NOT NULL DEFAULT '',
      hero_gorsel TEXT NOT NULL DEFAULT '',
      kapak_gorsel_2 TEXT NOT NULL DEFAULT '',
      hakkimda_gorsel TEXT NOT NULL DEFAULT '',
      iletisim_gorsel TEXT NOT NULL DEFAULT '',
      hakkimda_metin TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      github TEXT NOT NULL DEFAULT '',
      linkedin TEXT NOT NULL DEFAULT '',
      twitter TEXT NOT NULL DEFAULT ''
    );
  `);

  db.prepare('INSERT OR IGNORE INTO settings (id) VALUES (1)').run();

  // Migration: daha eski şemayla oluşturulmuş (ör. commit'li) bir products
  // tablosuna yeni kolonları ekler. CREATE TABLE IF NOT EXISTS mevcut tabloyu
  // değiştirmez; bu yüzden eksik kolonları ALTER ile ekliyoruz (idempotent,
  // mevcut satırlar varsayılan değerle korunur).
  const productCols = new Set(
    (db.prepare('PRAGMA table_info(products)').all() as { name: string }[]).map((c) => c.name)
  );
  if (!productCols.has('tur')) {
    db.exec("ALTER TABLE products ADD COLUMN tur TEXT NOT NULL DEFAULT 'web'");
  }
  if (!productCols.has('gorseller')) {
    db.exec("ALTER TABLE products ADD COLUMN gorseller TEXT NOT NULL DEFAULT '[]'");
  }
}

/**
 * `data/portfolio.db` dosyasını açar, şemayı kurar ve singleton
 * Database örneğini döndürür.
 */
export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'portfolio.db');
  dbInstance = new Database(dbPath);
  initSchema(dbInstance);

  return dbInstance;
}
