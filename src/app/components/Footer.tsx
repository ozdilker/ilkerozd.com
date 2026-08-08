import styles from './Footer.module.css';

interface FooterProps {
  isim: string;
}

export default function Footer({ isim }: FooterProps) {
  const yil = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        © {yil} {isim}
      </p>
    </footer>
  );
}
