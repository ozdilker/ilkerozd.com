import { getSettings } from '@/lib/queries';
import { splitParagraphs } from '@/lib/text';
import PageShell from '../components/PageShell';
import EditorialTitle from '../components/editorial/EditorialTitle';
import RedDot from '../components/editorial/RedDot';
import BwImage from '../components/editorial/BwImage';
import styles from './page.module.css';

export const dynamic = 'force-static';

export default function HakkimdaPage() {
  const settings = getSettings();
  const paragraflar = splitParagraphs(settings.hakkimda_metin);

  return (
    <PageShell>
      <section className={styles.about}>
        <header className={styles.head}>
          <EditorialTitle as="h1">hakkımda</EditorialTitle>
        </header>

        <div className={styles.body}>
          <div className={styles.text}>
            {paragraflar.length > 0 ? (
              paragraflar.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{settings.hakkimda_metin}</p>
            )}
          </div>

          <figure className={styles.portrait}>
            <RedDot size={48} className={styles.dot} />
            {settings.hakkimda_gorsel ? (
              <div className={styles.imgWrap}>
                <BwImage
                  src={settings.hakkimda_gorsel}
                  alt={settings.isim}
                  fill
                  sizes="(max-width: 800px) 100vw, 40vw"
                />
              </div>
            ) : null}
          </figure>
        </div>
      </section>
    </PageShell>
  );
}
