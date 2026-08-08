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
});
