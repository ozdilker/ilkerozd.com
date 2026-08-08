import Link from 'next/link';
import { getAllProducts } from '@/lib/queries';
import ProductsTable from '@/app/components/admin/ProductsTable';
import styles from './page.module.css';

/** Admin ürün listesi: tüm ürünler (yayında/taslak), tablo + sırala/düzenle/sil. */
export default function AdminProductsPage() {
  const products = getAllProducts();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Ürünler</h1>
        <Link href="/admin/urunler/yeni" className={styles.newButton}>
          Yeni ürün
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
