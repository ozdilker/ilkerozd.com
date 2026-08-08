import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Sayfa bulunamadı</h1>
        <p className={styles.message}>
          Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
        </p>
        <a href="/" className={styles.link}>
          Ana sayfaya dön
        </a>
      </div>
    </div>
  );
}
