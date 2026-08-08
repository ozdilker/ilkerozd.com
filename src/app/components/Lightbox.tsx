'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Lightbox.module.css';

/**
 * Galeri öğesi için sunucudan gelen düz veri şekli.
 * Bilinçli olarak `@/lib/types`'tan içe aktarmıyoruz: bu bileşen bir istemci
 * bileşeni ve istemci paketine veritabanı katmanına dair hiçbir referans
 * (tip dahi olsa) taşımasın istiyoruz.
 */
interface LightboxItem {
  id: number;
  gorsel: string;
  baslik: string;
  aciklama: string;
}

interface LightboxProps {
  items: LightboxItem[];
}

export default function Lightbox({ items }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + items.length) % items.length
    );
  }, [items.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current === null ? current : (current + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    dialogRef.current?.focus();
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (items.length === 0) {
    return <p className={styles.empty}>Henüz görsel eklenmedi.</p>;
  }

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div className={styles.section}>
      <div className={styles.grid}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={styles.thumb}
            onClick={() => setActiveIndex(index)}
            aria-label={`${item.baslik || 'Görseli'} büyüt`}
          >
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
              <div className={styles.caption}>
                {item.baslik && <p className={styles.baslik}>{item.baslik}</p>}
                {item.aciklama && <p className={styles.aciklama}>{item.aciklama}</p>}
              </div>
            )}
          </button>
        ))}
      </div>

      {active && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className={styles.overlay} onClick={close}>
          <div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={active.baslik || 'Görsel önizleme'}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} onClick={close} aria-label="Kapat">
              ×
            </button>
            {items.length > 1 && (
              <button
                type="button"
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={showPrev}
                aria-label="Önceki"
              >
                ‹
              </button>
            )}
            <div className={styles.imageContainer}>
              <Image
                src={active.gorsel}
                alt={active.baslik}
                fill
                className={styles.enlargedImage}
                sizes="90vw"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={showNext}
                aria-label="Sonraki"
              >
                ›
              </button>
            )}
            {(active.baslik || active.aciklama) && (
              <div className={styles.dialogCaption}>
                {active.baslik && <p className={styles.dialogBaslik}>{active.baslik}</p>}
                {active.aciklama && <p className={styles.dialogAciklama}>{active.aciklama}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
