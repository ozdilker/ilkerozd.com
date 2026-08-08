import Image from 'next/image';
import styles from './Hero.module.css';
import type { Settings } from '@/lib/types';

interface HeroProps {
  settings: Settings;
}

export default function Hero({ settings }: HeroProps) {
  const { isim, unvan, hero_tagline, hero_gorsel } = settings;

  return (
    <section className={styles.hero}>
      {hero_gorsel && (
        <Image
          src={hero_gorsel}
          alt={isim}
          width={160}
          height={160}
          className={styles.avatar}
          priority
        />
      )}
      <h1 className={styles.isim}>{isim}</h1>
      {unvan && <p className={styles.unvan}>{unvan}</p>}
      {hero_tagline && <p className={styles.tagline}>{hero_tagline}</p>}
    </section>
  );
}
