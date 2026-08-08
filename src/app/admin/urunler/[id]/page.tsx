import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/queries';
import ProductForm from '@/app/components/admin/ProductForm';
import styles from './page.module.css';

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

/**
 * `id === 'yeni'` ise boş formla yeni ürün oluşturma; sayısal bir id ise
 * mevcut ürünü düzenleme. Ürün bulunamazsa/id geçersizse 404.
 */
export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;

  if (id === 'yeni') {
    return (
      <div>
        <h1 className={styles.title}>Yeni ürün</h1>
        <ProductForm product={null} />
      </div>
    );
  }

  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const product = getAllProducts().find((p) => p.id === numericId);
  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className={styles.title}>Ürünü düzenle</h1>
      <ProductForm product={product} />
    </div>
  );
}
