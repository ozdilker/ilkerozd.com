import Link from 'next/link';
import type { Product } from '@/lib/types';
import BwImage from './editorial/BwImage';
import styles from './ProjectBlock.module.css';

interface ProjectBlockProps {
  product: Product;
  index: number;
}

/** Portfolyo listesinde numaralı editoryal proje bloğu. */
export default function ProjectBlock({ product, index }: ProjectBlockProps) {
  const { baslik, slug, kisa_aciklama, kapak_gorsel, canli_link, github_link, teknolojiler } =
    product;
  const numara = String(index).padStart(2, '0');
  const flip = index % 2 === 0;

  return (
    <article className={`${styles.block} ${flip ? styles.flip : ''}`}>
      <figure className={styles.figure}>
        {kapak_gorsel ? (
          <Link href={`/portfolyo/${slug}`} className={styles.imgLink}>
            <BwImage
              src={kapak_gorsel}
              alt={baslik}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </Link>
        ) : null}
      </figure>

      <div className={styles.info}>
        <span className={styles.numara}>{numara}</span>
        <h2 className={styles.baslik}>
          <Link href={`/portfolyo/${slug}`}>{baslik}</Link>
        </h2>
        <p className={styles.aciklama}>{kisa_aciklama}</p>

        {teknolojiler.length > 0 ? (
          <ul className={styles.tags}>
            {teknolojiler.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}

        <div className={styles.links}>
          <Link href={`/portfolyo/${slug}`} className={styles.detay}>
            Projeyi gör →
          </Link>
          {canli_link ? (
            <a href={canli_link} target="_blank" rel="noopener noreferrer">
              Canlı ↗
            </a>
          ) : null}
          {github_link ? (
            <a href={github_link} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
