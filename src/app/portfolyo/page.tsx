import { getPublishedProducts } from '@/lib/queries';
import PageShell from '../components/PageShell';
import EditorialTitle from '../components/editorial/EditorialTitle';
import ProjectBlock from '../components/ProjectBlock';
import styles from './page.module.css';

export const dynamic = 'force-static';

export default function PortfolyoPage() {
  const products = getPublishedProducts();

  return (
    <PageShell>
      <section className={styles.wrap}>
        <header className={styles.head}>
          <EditorialTitle as="h1">portfolyo</EditorialTitle>
          <span className={styles.count}>
            {products.length.toString().padStart(2, '0')} proje
          </span>
        </header>

        {products.length > 0 ? (
          <div className={styles.list}>
            {products.map((product, i) => (
              <ProjectBlock key={product.id} product={product} index={i + 1} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Henüz proje eklenmedi.</p>
        )}
      </section>
    </PageShell>
  );
}
