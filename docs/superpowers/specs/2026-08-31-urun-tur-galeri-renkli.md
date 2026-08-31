# Ürün türü + detay galerisi + doğal/renkli görseller

**Tarih:** 2026-08-31
**Durum:** Onaylandı (brainstorming)

## Amaç

Mevcut editoryal portfolyoya dört değişiklik: ürünlere web/mobil türü, ürün detayında çoklu
görsel galerisi (lightbox'lı), görsellerin doğal oranda (deforme olmadan) görünmesi ve
görsellerdeki siyah-beyaz (grayscale) katmanın kaldırılması.

## Değişmeyenler

Next.js + gömülü SQLite, force-static, dev-only admin, editoryal tema (krem/kırmızı).
Mevcut committed `data/portfolio.db` (EduAtlas içeriği) **korunur**.

## 1) Veri modeli — `products`

Yeni kolonlar:
- `tur TEXT NOT NULL DEFAULT 'web'` — değer `web` veya `mobil`.
- `gorseller TEXT NOT NULL DEFAULT '[]'` — JSON dizi, ürünün ek görselleri (detay galerisi).

`kapak_gorsel` kart kapağı olarak kalır.

**Migration (kritik):** committed db zaten var; `CREATE TABLE IF NOT EXISTS` mevcut tabloyu
değiştirmez. `initSchema`, `PRAGMA table_info(products)` ile eksik kolonları tespit edip
`ALTER TABLE products ADD COLUMN ...` çalıştırır (idempotent). Böylece mevcut satırlar
(EduAtlas) korunur, yeni kolonlar varsayılanla eklenir.

Tipler: `Product`'a `tur: 'web' | 'mobil'` ve `gorseller: string[]`.

## 2) Admin — ürün formu

- **Tür** seçici (`<select>`): Web / Mobil → `tur`.
- **Ürün görselleri**: birden çok görsel ekle/çıkar (mevcut `ImageUpload` ile), `gorseller`
  dizisini oluşturur. Sıra: eklenme sırası; her görselin yanında "kaldır".

## 3) Public

- **ProjectBlock (kart):** başlık/etiket alanında küçük **web/mobil** rozeti. Kapak görseli
  sabit oran + `object-fit: cover` (kırpar ama germez/deforme etmez).
- **/portfolyo/[slug] (detay):** web/mobil rozeti + **ProductGallery**: görseller =
  `[kapak_gorsel, ...gorseller]` (kapak zaten gorseller'de ise tekrarlama). Görseller
  **doğal oranda** (`width:100%; height:auto`, kırpma yok). Tıklayınca **lightbox** overlay
  (büyüt, ok/esc ile gez). Client bileşen; DB import etmez, veriyi prop alır.

## 4) Grayscale kaldırma

`globals.css` `.bw` filtresi ve `Lightbox.module.css` `.image` grayscale'i kaldırılır →
tüm görseller renkli. `.bw` sınıfı (varsa transition için) kalabilir ama grayscale uygulamaz.

## Test

- queries+mutations: `tur` ve `gorseller` round-trip (yazma→okuma, JSON parse).
- migration: eski şemalı (tur/gorseller'siz) in-memory db'ye initSchema çağrılınca kolonlar
  eklenir ve mevcut satır korunur.

## Kapsam dışı (YAGNI)

- /portfolyo'da web/mobil filtresi (şimdilik yalnız etiket).
- Görsel yeniden sıralama sürükle-bırak (basit ekle/çıkar yeterli).
