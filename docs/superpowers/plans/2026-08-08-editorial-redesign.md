# Editoryal Çok-Sayfalı Yeniden Tasarım Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut tek-sayfa koyu portfolyoyu, kapak + 4 ayrı sayfadan oluşan, editoryal (krem/kırmızı, siyah-beyaz fotoğraf) açık temalı, sayfa görselleri admin'den yönetilebilen çok-sayfalı bir siteye dönüştürmek.

**Architecture:** Veri/mimari altyapı (SQLite, force-static, dev-only admin) korunur; yalnızca sunum katmanı ve routing değişir. `settings` tablosuna 3 sayfa-görseli kolonu eklenir. `/` bir editoryal kapak sayfasına dönüşür; Hakkımda/Portfolyo/Galeri/İletişim ayrı route olur. Ortak editoryal ilkeller (başlık, kırmızı daire, B&W görsel, sayfa kabuğu) ile her sayfa özgün bir editoryal spread'e benzer. Görsel craft son adımda `impeccable` ile cilalanır.

**Tech Stack:** Next.js 15 (App Router), TypeScript, better-sqlite3, `next/font` (self-host), CSS Modules + globals.css, Vitest.

## Global Constraints

- Dil: Türkçe (tek dil). Tüm kullanıcıya görünen metin Türkçe.
- Tema: **editoryal açık** — krem zemin (~`#eae7dd`), near-black mürekkep (~`#1a1a18`), vermilyon kırmızı vurgu (~`#e2402a`). Koyu tema KALDIRILIR.
- İçerik görselleri **siyah-beyaz** render edilir (CSS `filter: grayscale(1)`), hover'da renk açılabilir.
- Fontlar **self-host** (`next/font`), runtime'da dış istek yok; yalnızca açık lisanslı (SIL OFL) aileler.
- Harici/ücretli servis YOK. Veri: repodaki `data/portfolio.db`. Admin dev-only, production'da `/admin` 404.
- TÜM public sayfalar `export const dynamic = 'force-static'`; runtime'da SQLite'a erişim yok. `/portfolyo/[slug]` `generateStaticParams` ile tüm yayındaki slug'ları prerender eder.
- Telif: verilen stok şablon birebir kopyalanmaz; editoryal tür ilham alınır, düzenler özgün kurulur.
- Node 20+, npm. Sık commit. Her task bağımsız test edilebilir bir çıktı üretir.
- Mevcut veri katmanı korunur: `getSettings`, `getPublishedProducts`, `getProductBySlug`, `getFeaturedProducts`, `getGallery`, `getAllProducts` (queries); `createProduct/updateProduct/.../updateSettings`, `turkishSlugify` (mutations); `assertAdminEnabled` (adminGuard). Yeniden yazma yok.

## Dosya Yapısı

```
src/
├─ lib/
│  ├─ types.ts            # Settings arayüzüne 3 görsel alanı eklenir
│  ├─ db.ts               # initSchema: settings CREATE TABLE'a 3 kolon
│  ├─ queries.ts          # getSettings yeni alanları döndürür (SELECT *)
│  ├─ mutations.ts        # SETTINGS_KEYS'e 3 yeni anahtar
│  └─ seed.ts (scripts/)  # yeni alanlara varsayılan
├─ app/
│  ├─ fonts.ts            # next/font self-host display + body aileleri
│  ├─ layout.tsx          # font değişkenleri + <html> dil; koyu tema temizliği
│  ├─ globals.css         # editoryal tema token'ları (krem/kırmızı), reset, tipografi
│  ├─ page.tsx            # / = editoryal KAPAK sayfası
│  ├─ hakkimda/page.tsx   # /hakkimda editoryal spread
│  ├─ portfolyo/page.tsx  # numaralı proje blokları
│  ├─ portfolyo/[slug]/page.tsx  # proje spread'i
│  ├─ galeri/page.tsx     # editoryal foto-grid + Lightbox (mevcut)
│  ├─ iletisim/page.tsx   # "thank you" spread'i
│  ├─ components/
│  │  ├─ PageShell.tsx    # Nav + main + Footer + kağıt zemin
│  │  ├─ Nav.tsx          # sayfa linkleri + aktif durum (usePathname, 'use client')
│  │  ├─ Footer.tsx       # editoryal footer
│  │  ├─ editorial/EditorialTitle.tsx  # iri kırmızı başlık
│  │  ├─ editorial/RedDot.tsx          # kırmızı daire motifi
│  │  ├─ editorial/BwImage.tsx         # grayscale next/image sarmalayıcı
│  │  ├─ ProjectBlock.tsx  # portfolyo listesinde numaralı proje bloğu
│  │  ├─ Lightbox.tsx      # MEVCUT — yeniden kullanılır
│  │  └─ admin/…           # mevcut admin bileşenleri (ImageUpload vb.) korunur
│  └─ admin/
│     ├─ layout.tsx        # admin nav'a "Sayfa Görselleri" eklenir
│     └─ sayfa-gorselleri/page.tsx  # yeni: sayfa görsel slotları formu
```

Silinecek/dönüştürülecek eski bileşenler: `Hero.tsx`, `About.tsx`, `ContactSection.tsx` (ana sayfadaki tek-sayfa halleri) → yeni sayfa bileşenlerine taşınır. `ProductGrid.tsx`/`ProductCard.tsx` editoryal `ProjectBlock`'a dönüşür (gerekirse kaldırılır).

---

### Task 1: Veri katmanı — sayfa görseli alanları

**Files:**
- Modify: `src/lib/types.ts`, `src/lib/db.ts`, `src/lib/mutations.ts`, `src/scripts/seed.ts`, `data/portfolio.db`
- Test: `src/lib/mutations.test.ts` (yeni bir case)

**Interfaces:**
- Consumes: mevcut `getDb`, `initSchema`, `getSettings`, `updateSettings`.
- Produces: `Settings` arayüzü artık `kapak_gorsel_2: string`, `hakkimda_gorsel: string`, `iletisim_gorsel: string` alanlarını da içerir (mevcut `hero_gorsel` kapak ana görseli olarak kalır). `updateSettings` bu üç anahtarı da yazabilir.

- [ ] **Step 1: Failing test** — `src/lib/mutations.test.ts`'e ekle: in-memory db'de `updateSettings(1, { hakkimda_gorsel: '/uploads/x.jpg', kapak_gorsel_2: '/uploads/y.jpg', iletisim_gorsel: '/uploads/z.jpg' }, db)` sonra `getSettings(db)` bu üç alanı aynen döndürmeli.

```ts
it('sayfa görseli alanlarını yazar ve okur', () => {
  const db = new Database(':memory:');
  initSchema(db);
  updateSettings({ kapak_gorsel_2: '/uploads/y.jpg', hakkimda_gorsel: '/uploads/x.jpg', iletisim_gorsel: '/uploads/z.jpg' }, db);
  const s = getSettings(db);
  expect(s.kapak_gorsel_2).toBe('/uploads/y.jpg');
  expect(s.hakkimda_gorsel).toBe('/uploads/x.jpg');
  expect(s.iletisim_gorsel).toBe('/uploads/z.jpg');
});
```

(Not: `updateSettings` imzası `(data, db?)` — mevcut imzayı koru. Testte gerçek imzaya uy.)

- [ ] **Step 2:** Çalıştır → FAIL (alanlar tanımsız / SETTINGS_KEYS'te yok).

Run: `npx vitest run src/lib/mutations.test.ts`

- [ ] **Step 3:** Uygula:
  - `types.ts` `Settings`'e üç `string` alanı ekle (`kapak_gorsel_2`, `hakkimda_gorsel`, `iletisim_gorsel`).
  - `db.ts` `initSchema` içindeki `settings` CREATE TABLE'a üç `TEXT NOT NULL DEFAULT ''` kolon ekle.
  - `mutations.ts` `SETTINGS_KEYS` dizisine üç anahtarı ekle.
  - `seed.ts` settings satırına varsayılan ver (`kapak_gorsel_2:''`, `hakkimda_gorsel:'/hero.png'`, `iletisim_gorsel:'/hero.png'`).
  - `getSettings` zaten `SELECT *` ile döndürüyorsa yeni alanlar otomatik gelir; değilse kolon listesine ekle.

- [ ] **Step 4:** Çalıştır → PASS. `npm test` pristine, `npx tsc --noEmit` clean.

- [ ] **Step 5: Şemayı taşımak için db'yi yeniden üret** — mevcut committed db eski şemada; sil ve yeniden seed et:

```bash
rm -f data/portfolio.db && npm run seed
```

Doğrula: `node -e "const d=require('better-sqlite3')('data/portfolio.db');console.log(Object.keys(d.prepare('SELECT * FROM settings').get()))"` çıktısında üç yeni kolon görünür.

- [ ] **Step 6: Commit** (yeniden üretilen db dahil).

```bash
git add -A && git commit -m "feat: settings'e sayfa görseli alanları"
```

---

### Task 2: Editoryal tema temeli — fontlar, globals.css, ilkeller, PageShell, Nav, Footer

**Files:**
- Create: `src/app/fonts.ts`, `src/app/components/PageShell.tsx`, `src/app/components/editorial/EditorialTitle.tsx`, `src/app/components/editorial/RedDot.tsx`, `src/app/components/editorial/BwImage.tsx`, ilgili `.module.css`'ler
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/components/Nav.tsx`, `src/app/components/Footer.tsx`

**Interfaces:**
- Consumes: `getSettings` (Nav marka adı / Footer için).
- Produces:
  - `fonts.ts` exports `displayFont` ve `bodyFont` (`next/font` nesneleri; `.variable` CSS değişkeni sağlar).
  - `PageShell({ children, active }: { children: React.ReactNode; active?: 'hakkimda'|'portfolyo'|'galeri'|'iletisim' })` — Nav + `<main>` + Footer + kağıt zemin sarmalar.
  - `EditorialTitle({ children, as?, className? })` — iri kırmızı grotesk başlık.
  - `RedDot({ size?, className? })` — kırmızı daire.
  - `BwImage(props)` — `next/image` sarmalayıcı; `grayscale` uygular; `next/image`'in width/height veya fill + sizes proplarını geçirir.
  - `Nav` client bileşeni (`'use client'`, `usePathname`) — linkler `/hakkimda /portfolyo /galeri /iletisim`, marka `/`; aktif linki vurgular.

- [ ] **Step 1: Fontları kur (self-host).** `src/app/fonts.ts` içinde `next/font/google`'dan açık lisanslı grotesk aile(ler) yükle (build anında self-host edilir, runtime'da dış istek YOK). Öneri: display için `Archivo` (ağırlıklar 700,800,900), gövde için `Archivo` (400,500) — tek aile, `subsets: ['latin','latin-ext']` (Türkçe karakterler için `latin-ext` şart), `display: 'swap'`, `variable: '--font-display'` / `--font-body`. (Alternatif: `next/font/local` + repoya woff2. Google yolu tercih; latin-ext ile İ/ş/ğ/ç doğru.)

```ts
import { Archivo } from 'next/font/google';
export const bodyFont = Archivo({ subsets: ['latin','latin-ext'], weight: ['400','500'], variable: '--font-body', display: 'swap' });
export const displayFont = Archivo({ subsets: ['latin','latin-ext'], weight: ['800','900'], variable: '--font-display', display: 'swap' });
```

- [ ] **Step 2: globals.css'i editoryal temaya çevir.** Koyu tema token'larını KALDIR. Yeni `:root` değişkenleri: `--paper:#eae7dd; --ink:#1a1a18; --accent:#e2402a; --muted:#6b675f; --hairline:#c9c4b8;` Body: `background:var(--paper); color:var(--ink); font-family:var(--font-body)`. Başlıklar `font-family:var(--font-display)`. Bir `.bw { filter:grayscale(1); transition:filter .4s } .bw:hover{ filter:grayscale(0) }` yardımcı sınıfı. Reset + akışkan tipografi (`clamp()` ile iri başlıklar). Koyu `@media (prefers-color-scheme)` kalıntısı bırakma (site tek tema: editoryal açık).

- [ ] **Step 3: layout.tsx.** `<html lang="tr" className={\`${displayFont.variable} ${bodyFont.variable}\`}>`; `import './globals.css'`; `generateMetadata` `getSettings().isim`'den başlığı türetmeye devam etsin. Koyu temaya özgü satırlar temizlensin.

- [ ] **Step 4: İlkelleri yaz** — `EditorialTitle`, `RedDot`, `BwImage` (grayscale uygular; kendi `.module.css`'i). `BwImage` `next/image`'i sarmalar ve `className` olarak `bw`'yi ekler; `alt` zorunlu.

- [ ] **Step 5: PageShell + Nav + Footer.** `Nav` → `'use client'`, `usePathname()` ile aktif link; linkler gerçek sayfalara. `Footer` editoryal (ince çizgi + `© yıl isim`). `PageShell` bunları sarmalar; içerik `<main>` içine.

- [ ] **Step 6: Doğrula.** `npm run build` exit 0; `npx tsc --noEmit` clean; `npm test` geçer. (Sayfalar Task 3+'da bunları kullanacak; şimdilik mevcut `/` bozulmadıysa build geçmeli — gerekirse `/` importlarını yeni Nav imzasına uyacak şekilde minimal uyarlayın; tam kapak Task 3.)

- [ ] **Step 7: Commit.**

```bash
git add -A && git commit -m "feat: editoryal tema temeli, fontlar ve ortak ilkeller"
```

---

### Task 3: Kapak sayfası (`/`)

**Files:**
- Modify: `src/app/page.tsx`, `src/app/page.module.css`
- (Silinebilir) eski `Hero.tsx` ana-sayfa bağımlılıkları

**Interfaces:**
- Consumes: `getSettings`, `PageShell`, `EditorialTitle`, `RedDot`, `BwImage`.
- Produces: editoryal kapak; `export const dynamic = 'force-static'`.

- [ ] **Step 1:** `page.tsx`'i editoryal kapağa dönüştür: `PageShell` içinde — iri (döndürülmüş olabilir) isim/başlık (`settings.isim`), `settings.unvan` + `settings.hero_tagline`, bir büyük `BwImage` (`settings.hero_gorsel`) + bir küçük `BwImage` (`settings.kapak_gorsel_2` boşsa gösterme), `RedDot` motifi, kısa tanıtım. Asimetrik grid, bol boşluk. Tüm metin Türkçe.

- [ ] **Step 2:** Eski tek-sayfa bölümlerini (`/` içindeki Hakkımda/Portfolyo/Galeri/İletişim) kaldır — onlar artık ayrı sayfalarda (Task 4-7).

- [ ] **Step 3: Doğrula.** `npm run build` → `/` Static (○). `npx tsc --noEmit` clean. Dev'de `read_page` ile kapak yapısını kontrol et (isim, görsel, tagline görünür).

- [ ] **Step 4: Commit.**

```bash
git add -A && git commit -m "feat: editoryal kapak sayfası"
```

---

### Task 4: Hakkımda sayfası (`/hakkimda`)

**Files:**
- Create: `src/app/hakkimda/page.tsx`, `src/app/hakkimda/page.module.css`

**Interfaces:**
- Consumes: `getSettings`, `PageShell` (active='hakkimda'), `EditorialTitle`, `RedDot`, `BwImage`, `splitParagraphs` (mevcut `src/lib/text.ts`).
- Produces: `/hakkimda` static.

- [ ] **Step 1:** "about me" spread'i: iri kırmızı "Hakkımda" başlığı, `settings.hakkimda_metin`'i `splitParagraphs` ile çok-paragraf, `BwImage(settings.hakkimda_gorsel)` + `RedDot`. `export const dynamic = 'force-static'`.

- [ ] **Step 2: Doğrula.** `npm run build` → `/hakkimda` Static; tsc clean. Dev `read_page` ile başlık+metin+görsel.

- [ ] **Step 3: Commit.**

```bash
git add -A && git commit -m "feat: hakkımda sayfası"
```

---

### Task 5: Portfolyo listesi + proje spread'i

**Files:**
- Modify: `src/app/portfolyo/page.tsx`
- Create: `src/app/components/ProjectBlock.tsx` (+ `.module.css`)
- Modify: `src/app/portfolyo/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getPublishedProducts`, `getProductBySlug`, `PageShell`, `EditorialTitle`, `RedDot`, `BwImage`, `splitParagraphs`, `notFound`.
- Produces: `ProjectBlock({ product, index })` — numaralı editoryal proje bloğu (iri numara `${index}.`, kırmızı proje adı, `BwImage(kapak_gorsel)`, `kisa_aciklama`, teknoloji etiketleri, canli/github linkleri). `/portfolyo` ve `/portfolyo/[slug]` static.

- [ ] **Step 1:** `ProjectBlock` yaz: iri numara + kırmızı `baslik` + `BwImage` + `kisa_aciklama` + teknoloji etiketleri + (boş değilse) `canli_link`/`github_link`. Asimetrik, referanstaki "project name 1./2." bloklarına benzer ama özgün.

- [ ] **Step 2:** `/portfolyo/page.tsx`'i `PageShell active='portfolyo'` içinde `getPublishedProducts().map((p,i)=><ProjectBlock product={p} index={i+1}/>)` ile yeniden yaz. `force-static`. Boşsa "Henüz proje eklenmedi." (Türkçe).

- [ ] **Step 3:** `/portfolyo/[slug]/page.tsx`'i editoryal proje spread'ine dönüştür: `generateStaticParams` = tüm yayındaki slug'lar (KORU), `getProductBySlug` null → `notFound()`, `force-static`. İçerik: iri numara/başlık, `BwImage(kapak_gorsel)`, `detay` (splitParagraphs), teknolojiler, linkler; `PageShell` içinde.

- [ ] **Step 4: Doğrula.** `npm run build` → `/portfolyo` Static, `/portfolyo/[slug]` 3 slug prerender. tsc clean. Dev `read_page`.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat: editoryal portfolyo listesi ve proje spread'i"
```

---

### Task 6: Galeri sayfası (`/galeri`)

**Files:**
- Modify: `src/app/galeri/page.tsx`, ilgili `.module.css`
- Reuse: `src/app/components/Lightbox.tsx` (mevcut)

**Interfaces:**
- Consumes: `getGallery`, `PageShell` (active='galeri'), `EditorialTitle`, `Lightbox`, `BwImage`.
- Produces: `/galeri` static.

- [ ] **Step 1:** Editoryal foto-grid: iri kırmızı "Galeri" başlığı, farklı boyutlarda B&W görseller (grayscale), mevcut `Lightbox` (client, DB'siz) yeniden kullanılır — Lightbox'a görseller plain prop olarak geçilir. `force-static`. Boşsa "Henüz görsel eklenmedi.".

- [ ] **Step 2: Doğrula.** `npm run build` → `/galeri` Static. tsc clean. Dev `read_page` + Lightbox'ın `@/lib` import etmediğini teyit et.

- [ ] **Step 3: Commit.**

```bash
git add -A && git commit -m "feat: editoryal galeri sayfası"
```

---

### Task 7: İletişim sayfası (`/iletisim`)

**Files:**
- Create: `src/app/iletisim/page.tsx`, `src/app/iletisim/page.module.css`

**Interfaces:**
- Consumes: `getSettings`, `PageShell` (active='iletisim'), `EditorialTitle`, `RedDot`, `BwImage`.
- Produces: `/iletisim` static.

- [ ] **Step 1:** "thank you" spread'i: iri kırmızı başlık (ör. "İletişim" / "Teşekkürler"), `RedDot`, email (`mailto`) + sosyal linkler (yalnızca boş olmayanlar: github/linkedin/twitter), `BwImage(settings.iletisim_gorsel)`. `force-static`. Türkçe.

- [ ] **Step 2: Doğrula.** `npm run build` → `/iletisim` Static. tsc clean. Dev `read_page`.

- [ ] **Step 3: Commit.**

```bash
git add -A && git commit -m "feat: editoryal iletişim sayfası"
```

---

### Task 8: Admin — Sayfa Görselleri ekranı

**Files:**
- Create: `src/app/admin/sayfa-gorselleri/page.tsx` (+ `.module.css`)
- Modify: `src/app/admin/layout.tsx` (nav linki), `src/app/admin/page.tsx` (dashboard linki)
- Create: `src/app/components/admin/PageImagesForm.tsx` (client)

**Interfaces:**
- Consumes: `getSettings` (server page), `ImageUpload` (mevcut client bileşeni), `assertAdminEnabled`, `PUT /api/admin/settings`.
- Produces: `/admin/sayfa-gorselleri` — dev-only.

- [ ] **Step 1:** `admin/layout.tsx` nav'ına "Sayfa Görselleri" (`/admin/sayfa-gorselleri`) ekle. `assertAdminEnabled()` mevcut guard korunur.

- [ ] **Step 2:** `sayfa-gorselleri/page.tsx` (Server Component): `getSettings()` okur, mevcut değerleri `PageImagesForm`'a prop geçer.

- [ ] **Step 3:** `PageImagesForm.tsx` (`'use client'`): dört slot için `ImageUpload` — Kapak ana (`hero_gorsel`), Kapak ikincil (`kapak_gorsel_2`), Hakkımda (`hakkimda_gorsel`), İletişim (`iletisim_gorsel`). Her biri seçilince state'e path yazar; "Kaydet" → `PUT /api/admin/settings` (yalnızca bu dört alan). Başarıda `router.refresh()` + Türkçe başarı/hata mesajı. `@/lib`'den DB/queries/mutations import ETME (yalnız `@/lib/types` serbest).

- [ ] **Step 4:** `admin/page.tsx` dashboard'ına "Sayfa görsellerini düzenle →" linki ekle.

- [ ] **Step 5: Doğrula.** `npm run build` exit 0 (public statik, admin dynamic). tsc clean, `npm test` geçer. Dev smoke: bir slotu yükle → Kaydet → `getSettings` yeni path'i döndürüyor mu (DB'de). Sonra `git checkout -- data/portfolio.db` ile seed'i geri al. Prod guard: `admin/layout.tsx` ilk çağrı `assertAdminEnabled()`.

- [ ] **Step 6: Commit.**

```bash
git add -A && git commit -m "feat: admin sayfa görselleri ekranı"
```

---

### Task 9: impeccable ile editoryal cila

**Files:**
- Modify: `globals.css`, tüm public sayfa/bileşenler (editoryal ince ayar)

**Interfaces:**
- Consumes: Task 2-7 çıktısı (tüm editoryal sayfalar).
- Produces: üst düzey görsel craft — tipografi hiyerarşisi, boşluk ritmi, iri numaralar/başlıklar, kırmızı daire yerleşimi, B&W hover, hairline'lar, responsive (mobil tek kolon, akışkan başlıklar), erişilebilir kontrast.

- [ ] **Step 1:** `impeccable` skill'ini public arayüz üzerinde çalıştır (hedef: kapak + hakkımda + portfolyo + galeri + iletişim). Editoryal düzenlerin her birini ayrı bir spread karakterine yaklaştır (özgün kalarak).

- [ ] **Step 2:** Skill'in bounded QA pass'i: masaüstü + mobil ekran görüntüleri, kusurları tek turda düzelt.

- [ ] **Step 3: Doğrula.** `npm run build` exit 0; tüm sayfalar statik; Lighthouse'ta belirgin erişilebilirlik/kontrast kırmızısı yok. Ekran görüntülerini kullanıcıya sun.

- [ ] **Step 4: Commit.**

```bash
git add -A && git commit -m "style: impeccable ile editoryal cila"
```

---

## Deploy

Deploy (GitHub + Vercel + `ilkerozd.com` DNS) bu plandan **sonra**, kullanıcının katılımıyla ayrı yürütülür (önceki planın Task 10'u). Bu plan onu kapsamaz.

## Self-Review

**Spec coverage:**
- Editoryal açık tema → Task 2. Self-host font → Task 2. B&W görsel → Task 2 (`.bw`/`BwImage`), her sayfada kullanılır. Çok-sayfa routing → Task 3-7. Kapak → Task 3, Hakkımda → 4, Portfolyo(+slug) → 5, Galeri → 6, İletişim → 7. Sayfa görseli veri alanları → Task 1. Admin Sayfa Görselleri → Task 8. impeccable cila → Task 9. Telif/özgünlük → Global Constraints + Task 3-7/9 metinleri. Tüm spec bölümleri karşılandı ✅.

**Placeholder scan:** Kod adımları somut; font ve tema token değerleri verildi. UI tasklarında test yerine build+read_page doğrulaması (bu tasklar görsel; TDD veri katmanında — Task 1). Kabul edilebilir.

**Type consistency:** `Settings` yeni alanları (`kapak_gorsel_2`, `hakkimda_gorsel`, `iletisim_gorsel`) Task 1'de tanımlanır; Task 3/4/7/8 aynı adlarla tüketir. `PageShell` `active` prop değerleri (`hakkimda|portfolyo|galeri|iletisim`) Task 2'de tanımlı, Task 4-7'de tutarlı. `EditorialTitle`/`RedDot`/`BwImage`/`ProjectBlock` imzaları tanımlandığı task'ta sabit, tüketen tasklarla uyumlu. `Lightbox` mevcut imzası korunur (Task 6). ✅
