import { getSettings } from '@/lib/queries';
import PageShell from '../components/PageShell';
import RedDot from '../components/editorial/RedDot';
import BwImage from '../components/editorial/BwImage';
import styles from './page.module.css';

export const dynamic = 'force-static';

interface SosyalLink {
  label: string;
  href: string;
}

export default function IletisimPage() {
  const settings = getSettings();

  const sosyal: SosyalLink[] = [
    { label: 'GitHub', href: settings.github },
    { label: 'LinkedIn', href: settings.linkedin },
    { label: 'Twitter', href: settings.twitter },
  ].filter((s) => s.href);

  return (
    <PageShell>
      <section className={styles.contact}>
        <div className={styles.left}>
          <RedDot size={56} className={styles.dot} />
          <h1 className={styles.title}>teşekkürler</h1>
          <p className={styles.lead}>Bir projeniz mi var? Konuşalım.</p>

          {settings.email ? (
            <a className={styles.email} href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          ) : null}

          {sosyal.length > 0 ? (
            <ul className={styles.social}>
              {sosyal.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {settings.iletisim_gorsel ? (
          <figure className={styles.figure}>
            <BwImage
              src={settings.iletisim_gorsel}
              alt={settings.isim}
              fill
              sizes="(max-width: 800px) 100vw, 45vw"
            />
          </figure>
        ) : null}
      </section>
    </PageShell>
  );
}
