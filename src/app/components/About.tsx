import styles from './About.module.css';

interface AboutProps {
  metin: string;
}

/**
 * `hakkimda_metin` alanını basit biçimde paragraflara böler.
 * Ağır bir markdown kütüphanesi eklemek yerine boş satırlara göre
 * ayrılan metni <p> etiketleriyle render eder.
 */
export default function About({ metin }: AboutProps) {
  const paragraphs = metin
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="hakkimda" className={`container ${styles.about}`}>
      <h2 className={styles.title}>Hakkımda</h2>
      <div className={styles.body}>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>{metin}</p>
        )}
      </div>
    </section>
  );
}
