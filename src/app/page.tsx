import Image from 'next/image';
import { getSettings, getFeaturedProducts, getGallery } from '@/lib/queries';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import ProductGrid from './components/ProductGrid';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import styles from './page.module.css';

export const dynamic = 'force-static';

export default function Home() {
  const settings = getSettings();
  const products = getFeaturedProducts();
  const gallery = getGallery().slice(0, 3);

  return (
    <>
      <Nav isim={settings.isim} />
      <main>
        <Hero settings={settings} />
        <About metin={settings.hakkimda_metin} />
        <ProductGrid products={products} />
        {gallery.length > 0 && (
          <section id="galeri" className={`container ${styles.gallery}`}>
            <h2 className={styles.title}>Galeri</h2>
            <div className={styles.grid}>
              {gallery.map((item) => (
                <figure key={item.id} className={styles.item}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.gorsel}
                      alt={item.baslik}
                      fill
                      className={styles.image}
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  {(item.baslik || item.aciklama) && (
                    <figcaption className={styles.caption}>
                      {item.baslik && <p className={styles.baslik}>{item.baslik}</p>}
                      {item.aciklama && <p className={styles.aciklama}>{item.aciklama}</p>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}
        <ContactSection settings={settings} />
      </main>
      <Footer isim={settings.isim} />
    </>
  );
}
