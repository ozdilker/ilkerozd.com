import { notFound } from 'next/navigation';
import { getPublishedProducts, getProductBySlug } from '@/lib/queries';
import { splitParagraphs } from '@/lib/text';
import PageShell from '../../components/PageShell';
import RedDot from '../../components/editorial/RedDot';
import BwImage from '../../components/editorial/BwImage';
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

  const { baslik, detay, kapak_gorsel, canli_link, github_link, teknolojiler } = product;
  const paragraphs = splitParagraphs(detay);

  return (
    <PageShell>
      <article className={styles.detail}>
        <header className={styles.head}>
          <RedDot size={40} className={styles.dot} />
          <h1 className={styles.baslik}>{baslik}</h1>
          {teknolojiler.length > 0 ? (
            <ul className={styles.tags}>
              {teknolojiler.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
        </header>

        {kapak_gorsel ? (
          <figure className={styles.figure}>
            <BwImage
              src={kapak_gorsel}
              alt={baslik}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </figure>
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
