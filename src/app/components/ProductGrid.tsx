import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section id="portfolyo" className={`container ${styles.section}`}>
      <h2 className={styles.title}>Portfolyo</h2>
      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Henüz proje eklenmedi.</p>
      )}
    </section>
  );
}
