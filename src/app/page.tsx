import { getSettings } from '@/lib/queries';
import PageShell from './components/PageShell';
import RedDot from './components/editorial/RedDot';
import BwImage from './components/editorial/BwImage';
import styles from './page.module.css';

export const dynamic = 'force-static';

export default function Home() {
  const settings = getSettings();

  return (
    <PageShell>
      <section className={styles.cover}>
        <div className={styles.meta}>
          <span className={styles.eyebrow}>{settings.unvan}</span>
          {settings.kapak_gorsel_2 ? (
            <div className={styles.thumb}>
              <BwImage
                src={settings.kapak_gorsel_2}
                alt={settings.isim}
                fill
                sizes="(max-width: 640px) 40vw, 160px"
              />
            </div>
          ) : null}
          <p className={styles.intro}>{settings.hero_tagline}</p>
        </div>

        <div className={styles.headingWrap}>
          <RedDot size={64} className={styles.dot} />
          <h1 className={styles.name}>{settings.isim}</h1>
          <span className={styles.kicker}>portfolyo</span>
        </div>

        <figure className={styles.hero}>
          <BwImage
            src={settings.hero_gorsel}
            alt={settings.isim}
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            priority
          />
        </figure>
      </section>
    </PageShell>
  );
}
