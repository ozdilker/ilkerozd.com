import Image from 'next/image';
import styles from './ProductCard.module.css';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { baslik, kisa_aciklama, kapak_gorsel, canli_link, github_link, teknolojiler } = product;

  return (
    <article className={styles.card}>
      {kapak_gorsel && (
        <div className={styles.imageWrapper}>
          <Image
            src={kapak_gorsel}
            alt={baslik}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.baslik}>{baslik}</h3>
        {kisa_aciklama && <p className={styles.aciklama}>{kisa_aciklama}</p>}
        {teknolojiler.length > 0 && (
          <ul className={styles.tags}>
            {teknolojiler.map((tek) => (
              <li key={tek} className={styles.tag}>
                {tek}
              </li>
            ))}
          </ul>
        )}
        {(canli_link || github_link) && (
          <div className={styles.links}>
            {canli_link && (
              <a href={canli_link} target="_blank" rel="noopener noreferrer">
                Canlı →
              </a>
            )}
            {github_link && (
              <a href={github_link} target="_blank" rel="noopener noreferrer">
                GitHub →
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
