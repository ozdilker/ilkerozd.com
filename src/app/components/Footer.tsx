import Link from 'next/link';
import styles from './Footer.module.css';

interface FooterProps {
  isim: string;
}

export default function Footer({ isim }: FooterProps) {
  const yil = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.mark}>{isim}</span>
      <nav className={styles.legal} aria-label="Yasal">
        <Link href="/yasal#gizlilik">Gizlilik</Link>
        <Link href="/yasal#kosullar">Kullanım Şartları</Link>
      </nav>
      <span className={styles.year}>© {yil}</span>
    </footer>
  );
}
