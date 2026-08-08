import styles from './Footer.module.css';

interface FooterProps {
  isim: string;
}

export default function Footer({ isim }: FooterProps) {
  const yil = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.mark}>{isim}</span>
      <span className={styles.year}>© {yil}</span>
    </footer>
  );
}
