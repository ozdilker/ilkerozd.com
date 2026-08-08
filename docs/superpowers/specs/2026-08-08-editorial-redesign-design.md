# ilkerozd.com — Editoryal Çok-Sayfalı Yeniden Tasarım

**Tarih:** 2026-08-08
**Durum:** Onaylandı (brainstorming)
**Önceki spec:** [2026-08-07-ilkerozd-portfolio-design.md](2026-08-07-ilkerozd-portfolio-design.md) — veri/mimari altyapı aynı kalır; bu belge yalnızca sunum katmanını (tema + routing + sayfa görselleri) değiştirir.

## Amaç

Mevcut tek-sayfa, koyu temalı portfolyo, **çok-sayfalı editoryal (print/dergi ilhamlı) açık temalı** bir siteye dönüştürülür. Menüdeki her sekme ayrı bir route olur ve her sayfa özgün bir editoryal "spread" düzenine benzer. Her sayfadaki görseller admin'den tek tek düzenlenebilir.

**Telif:** Referans olarak verilen stok şablon **birebir kopyalanmaz**. Yalnızca editoryal türün estetiği (krem zemin, kalın kırmızı başlıklar, siyah-beyaz fotoğraf, iri numaralar, kırmızı daire motifi, asimetrik grid) ilham alınır; düzenler özgün kurulur.

## Değişmeyenler (önceki spec'ten devam)

- Next.js (App Router) + TypeScript + gömülü SQLite (`data/portfolio.db`).
- Yerel admin + statik deploy modeli. Admin dev-only, production'da `/admin` 404.
- Tüm public sayfalar build anında SQLite'tan okunur, `dynamic = 'force-static'`.
- Harici/ücretli servis yok. Dil: Türkçe.

## Değişen kararlar

- **Tema:** Koyu → **editoryal açık tema** (krem zemin, kırmızı vurgu). Önceki "koyu developer estetik" kararı geçersiz.
- **Yapı:** Tek-sayfa landing → **kapak + 4 ayrı sayfa**. Nav artık gerçek sayfa linkleri (anchor değil).

## Görsel Dil (özgün)

- **Renk:** krem/kağıt zemin (~`#eae7dd`), near-black mürekkep (~`#1a1a18`), vermilyon kırmızı vurgu (~`#e2402a`). Tam tonlar `impeccable` cilasında ince ayarlanır.
- **Tipografi:** ağır grotesk display (iri, küçük harf başlıklar) + temiz grotesk gövde. Fontlar **repoya gömülü woff2**, `next/font/local` ile self-host — runtime'da dış istek yok. Yalnızca açık lisanslı (SIL OFL) fontlar.
- **Motifler:** ince hairline çizgiler, iri numaralar (`1.` `2.` `3.`), kırmızı daire, döndürülmüş dikey başlık aksanları, asimetrik editoryal grid, bol boşluk.
- **Görsel işleme:** tüm içerik görselleri **siyah-beyaz** (CSS `filter: grayscale(1)`), hover'da renge dönebilir. Böylece kullanıcı hangi görseli yüklerse yüklesin editoryal tutarlılık korunur.
- Responsive: masaüstünde çok-kolon editoryal grid; mobilde tek kolona iner, iri başlıklar akışkan (`clamp()`) küçülür.

## Sayfalar (her biri ayrı route, force-static)

| Route | Editoryal karşılık | İçerik kaynağı |
|---|---|---|
| `/` | Kapak spread'i | `settings` (isim, unvan, tagline, kapak görselleri) |
| `/hakkimda` | "about me" spread'i | `settings.hakkimda_metin`, `settings.hakkimda_gorsel` |
| `/portfolyo` | numaralı "project" spread'leri | `getPublishedProducts()` |
| `/portfolyo/[slug]` | tam proje spread'i | `getProductBySlug()` |
| `/galeri` | foto-grid spread'i + lightbox | `getGallery()` |
| `/iletisim` | "thank you" spread'i | `settings` (email, sosyal, iletisim_gorsel) |

- Nav (tüm sayfalarda ortak): Hakkımda / Portfolyo / Galeri / İletişim → `/hakkimda` vb.; marka → `/`. Aktif sayfa vurgulanır.
- `/` artık bölümleri barındırmaz; her bölüm kendi sayfasına taşınır. Ortak `Nav` + `Footer` her sayfada.
- `[slug]` için `generateStaticParams` = tüm yayındaki slug'lar (mevcut davranış korunur). Bulunamayan slug → `notFound()` (Türkçe 404 mevcut).

## Veri Modeli (küçük ekleme)

`settings` tablosuna sayfa-görseli kolonları eklenir (hepsi TEXT, varsayılan boş veya `/hero.png`):

| alan | amaç |
|---|---|
| `hero_gorsel` (mevcut) | Kapak ana görseli |
| `kapak_gorsel_2` (yeni) | Kapak ikincil küçük görsel |
| `hakkimda_gorsel` (yeni) | Hakkımda sayfası görseli |
| `iletisim_gorsel` (yeni) | İletişim sayfası görseli |

Ürün kapakları (`products.kapak_gorsel`) ve galeri görselleri (`gallery.gorsel`) zaten kayıt bazında düzenlenebilir; değişmez.

Etki: `types.ts` (`Settings` arayüzü), `db.ts` `initSchema` (yeni kolonlar, `ADD COLUMN` yerine `CREATE TABLE`'a eklenir — db yeniden seed edilir), `seed`, `queries.getSettings` (yeni alanları döndürür), `mutations` `SETTINGS_KEYS` whitelist (yeni anahtarlar). Testler güncellenir.

## Admin

- Yeni ekran **`/admin/sayfa-gorselleri`**: kapak (2 slot), hakkımda, iletişim görsellerini `ImageUpload` ile değiştirir → `PUT /api/admin/settings`.
- Admin nav'a "Sayfa Görselleri" eklenir. Mevcut Panel/Ürünler/Galeri/Ayarlar korunur.
- "Ayarlar" formu **yalnızca metin** alanlarında kalır (isim, unvan, tagline, hakkımda metni, email, sosyal). Tüm sayfa-görseli slotları **yalnızca yeni "Sayfa Görselleri" ekranından** yönetilir (tek yer, çift giriş yok). Her ikisi de aynı `settings` satırına (`PUT /api/admin/settings`) yazar.

## Bileşen Yapısı

- Ortak editoryal ilkeller: `EditorialTitle` (iri kırmızı başlık), `RedDot`, `Rule` (hairline), `PageShell` (Nav + içerik + Footer + kağıt zemin), `BwImage` (grayscale next/image sarmalayıcı).
- Sayfa bileşenleri: `CoverPage`, `AboutPage`, `PortfolioIndex` (numaralı proje blokları), `ProjectSpread` (detay), `GalleryEditorial` (+ mevcut `Lightbox` yeniden kullanılır), `ContactPage`.
- Eski tek-sayfa bölüm bileşenleri (`Hero`, `About`, `ContactSection`, `ProductGrid` ana sayfadaki hali) yeni sayfa bileşenlerine dönüştürülür/taşınır; `ProductCard` editoryal proje bloğuna uyarlanır.

## Test / Doğrulama

- Veri katmanı testleri: yeni settings alanları round-trip (queries + mutations).
- Build: her yeni route static (`○`/`●`), `[slug]` prerender; `npm run build` exit 0; `data/portfolio.db` seed'e sadık.
- `impeccable` cilası: masaüstü + mobil ekran QA, tipografi/boşluk/B&W/hareket.

## Kapsam Dışı (YAGNI)

- Çok dillilik, blog, animasyon kütüphaneleri, harici font/CDN, harici DB.
- Sayfa başına sınırsız/dinamik görsel galerisi — yalnızca tanımlı slotlar (kapak×2, hakkımda, iletişim) + mevcut ürün/galeri görselleri.
