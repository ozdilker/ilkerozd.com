import Image from 'next/image';
import styles from './OzetShell.module.css';

interface FooterLink {
  href: string;
  label: string;
}

interface OzetShellProps {
  children: React.ReactNode;
  /** Alt bilgideki bağlantılar — sayfanın kendi diline uygun olmalı. Yoksa yalnızca telif satırı. */
  footerLinks?: FooterLink[];
  /**
   * İçeriğin dili. Kök <html lang="tr">; İngilizce içerikte CSS `text-transform:
   * uppercase` bu yüzden "i"yi Türkçe kurala göre "İ" yapıyordu (PRİVACY). Dili
   * sarmalayıcıda açıkça vermek bunu düzeltir.
   */
  lang?: string;
}

/**
 * Ozet uygulamasından gelinen sayfalar (/en/yasal, /e-posta-dogrulandi) için
 * sade sarmalayıcı: logo + içerik + minimal alt bilgi. Sitenin genel portfolyo
 * menüsü/alt bilgisi (PageShell) bu sayfalarda alakasız ve yanlış dile gidiyor.
 */
export default function OzetShell({ children, footerLinks, lang }: OzetShellProps) {
  const year = new Date().getFullYear();
  return (
    <div className={styles.shell} lang={lang}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Image src="/ozet-icon.png" alt="" width={32} height={32} className={styles.icon} />
          <span className={styles.wordmark}>Ozet</span>
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
        <span className={styles.year}>© {year} Ozet</span>
      </footer>
    </div>
  );
}
