import Link from 'next/link';
import { getAllProducts, getGallery } from '@/lib/queries';
import styles from './page.module.css';

/** Admin özet paneli: ürün/galeri sayıları ve hızlı linkler. */
export default function AdminDashboardPage() {
  const products = getAllProducts();
  const gallery = getGallery();
  const yayinda = products.filter((p) => p.yayinda).length;
  const taslak = products.length - yayinda;

  return (
    <div>
      <h1 className={styles.title}>Panel</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.value}>{products.length}</p>
          <p className={styles.label}>Ürün</p>
        </div>
        <div className={styles.card}>
          <p className={styles.value}>{yayinda}</p>
          <p className={styles.label}>Yayında</p>
        </div>
        <div className={styles.card}>
          <p className={styles.value}>{taslak}</p>
          <p className={styles.label}>Taslak</p>
        </div>
        <div className={styles.card}>
          <p className={styles.value}>{gallery.length}</p>
          <p className={styles.label}>Galeri görseli</p>
        </div>
      </div>

      <div className={styles.links}>
        <Link href="/admin/urunler">Ürünleri yönet →</Link>
        <Link href="/admin/galeri">Galeriyi yönet →</Link>
        <Link href="/admin/ayarlar">Ayarları düzenle →</Link>
      </div>
    </div>
  );
}
