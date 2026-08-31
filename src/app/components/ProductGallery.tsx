'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
  baslik: string;
}

/**
 * Ürün detay galerisi. Görseller doğal oranında (kırpılmadan, deforme
 * olmadan) gösterilir; tıklayınca tam ekran lightbox açılır (ok/esc ile gez).
 * Client bileşen: veriyi prop alır, DB/queries import etmez.
 */
export default function ProductGallery({ images, baslik }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((c) => (c === null ? c : (c - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setActiveIndex((c) => (c === null ? c : (c + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    dialogRef.current?.focus();
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (images.length === 0) return null;

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <div className={styles.gallery}>
      {images.map((src, i) => (
        <button
          key={`${src}-${i}`}
          type="button"
          className={styles.item}
          onClick={() => setActiveIndex(i)}
          aria-label={`${baslik} görseli ${i + 1} — büyüt`}
        >
          {/* Doğal boyut/oran korunur (next/image yerine düz img). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`${baslik} görseli ${i + 1}`} loading="lazy" />
        </button>
      ))}

      {active && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className={styles.overlay} onClick={close}>
          <div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`${baslik} görseli`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={close} aria-label="Kapat">
              ×
            </button>
            {images.length > 1 && (
              <button
                type="button"
                className={`${styles.nav} ${styles.prev}`}
                onClick={showPrev}
                aria-label="Önceki"
              >
                ‹
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.full} src={active} alt={baslik} />
            {images.length > 1 && (
              <button
                type="button"
                className={`${styles.nav} ${styles.next}`}
                onClick={showNext}
                aria-label="Sonraki"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
