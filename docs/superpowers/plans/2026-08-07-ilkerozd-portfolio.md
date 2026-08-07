# ilkerozd.com Portfolyo Sitesi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** İlker için, admin CMS'i yerelde çalışan, verisi repodaki gömülü SQLite'ta duran, Vercel'e statik yayınlanan koyu temalı Türkçe portfolyo sitesi kurmak.

**Architecture:** Tek Next.js (App Router) projesi. Yerelde `npm run dev` ile `/admin` paneli SQLite'a yazar ve görselleri `public/uploads/`'a kaydeder. `npm run build`'de tüm herkese açık sayfalar build anında SQLite'tan okunup statik HTML'e (`force-static`) dönüştürülür. `/admin` ve `/api/admin/*` production'da 404 döner. İçerik güncelleme = yerelde düzenle → commit → push → Vercel yeniden yayınlar.

**Tech Stack:** Next.js 15 (App Router), TypeScript, better-sqlite3, React, CSS Modules / global CSS (koyu tema), Vitest (test).

## Global Constraints

- Dil: Türkçe (tek dil). Tüm kullanıcıya görünen metin ve admin Türkçe.
- Harici/ücretli DB servisi YOK (Supabase/Firestore vb. yasak). Veri: repodaki `data/portfolio.db` (SQLite).
- Tema: Koyu / developer estetik; hero.png ile uyumlu, sıcak amber vurgu.
- Admin yalnızca yerelde: `/admin` ve `/api/admin/*` production'da (`process.env.NODE_ENV === 'production'`) 404.
- Tüm public sayfalar `export const dynamic = 'force-static'` ile build anında üretilir; runtime'da SQLite'a erişim yok.
- Node sürümü: 20+. Paket yöneticisi: npm.
- Görseller `public/uploads/` altında; DB'de yalnızca yol (`/uploads/...`) tutulur.
- Sık commit; her task bağımsız test edilebilir bir çıktı üretir.

## Dosya Yapısı

```
ilkerozd.com/
├─ data/
│  └─ portfolio.db              # gömülü SQLite (repoda commit edilir)
├─ public/
│  ├─ hero.png                  # mevcut hero görseli (kökten taşınır)
│  └─ uploads/                  # admin'in yüklediği görseller
├─ src/
│  ├─ lib/
│  │  ├─ db.ts                  # SQLite bağlantısı + şema init (singleton)
│  │  ├─ queries.ts             # okuma sorguları (public sayfalar kullanır)
│  │  ├─ mutations.ts           # yazma işlemleri (admin API kullanır)
│  │  └─ types.ts               # Product, GalleryItem, Settings tipleri
│  ├─ app/
│  │  ├─ layout.tsx             # kök layout, koyu tema, global stil
│  │  ├─ globals.css            # tema değişkenleri + temel stiller
│  │  ├─ page.tsx               # ana sayfa (hero+hakkımda+ürünler+galeri+iletişim)
│  │  ├─ portfolyo/
│  │  │  ├─ page.tsx            # ürün grid'i
│  │  │  └─ [slug]/page.tsx     # ürün detay
│  │  ├─ galeri/page.tsx        # galeri + lightbox
│  │  ├─ admin/                 # yalnızca dev
│  │  │  ├─ layout.tsx          # prod'da notFound() guard
│  │  │  ├─ page.tsx            # admin dashboard
│  │  │  ├─ urunler/…           # ürün CRUD ekranları
│  │  │  ├─ galeri/…            # galeri CRUD
│  │  │  └─ ayarlar/…           # settings formu
│  │  ├─ api/admin/
│  │  │  ├─ products/route.ts   # POST/PUT/DELETE ürün
│  │  │  ├─ gallery/route.ts    # POST/PUT/DELETE galeri
│  │  │  ├─ settings/route.ts   # PUT ayarlar
│  │  │  └─ upload/route.ts     # görsel yükleme → public/uploads
│  │  └─ components/            # Hero, ProductCard, Gallery, Lightbox, Nav, Footer...
│  └─ scripts/
│     └─ seed.ts                # şemayı oluştur + hero.png'yi settings'e ata + örnek veri
├─ next.config.ts
├─ package.json
├─ tsconfig.json
├─ vitest.config.ts
└─ .env.example
```

---

### Task 1: Proje iskeleti ve araçlar

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `.env.example`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

**Interfaces:**
- Produces: Çalışan bir Next.js iskeleti; `npm run dev` açılır, `npm run build` geçer, `npm test` çalışır.

- [ ] **Step 1:** `npm init -y` sonrası bağımlılıkları kur:

```bash
cd "C:/Users/USER/Desktop/ilkerozd.com"
npm install next@15 react react-dom better-sqlite3
npm install -D typescript @types/node @types/react @types/react-dom @types/better-sqlite3 vitest
```

- [ ] **Step 2:** `package.json` scripts alanını ayarla:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "seed": "node --experimental-strip-types src/scripts/seed.ts",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3:** `tsconfig.json` (Next.js standart), `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
};
export default nextConfig;
```

- [ ] **Step 4:** `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node' } });
```

- [ ] **Step 5:** Minimal `src/app/layout.tsx`, `src/app/globals.css` (koyu tema değişkenleri), `src/app/page.tsx` ("İlker" yazan geçici içerik). `.env.example`'a `ADMIN_ENABLED` notu.

- [ ] **Step 6:** Doğrula: `npm run build` başarılı.

Run: `npm run build`
Expected: Build succeeds, hiç sayfa hatası yok.

- [ ] **Step 7:** Commit.

```bash
git add -A && git commit -m "chore: Next.js iskeleti ve araç kurulumu"
```

---

### Task 2: Veri katmanı — tipler ve SQLite şeması

**Files:**
- Create: `src/lib/types.ts`, `src/lib/db.ts`, `src/scripts/seed.ts`, `data/.gitkeep`
- Test: `src/lib/db.test.ts`

**Interfaces:**
- Produces:
  - `types.ts`: `interface Product { id:number; baslik:string; slug:string; kisa_aciklama:string; detay:string; kapak_gorsel:string; canli_link:string; github_link:string; teknolojiler:string[]; sira:number; yayinda:boolean; olusturma:string }`, `interface GalleryItem { id:number; gorsel:string; baslik:string; aciklama:string; sira:number }`, `interface Settings { isim:string; unvan:string; hero_tagline:string; hero_gorsel:string; hakkimda_metin:string; email:string; github:string; linkedin:string; twitter:string }`
  - `db.ts`: `getDb(): Database` (singleton, `data/portfolio.db`), `initSchema(db): void` (CREATE TABLE IF NOT EXISTS products/gallery/settings; settings tek satır id=1).

- [ ] **Step 1: Failing test yaz** — `src/lib/db.test.ts`:

```ts
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
```

- [ ] **Step 2:** Testi çalıştır, fail olmalı.

Run: `npx vitest run src/lib/db.test.ts`
Expected: FAIL ("initSchema" export yok).

- [ ] **Step 3:** `types.ts`'i yaz. `db.ts`'i yaz: `initSchema(db)` yukarıdaki üç tabloyu kurar, `settings`'e `id=1` default satır (`INSERT OR IGNORE`) ekler; `getDb()` `data/portfolio.db`'yi açıp `initSchema` çağırır ve singleton döndürür.

- [ ] **Step 4:** Testi çalıştır, pass olmalı.

Run: `npx vitest run src/lib/db.test.ts`
Expected: PASS.

- [ ] **Step 5:** `src/scripts/seed.ts`: şemayı kurar, `settings` satırını varsayılanlarla günceller (isim "İlker Özd", unvan "Yazılım Geliştirici", hero_gorsel "/hero.png", email "ozd.ilker@gmail.com"), 2-3 örnek `products` ve birkaç `gallery` kaydı ekler (idempotent: önce `DELETE`/`INSERT OR REPLACE`). `data/.gitkeep` ekle.

- [ ] **Step 6:** Çalıştır: `npm run seed` → `data/portfolio.db` oluşur. Doğrula (kayıt sayısı > 0).

- [ ] **Step 7: Commit.**

```bash
git add -A && git commit -m "feat: SQLite şema, tipler ve seed script"
```

---

### Task 3: Okuma sorguları (public sayfalar için)

**Files:**
- Create: `src/lib/queries.ts`
- Test: `src/lib/queries.test.ts`

**Interfaces:**
- Consumes: `getDb`, `initSchema`, `types`.
- Produces: `getSettings(): Settings`, `getPublishedProducts(): Product[]` (yayında=1, sira ASC), `getProductBySlug(slug): Product | null`, `getFeaturedProducts(limit=3): Product[]`, `getGallery(): GalleryItem[]` (sira ASC). Hepsi `teknolojiler`'i JSON parse eder, `yayinda`'yı boolean'a çevirir.

- [ ] **Step 1: Failing test** — bellek-içi DB'ye seed benzeri veri ekleyip `getPublishedProducts` yalnızca yayında olanları `sira` sırasına göre döndürüyor mu test et; `teknolojiler`'in `string[]` döndüğünü doğrula.

```ts
import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import { initSchema } from './db';
import { getPublishedProducts } from './queries';

it('yalnızca yayındaki ürünleri sıralı döndürür', () => {
  const db = new Database(':memory:');
  initSchema(db);
  db.prepare(`INSERT INTO products (baslik,slug,kisa_aciklama,detay,kapak_gorsel,canli_link,github_link,teknolojiler,sira,yayinda,olusturma) VALUES
    ('B','b','','','','','','["Next.js"]',2,1,''),
    ('A','a','','','','','','[]',1,1,''),
    ('Gizli','g','','','','','','[]',3,0,'')`).run();
  const rows = getPublishedProducts(db);
  expect(rows.map(r => r.slug)).toEqual(['a','b']);
  expect(rows[1].teknolojiler).toEqual(['Next.js']);
});
```

(Not: query fonksiyonları test edilebilmesi için opsiyonel `db` parametresi almalı; verilmezse `getDb()` kullanır.)

- [ ] **Step 2:** Çalıştır → FAIL.

Run: `npx vitest run src/lib/queries.test.ts`

- [ ] **Step 3:** `queries.ts`'i yaz (her fonksiyon `db = getDb()` varsayılanı ile).

- [ ] **Step 4:** Çalıştır → PASS.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat: public okuma sorguları"
```

---

### Task 4: Yazma işlemleri (admin API için)

**Files:**
- Create: `src/lib/mutations.ts`
- Test: `src/lib/mutations.test.ts`

**Interfaces:**
- Consumes: `getDb`, `initSchema`, `types`.
- Produces: `createProduct(data, db?): number`, `updateProduct(id, data, db?): void`, `deleteProduct(id, db?): void`, `reorderProducts(ids:number[], db?): void`, `createGalleryItem(data, db?): number`, `updateGalleryItem(id,data,db?): void`, `deleteGalleryItem(id,db?): void`, `updateSettings(data, db?): void`. `teknolojiler` JSON stringify edilerek yazılır; slug boşsa baslik'ten türetilir.

- [ ] **Step 1: Failing test** — `createProduct` sonrası `getProductBySlug` kaydı döndürüyor; `deleteProduct` sonrası null. `updateSettings` ile isim güncellenip `getSettings` doğruluyor.

- [ ] **Step 2:** Çalıştır → FAIL.

- [ ] **Step 3:** `mutations.ts`'i yaz (slug türetme: küçük harf, Türkçe karakter sadeleştirme, boşluk→tire).

- [ ] **Step 4:** Çalıştır → PASS.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat: admin yazma işlemleri (CRUD)"
```

---

### Task 5: Public UI — layout, tema, komponentler ve ana sayfa

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/app/components/Nav.tsx`, `Hero.tsx`, `About.tsx`, `ProductCard.tsx`, `ProductGrid.tsx`, `ContactSection.tsx`, `Footer.tsx`
- Move: kökteki `hero.png` → `public/hero.png`

**Interfaces:**
- Consumes: `getSettings`, `getFeaturedProducts`, `getGallery`.
- Produces: Statik ana sayfa; `export const dynamic = 'force-static'`.

- [ ] **Step 1:** `hero.png`'yi `public/`'a taşı. `globals.css`'e koyu tema token'ları (arka plan, metin, amber vurgu, monospace font stack), reset, tipografi.

- [ ] **Step 2:** `Nav` (sticky, smooth-scroll anchor linkleri: Hakkımda / Portfolyo / Galeri / İletişim), `Hero` (hero.png + isim + unvan + tagline), `About` (markdown metin), `ProductCard` + `ProductGrid` (kapak, başlık, kısa açıklama, teknoloji etiketleri, linkler), `ContactSection` (email + sosyal), `Footer`.

- [ ] **Step 3:** `page.tsx`: `force-static`, `getSettings/getFeaturedProducts/getGallery` ile bölümleri render et (Hero → About → öne çıkan ürünler → galeri önizleme → iletişim).

- [ ] **Step 4:** Doğrula: `npm run dev` → ana sayfa açılır, seed verisi görünür. `npm run build` başarılı (statik).

Run: `npm run build`
Expected: `/` statik olarak prerender edilir (○/●), hata yok.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat: public ana sayfa, tema ve komponentler"
```

---

### Task 6: Portfolyo ve galeri sayfaları

**Files:**
- Create: `src/app/portfolyo/page.tsx`, `src/app/portfolyo/[slug]/page.tsx`, `src/app/galeri/page.tsx`, `src/app/components/Lightbox.tsx`

**Interfaces:**
- Consumes: `getPublishedProducts`, `getProductBySlug`, `getGallery`.
- Produces: Statik listeleme/detay/galeri; `[slug]` için `generateStaticParams` = tüm yayındaki slug'lar. Detay sayfada 404: `notFound()`.

- [ ] **Step 1:** `/portfolyo` — tüm yayındaki ürünlerin grid'i (`ProductGrid` tekrar kullan), `force-static`.

- [ ] **Step 2:** `/portfolyo/[slug]` — `generateStaticParams` ile tüm slug'lar; `getProductBySlug` null ise `notFound()`; detay (`detay` markdown), kapak, teknolojiler, canlı/github linkleri.

- [ ] **Step 3:** `/galeri` — grid + client `Lightbox` komponenti (tıklayınca büyüt, ok/esc ile gezin). `force-static`.

- [ ] **Step 4:** Doğrula: `npm run build` → `/portfolyo`, her `[slug]`, `/galeri` statik prerender.

Run: `npm run build`
Expected: slug sayfaları `generateStaticParams`'tan üretilir, hata yok.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat: portfolyo ve galeri sayfaları"
```

---

### Task 7: Admin guard + API route'ları

**Files:**
- Create: `src/lib/adminGuard.ts`, `src/app/api/admin/products/route.ts`, `src/app/api/admin/gallery/route.ts`, `src/app/api/admin/settings/route.ts`, `src/app/api/admin/upload/route.ts`
- Test: `src/lib/adminGuard.test.ts`

**Interfaces:**
- Consumes: `mutations.*`.
- Produces: `assertAdminEnabled(): void` (production'da `notFound()`/throw). API route'ları: products `POST`(create)/`PUT`(update)/`DELETE`; gallery aynı; settings `PUT`; upload `POST` (multipart → `public/uploads/<uuid>.<ext>` yazar, `{ path: '/uploads/...' }` döndürür). Her route başında `assertAdminEnabled()`.

- [ ] **Step 1: Failing test** — `adminGuard`: `NODE_ENV=production` iken `assertAdminEnabled` throw/notFound; development iken sorunsuz. (env'i test içinde set/restore et.)

- [ ] **Step 2:** Çalıştır → FAIL.

- [ ] **Step 3:** `adminGuard.ts` ve route'ları yaz. Upload: gelen dosyayı `public/uploads/` altına yaz (dizini yoksa oluştur), güvenli uzantı kontrolü (png/jpg/jpeg/webp/gif).

- [ ] **Step 4:** Çalıştır → PASS. Ayrıca manuel: `npm run dev` iken `curl -X POST /api/admin/settings` ile bir alan güncellenip DB'ye yazıldığını doğrula.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat: admin guard ve API route'ları"
```

---

### Task 8: Admin paneli UI

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/urunler/page.tsx`, `src/app/admin/urunler/[id]/page.tsx` (yeni/düzenle formu), `src/app/admin/galeri/page.tsx`, `src/app/admin/ayarlar/page.tsx`, `src/app/components/admin/*` (form alanları, ImageUpload, TagInput, SortableList)

**Interfaces:**
- Consumes: public okuma sorguları (mevcut kayıtları göstermek için) + `/api/admin/*` (yazma).
- Produces: Çalışan CMS. `admin/layout.tsx` başında `assertAdminEnabled()` (prod'da 404).

- [ ] **Step 1:** `admin/layout.tsx`: `assertAdminEnabled()` + basit admin nav (Ürünler / Galeri / Ayarlar). `admin/page.tsx`: özet dashboard (kayıt sayıları + linkler).

- [ ] **Step 2:** Ürünler listesi (tablo: başlık, yayın durumu, sırala, düzenle/sil). Ürün formu: tüm alanlar + `ImageUpload` (kapak) + `TagInput` (teknolojiler) → `/api/admin/products`.

- [ ] **Step 3:** Galeri: yüklü görseller grid'i, `ImageUpload` ile ekleme, başlık/açıklama/sıra düzenleme, silme → `/api/admin/gallery`.

- [ ] **Step 4:** Ayarlar formu: isim/unvan/tagline/hakkımda/email/sosyal + hero görsel değiştir → `/api/admin/settings`.

- [ ] **Step 5:** Doğrula (manuel, dev): admin'den bir ürün ekle → kaydet → ana sayfada/portfolyoda göründüğünü onayla. Görsel yükle → `public/uploads/`'a düştüğünü onayla.

- [ ] **Step 6:** Prod guard doğrula: `NODE_ENV=production npm run build && npm start` → `/admin` 404.

- [ ] **Step 7: Commit.**

```bash
git add -A && git commit -m "feat: admin CMS paneli"
```

---

### Task 9: impeccable ile tasarım cilası

**Files:**
- Modify: `globals.css`, tüm public komponentler

**Interfaces:**
- Consumes: mevcut public UI.
- Produces: Üst düzey görsel craft (koyu tema, mikro-etkileşimler, responsive, erişilebilirlik).

- [ ] **Step 1:** `impeccable` skill'ini public arayüz üzerinde çalıştır (hedef: ana sayfa + portfolyo + galeri). Hero, tipografi, boşluk, hover halleri, mobil.

- [ ] **Step 2:** Skill'in bounded QA pass'i ile masaüstü + mobil ekran görüntülerini al, kusurları tek turda düzelt.

- [ ] **Step 3:** Doğrula: `npm run build` başarılı; Lighthouse'ta belirgin erişilebilirlik/performans kırmızısı yok.

- [ ] **Step 4: Commit.**

```bash
git add -A && git commit -m "style: impeccable ile tasarım cilası"
```

---

### Task 10: Vercel deploy ve domain

**Files:**
- Create: `README.md` (kurulum + içerik güncelleme akışı), gerekirse `vercel.json`

**Interfaces:**
- Produces: `ilkerozd.com` canlıda; admin prod'da kapalı.

- [ ] **Step 1:** `README.md`: yerel geliştirme, `npm run seed`, admin kullanımı, "düzenle → commit → push → otomatik deploy" akışı, `data/portfolio.db` ve `public/uploads/`'ın repoya commit edildiği notu.

- [ ] **Step 2:** GitHub'a repo push (kullanıcı onayı ile). Vercel'e import; framework Next.js otomatik; build `next build`.

- [ ] **Step 3:** `data/portfolio.db`'nin ve `public/uploads/`'ın deploy'a dahil olduğunu doğrula (statik sayfalar seed verisiyle render olmalı).

- [ ] **Step 4:** `ilkerozd.com` domainini Vercel projesine ekle; DNS yönlendirmesini kullanıcı yapar. Canlı `/admin` → 404 doğrula.

- [ ] **Step 5:** Son commit / tag.

```bash
git add -A && git commit -m "docs: README ve deploy hazırlığı"
```

---

## Self-Review

**Spec coverage:**
- Gömülü SQLite → Task 2. Public okuma → Task 3. Admin yazma → Task 4/7/8. Hero+Hakkımda → Task 5. Portfolyo/ürünler → Task 5/6. Galeri → Task 5/6. İletişim → Task 5. Admin CMS → Task 7/8. Koyu tema/craft → Task 5/9. Yerel-admin/statik/prod-guard → Task 7/8. Vercel+domain → Task 10. Tüm spec bölümleri karşılandı ✅.

**Placeholder scan:** Kod adımları somut; test kodları verildi. Task 4/8'de bazı testler tarif edildi ama imzalar Interfaces'te net. Kabul edilebilir.

**Type consistency:** `Product/GalleryItem/Settings` alan adları Task 2'de tanımlandı; `getPublishedProducts/getProductBySlug/getFeaturedProducts/getGallery/getSettings` (Task 3) ve `createProduct/updateProduct/deleteProduct/createGalleryItem/updateGalleryItem/deleteGalleryItem/updateSettings/reorderProducts` (Task 4) tutarlı kullanılıyor. `assertAdminEnabled` (Task 7) admin route/layout'ta tutarlı ✅.
