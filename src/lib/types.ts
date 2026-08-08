export interface Product {
  id: number;
  baslik: string;
  slug: string;
  kisa_aciklama: string;
  detay: string;
  kapak_gorsel: string;
  canli_link: string;
  github_link: string;
  teknolojiler: string[];
  sira: number;
  yayinda: boolean;
  olusturma: string;
}

export interface GalleryItem {
  id: number;
  gorsel: string;
  baslik: string;
  aciklama: string;
  sira: number;
}

export interface Settings {
  isim: string;
  unvan: string;
  hero_tagline: string;
  hero_gorsel: string;
  hakkimda_metin: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}
