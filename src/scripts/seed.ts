import { getDb } from '../lib/db';

const db = getDb();

// --- settings: id=1 satırını varsayılan içerikle günceller (idempotent) ---
db.prepare(
  `INSERT OR REPLACE INTO settings
    (id, isim, unvan, hero_tagline, hero_gorsel, hakkimda_metin, email, github, linkedin, twitter)
   VALUES
    (1, @isim, @unvan, @hero_tagline, @hero_gorsel, @hakkimda_metin, @email, @github, @linkedin, @twitter)`
).run({
  isim: 'İlker Özd',
  unvan: 'Yazılım Geliştirici',
  hero_tagline: 'Fikirleri çalışan yazılımlara dönüştürüyorum.',
  hero_gorsel: '/hero.png',
  hakkimda_metin:
    'Merhaba, ben İlker. Web ve masaüstü uygulamalar geliştiren bir yazılım geliştiricisiyim. Temiz kod ve kullanıcı deneyimine önem veririm.',
  email: 'ozd.ilker@gmail.com',
  github: 'https://github.com/ozdilker',
  linkedin: 'https://linkedin.com/in/ozdilker',
  twitter: 'https://twitter.com/ozdilker',
});

// --- products: idempotent olması için önce temizle, sonra ekle ---
db.exec('DELETE FROM products');

const insertProduct = db.prepare(
  `INSERT INTO products
    (id, baslik, slug, kisa_aciklama, detay, kapak_gorsel, canli_link, github_link, teknolojiler, sira, yayinda)
   VALUES
    (@id, @baslik, @slug, @kisa_aciklama, @detay, @kapak_gorsel, @canli_link, @github_link, @teknolojiler, @sira, @yayinda)`
);

const products = [
  {
    id: 1,
    baslik: 'Portfolyo Sitesi',
    slug: 'portfolyo-sitesi',
    kisa_aciklama: 'Next.js ve SQLite ile geliştirilmiş kişisel portfolyo sitesi.',
    detay:
      'Next.js, TypeScript ve better-sqlite3 kullanılarak geliştirilen, sunucu tarafında render edilen kişisel portfolyo sitesi.',
    kapak_gorsel: '/hero.png',
    canli_link: 'https://ilkerozd.com',
    github_link: 'https://github.com/ozdilker/ilkerozd.com',
    teknolojiler: JSON.stringify(['Next.js', 'TypeScript', 'SQLite']),
    sira: 1,
    yayinda: 1,
  },
  {
    id: 2,
    baslik: 'Görev Takip Uygulaması',
    slug: 'gorev-takip-uygulamasi',
    kisa_aciklama: 'Basit ve hızlı bir görev/yapılacaklar listesi uygulaması.',
    detay: 'React ve yerel depolama kullanılarak geliştirilmiş bir görev takip uygulaması.',
    kapak_gorsel: '/hero.png',
    canli_link: '',
    github_link: 'https://github.com/ozdilker/gorev-takip',
    teknolojiler: JSON.stringify(['React', 'Vite', 'CSS']),
    sira: 2,
    yayinda: 1,
  },
  {
    id: 3,
    baslik: 'Hava Durumu Paneli',
    slug: 'hava-durumu-paneli',
    kisa_aciklama: 'Gerçek zamanlı hava durumu bilgisi gösteren küçük bir panel uygulaması.',
    detay: 'Açık bir hava durumu API’si ile entegre çalışan, güncel verileri gösteren bir gösterge paneli.',
    kapak_gorsel: '/hero.png',
    canli_link: '',
    github_link: 'https://github.com/ozdilker/hava-durumu-paneli',
    teknolojiler: JSON.stringify(['JavaScript', 'REST API']),
    sira: 3,
    yayinda: 1,
  },
];

for (const product of products) {
  insertProduct.run(product);
}

// --- gallery: idempotent olması için önce temizle, sonra ekle ---
db.exec('DELETE FROM gallery');

const insertGalleryItem = db.prepare(
  `INSERT INTO gallery (id, gorsel, baslik, aciklama, sira)
   VALUES (@id, @gorsel, @baslik, @aciklama, @sira)`
);

const galleryItems = [
  { id: 1, gorsel: '/hero.png', baslik: 'Çalışma Ortamı', aciklama: 'Günlük çalışma ortamımdan bir kare.', sira: 1 },
  { id: 2, gorsel: '/hero.png', baslik: 'Proje Ekranı', aciklama: 'Geliştirdiğim bir projeden ekran görüntüsü.', sira: 2 },
  { id: 3, gorsel: '/hero.png', baslik: 'Topluluk Etkinliği', aciklama: 'Katıldığım bir yazılım etkinliğinden.', sira: 3 },
];

for (const item of galleryItems) {
  insertGalleryItem.run(item);
}

const productCount = (db.prepare('SELECT COUNT(*) c FROM products').get() as { c: number }).c;
const galleryCount = (db.prepare('SELECT COUNT(*) c FROM gallery').get() as { c: number }).c;
const settingsCount = (db.prepare('SELECT COUNT(*) c FROM settings').get() as { c: number }).c;

console.log(
  `Seed tamamlandı: products=${productCount}, gallery=${galleryCount}, settings=${settingsCount}`
);
