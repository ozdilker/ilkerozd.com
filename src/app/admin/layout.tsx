import type { ReactNode } from 'react';
import Link from 'next/link';
import { assertAdminEnabled } from '@/lib/adminGuard';
import styles from './layout.module.css';

const links = [
  { href: '/admin', label: 'Panel' },
  { href: '/admin/urunler', label: 'Ürünler' },
  { href: '/admin/galeri', label: 'Galeri' },
  { href: '/admin/sayfa-gorselleri', label: 'Sayfa Görselleri' },
  { href: '/admin/ayarlar', label: 'Ayarlar' },
];

/**
 * `/admin` alt ağacının tamamını saran layout. `assertAdminEnabled()`
 * fonksiyonu bilinçli olarak bileşen gövdesinin İLK satırı — production'da
 * (`NODE_ENV === 'production'`) burada `notFound()` fırlatılır ve tüm
 * `/admin/*` isteği 404 ile sonlanır; altındaki hiçbir sayfa/route render
 * edilmez. Bu, projedeki admin özelliklerinin tek doğruluk kaynağıdır.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  assertAdminEnabled();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <p className={styles.brand}>Admin Panel</p>
        <nav>
          <ul className={styles.nav}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/" className={styles.backLink}>
          ← Siteye dön
        </Link>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
