# ilkerozd.com — Portfolyo Sitesi Tasarım Dökümanı

**Tarih:** 2026-08-07
**Durum:** Onaylandı (brainstorming)

## Amaç

İlker için `ilkerozd.com` domaininde, koyu/developer estetiğe sahip, Türkçe bir
kişisel portfolyo sitesi. İçerik (yazılım ürünleri, galeri, hero/hakkımda/iletişim)
CMS formatında bir admin panelinden yönetilebilecek. Supabase/Firestore gibi
ücretli/harici servisler kullanılmayacak; veri, repoda duran gömülü bir SQLite
veritabanında tutulacak. Yayın Vercel üzerinden yapılacak.

## Temel Kararlar

- **Stack:** Next.js (App Router) + TypeScript + SQLite (`better-sqlite3`)
- **Dil:** Türkçe (tek dil)
- **Tema:** Koyu / developer estetik (hero.png ile uyumlu), `impeccable` skill ile craft
- **Veri:** Repoda tek `.db` dosyası (gömülü veritabanı)
- **Model:** Yerel admin + statik deploy

## Mimari

Vercel serverless dosya sistemi kalıcı olmadığı için canlıda veritabanına yazma
yapılmaz. Bunun yerine:

- **Tek Next.js projesi, iki mod:**
  - `npm run dev` (yerel makine): Admin paneli **aktif**. SQLite'a yazar,
    görselleri `public/uploads/`'a kaydeder.
  - `npm run build`: Tüm herkese açık sayfalar **build anında SQLite'tan okunur**
    ve statik HTML üretilir (`export const dynamic = 'force-static'`). Vercel yalnızca
    bu statik çıktıyı servis eder.
- **Admin canlıda kapalı:** `/admin` ve `/api/admin/*` route'ları production'da
  (`process.env.NODE_ENV === 'production'`) 404 döner. Vercel'de admin'e erişilemez.
- **İçerik güncelleme akışı:** Yerelde admin ile düzenle → `git commit` + `push`
  → Vercel otomatik yeniden yayınlar (~30-60 sn).
- **better-sqlite3** yalnızca build sırasında okunur; production runtime'da native
  modüle bağımlılık yok (tüm public sayfalar statik).

### Neden bu yaklaşım

- Tamamen ücretsiz, harici DB servisi yok.
- Veri senin reponda = gerçek anlamda "kendine ait".
- Vercel'in kalıcılık sorununu tümden aşar (write yalnızca yerelde).
- Güvenlik: admin production'da hiç var olmaz.

## Veri Modeli (SQLite)

### `products` — Yazılım ürünleri
| alan | tip | not |
|---|---|---|
| id | INTEGER PK | |
| baslik | TEXT | |
| slug | TEXT UNIQUE | URL için |
| kisa_aciklama | TEXT | kart üzerinde |
| detay | TEXT | detay sayfası (markdown destekli) |
| kapak_gorsel | TEXT | `/uploads/...` yolu |
| canli_link | TEXT | opsiyonel |
| github_link | TEXT | opsiyonel |
| teknolojiler | TEXT | JSON dizi (etiketler) |
| sira | INTEGER | sıralama |
| yayinda | INTEGER | 0/1 |
| olusturma | TEXT | ISO tarih |

### `gallery` — Galeri
| alan | tip | not |
|---|---|---|
| id | INTEGER PK | |
| gorsel | TEXT | `/uploads/...` |
| baslik | TEXT | opsiyonel |
| aciklama | TEXT | opsiyonel |
| sira | INTEGER | |

### `settings` — Tekil ayarlar (tek satır)
| alan | tip | not |
|---|---|---|
| isim | TEXT | Hero başlık (varsayılan: "İlker Özd") |
| unvan | TEXT | ör. "Yazılım Geliştirici" |
| hero_tagline | TEXT | Hero alt başlık |
| hero_gorsel | TEXT | varsayılan `/hero.png` |
| hakkimda_metin | TEXT | markdown destekli |
| email | TEXT | ozd.ilker@gmail.com |
| github | TEXT | |
| linkedin | TEXT | |
| twitter | TEXT | opsiyonel |

Görseller `public/uploads/` altında dosya olarak; DB'de yalnızca yol tutulur.
`hero.png` mevcut dosya `public/`'a taşınır.

## Sayfalar (herkese açık, statik)

- `/` — Hero (hero.png + isim + tagline) · Hakkımda · Öne çıkan ürünler ·
  Galeri önizleme · İletişim (tek sayfa akışı, smooth scroll)
- `/portfolyo` — tüm yayındaki ürünler (grid)
- `/portfolyo/[slug]` — ürün detay sayfası
- `/galeri` — tam galeri (lightbox)

Tüm bu sayfalar `force-static` ile build anında üretilir.

## Admin Paneli (`/admin`, yalnızca yerel)

- **Ürünler:** ekle / düzenle / sil / sırala / yayın durumu
- **Galeri:** görsel yükle / düzenle / sil / sırala
- **Ayarlar:** hero, hakkımda, iletişim alanları
- **Görsel yükleme:** drag-drop → `public/uploads/` + DB kaydı
- **API:** `/api/admin/*` route'ları SQLite'a yazar (yalnızca dev'de erişilebilir)
- **Kimlik doğrulama:** Yok (local-only + production'da tamamen kapalı). İleride
  `.env`'de basit bir şifre eklenebilir.

## Tasarım Yönü

- Koyu tema, sıcak amber/turuncu vurgu (hero.png ışıklarıyla uyumlu)
- "Simple is better than complex" minimalizmi, monospace dokunuşlar (kod estetiği)
- Micro-etkileşimler, smooth scroll, hover halleri — `impeccable` skill ile
- Responsive (mobil + masaüstü), erişilebilir kontrast

## Deploy

- Vercel projesi, GitHub repo bağlı
- Build komutu: `next build` (varsayılan)
- Domain: `ilkerozd.com`

## Kapsam Dışı (YAGNI)

- Çok dillilik (yalnızca TR)
- Canlı/harici veritabanı, kullanıcı hesapları, yorumlar
- Blog (şimdilik yok; ileride ayrı bir iş olarak eklenebilir)
- Analitik/SEO ötesi entegrasyonlar
