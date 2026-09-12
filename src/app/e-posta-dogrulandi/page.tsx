import type { Metadata } from 'next';
import PageShell from '../components/PageShell';
import styles from './page.module.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'E-postan Doğrulandı — Özet',
  description: 'Özet hesabın doğrulandı, uygulamaya dönüp giriş yapabilirsin.',
};

export default function EpostaDogrulandiPage() {
  return (
    <PageShell>
      <div className={styles.wrap}>
        <span className={styles.check}>✓</span>
        <h1 className={styles.title}>E-postan doğrulandı</h1>
        <p className={styles.text}>
          Hesabın başarıyla doğrulandı. Şimdi Özet uygulamasına dönüp e-posta ve şifrenle
          giriş yapabilirsin.
        </p>
        <a className={styles.button} href="ozetapp://">
          Özet&apos;i Aç
        </a>
      </div>
    </PageShell>
  );
}
