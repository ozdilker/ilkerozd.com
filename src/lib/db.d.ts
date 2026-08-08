import type Database from 'better-sqlite3';

/**
 * `db.mts` için tip bildirimi (declaration) dosyası.
 *
 * `db.mts`, `seed.mts` betiğinin Node ESM altında doğrudan
 * (`node --experimental-strip-types`) çalıştırılabilmesi için `.mts`
 * uzantısını taşımak zorunda. Ama TypeScript'in "bundler" modül
 * çözümlemesi, uzantısız `import ... from './db'` durumunda
 * `.mts`/`.d.mts` dosyalarını aday olarak denemiyor (yalnızca .ts/.tsx/.d.ts/.js/.jsx).
 * Next.js'in derleme zamanı tip denetimi de aynı çözümleyiciyi kullandığından,
 * `queries.ts` gibi `./db` şeklinde uzantısız import eden dosyalarda
 * "Cannot find module './db'" hatası veriyordu (vitest/Vite kendi
 * çözümleyicisini kullandığı için bu sorunu yaşamıyor).
 *
 * Bu dosya yalnızca tip bilgisi sağlar; çalışma zamanında hâlâ gerçek
 * `db.mts` dosyası kullanılır (webpack/vite paketleyicileri `.mts` uzantısını
 * kendi çözümlemelerinde buluyor). `db.mts`'teki imza değişirse bu dosya da
 * güncellenmeli.
 */
export declare function initSchema(db: Database.Database): void;
export declare function getDb(): Database.Database;
