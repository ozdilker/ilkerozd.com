import { getSettings } from '@/lib/queries';
import Nav from './Nav';
import Footer from './Footer';
import styles from './PageShell.module.css';

interface PageShellProps {
  children: React.ReactNode;
}

/** Nav + içerik + Footer + kağıt zemin sarmalayıcı. */
export default function PageShell({ children }: PageShellProps) {
  const settings = getSettings();
  return (
    <div className={styles.shell}>
      <Nav isim={settings.isim} />
      <main className={styles.main}>{children}</main>
      <Footer isim={settings.isim} />
    </div>
  );
}
