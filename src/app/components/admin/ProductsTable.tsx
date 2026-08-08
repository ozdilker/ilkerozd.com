'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import Toast, { type ToastState } from './Toast';
import styles from './ProductsTable.module.css';

interface ProductsTableProps {
  products: Product[];
}

/**
 * Admin ürün listesi: sırala (yukarı/aşağı), düzenle linki, sil. Sunucu
 * bileşeninden gelen `products` prop'unu gösterir; mutasyonlardan sonra
 * `router.refresh()` ile güncel veriyi ister. DB'ye doğrudan erişmez,
 * yalnızca `/api/admin/*` uç noktalarını `fetch` ile çağırır.
 */
export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  async function handleDelete(id: number, baslik: string) {
    if (!window.confirm(`"${baslik}" silinsin mi? Bu işlem geri alınamaz.`)) {
      return;
    }
    setPendingId(id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast({ type: 'error', text: data.error ?? 'Silme başarısız oldu' });
        return;
      }
      setToast({ type: 'success', text: 'Ürün silindi' });
      router.refresh();
    } catch {
      setToast({ type: 'error', text: 'Sunucuya ulaşılamadı' });
    } finally {
      setPendingId(null);
    }
  }

  async function handleReorder(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= products.length) {
      return;
    }
    const ids = products.map((p) => p.id);
    const tmp = ids[index];
    ids[index] = ids[targetIndex];
    ids[targetIndex] = tmp;

    setReordering(true);
    try {
      const res = await fetch('/api/admin/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast({ type: 'error', text: data.error ?? 'Sıralama başarısız oldu' });
        return;
      }
      router.refresh();
    } catch {
      setToast({ type: 'error', text: 'Sunucuya ulaşılamadı' });
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      <Toast state={toast} onClose={() => setToast(null)} />
      {products.length === 0 ? (
        <p className={styles.empty}>Henüz ürün eklenmedi.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Durum</th>
              <th>Sıra</th>
              <th aria-label="İşlemler" />
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{product.baslik}</td>
                <td>
                  <span className={product.yayinda ? styles.published : styles.draft}>
                    {product.yayinda ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td>
                  <div className={styles.reorder}>
                    <button
                      type="button"
                      onClick={() => handleReorder(index, -1)}
                      disabled={index === 0 || reordering}
                      aria-label="Yukarı taşı"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(index, 1)}
                      disabled={index === products.length - 1 || reordering}
                      aria-label="Aşağı taşı"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td className={styles.actions}>
                  <Link href={`/admin/urunler/${product.id}`}>Düzenle</Link>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(product.id, product.baslik)}
                    disabled={pendingId === product.id}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
