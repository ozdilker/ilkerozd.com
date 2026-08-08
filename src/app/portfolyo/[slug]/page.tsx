import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getSettings, getPublishedProducts, getProductBySlug } from '@/lib/queries';
import { splitParagraphs } from '@/lib/text';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const products = getPublishedProducts();
  return products.map((product) => ({ slug: product.slug }));
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const settings = getSettings();
  const { baslik, detay, kapak_gorsel, canli_link, github_link, teknolojiler } = product;
  const paragraphs = splitParagraphs(detay);

  return (
    <>
      <Nav isim={settings.isim} />
      <main>
        <article className={`container ${styles.detail}`}>
          {kapak_gorsel && (
            <div className={styles.imageWrapper}>
              <Image
                src={kapak_gorsel}
                alt={baslik}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}
          <h1 className={styles.baslik}>{baslik}</h1>
          {teknolojiler.length > 0 && (
            <ul className={styles.tags}>
              {teknolojiler.map((tek) => (
                <li key={tek} className={styles.tag}>
                  {tek}
                </li>
              ))}
            </ul>
          )}
          <div className={styles.body}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{detay}</p>
            )}
          </div>
          {(canli_link || github_link) && (
            <div className={styles.actions}>
              {canli_link && (
                <a
                  className={styles.button}
                  href={canli_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Canlı →
                </a>
              )}
              {github_link && (
                <a
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  href={github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub →
                </a>
              )}
            </div>
          )}
        </article>
      </main>
      <Footer isim={settings.isim} />
    </>
  );
}
