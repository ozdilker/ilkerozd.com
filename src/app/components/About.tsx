import styles from './About.module.css';
import { splitParagraphs } from '@/lib/text';

interface AboutProps {
  metin: string;
}

export default function About({ metin }: AboutProps) {
  const paragraphs = splitParagraphs(metin);

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
