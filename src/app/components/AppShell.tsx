import Image from 'next/image';
import styles from './OzetShell.module.css';

interface FooterLink {
  href: string;
  label: string;
}

interface AppShellProps {
  children: React.ReactNode;
  /** Uygulamanın adı; başlıkta ve telif satırında görünür. */
  appName: string;
  /** `public/` altındaki uygulama ikonu (ör. /orbit-icon.png). */
  icon: string;
  /** Alt bilgideki bağlantılar — sayfanın kendi diline uygun olmalı. */
  footerLinks?: FooterLink[];
  /** İçeriğin dili; `text-transform: uppercase` doğru harf kuralını seçsin diye. */
  lang?: string;
}

/**
 * Bir uygulamanın yasal/destek sayfaları (ör. /orbit/privacy) için sade
 * sarmalayıcı: ikon + uygulama adı + içerik + minimal alt bilgi. Sitenin
 * portfolyo menüsü bu sayfalarda alakasız; her yeni uygulama aynı kabuğu
 * `appName` ve `icon` vererek kullanır. Görünüm OzetShell ile ortaktır.
 */
export default function AppShell({ children, appName, icon, footerLinks, lang }: AppShellProps) {
  const year = new Date().getFullYear();
  return (
    <div className={styles.shell} lang={lang}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Image src={icon} alt="" width={32} height={32} className={styles.icon} />
          <span className={styles.wordmark}>{appName}</span>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        {footerLinks && footerLinks.length > 0 && (
          <nav className={styles.links}>
            {footerLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
        <span className={styles.year}>© {year} {appName}</span>
      </footer>
    </div>
  );
}
