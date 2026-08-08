import styles from './ContactSection.module.css';
import type { Settings } from '@/lib/types';

interface ContactSectionProps {
  settings: Settings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const { email, github, linkedin, twitter } = settings;

  const socials = [
    { href: github, label: 'GitHub' },
    { href: linkedin, label: 'LinkedIn' },
    { href: twitter, label: 'Twitter' },
  ].filter((s) => s.href);

  return (
    <section id="iletisim" className={`container ${styles.section}`}>
      <h2 className={styles.title}>İletişim</h2>
      {email && (
        <a className={styles.email} href={`mailto:${email}`}>
          {email}
        </a>
      )}
      {socials.length > 0 && (
        <div className={styles.links}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
