import { notFound } from 'next/navigation';
import { getPublishedProducts, getProductBySlug } from '@/lib/queries';
import { splitParagraphs } from '@/lib/text';
import PageShell from '../../components/PageShell';
import RedDot from '../../components/editorial/RedDot';
import ProductGallery from '../../components/ProductGallery';
import styles from './page.module.css';

const TUR_ETIKET: Record<'web' | 'mobil', string> = { web: 'Web', mobil: 'Mobil' };

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

  const { baslik, detay, kapak_gorsel, canli_link, github_link, teknolojiler, tur, gorseller } =
    product;
  const paragraphs = splitParagraphs(detay);
  // Galeri: kapak + ek görseller (kapak zaten listede ise tekrarlama).
  const galeriGorselleri = [kapak_gorsel, ...gorseller].filter(
    (src, i, arr) => src && arr.indexOf(src) === i
  );

  return (
    <PageShell>
      <article className={styles.detail}>
        <header className={styles.head}>
          <RedDot size={40} className={styles.dot} />
          <span className={styles.tur}>{TUR_ETIKET[tur]}</span>
          <h1 className={styles.baslik}>{baslik}</h1>
          {teknolojiler.length > 0 ? (
            <ul className={styles.tags}>
              {teknolojiler.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
        </header>

        {galeriGorselleri.length > 0 ? (
          <ProductGallery images={galeriGorselleri} baslik={baslik} />
        ) : null}

        <div className={styles.body}>
          <div className={styles.text}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{detay}</p>
            )}
          </div>

          <aside className={styles.side}>
            {canli_link ? (
              <a
                className={styles.link}
                href={canli_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Canlı ↗
              </a>
            ) : null}
            {github_link ? (
              <a
                className={styles.link}
                href={github_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            ) : null}
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
