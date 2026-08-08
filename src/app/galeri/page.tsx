import { getGallery } from '@/lib/queries';
import PageShell from '../components/PageShell';
import EditorialTitle from '../components/editorial/EditorialTitle';
import Lightbox from '../components/Lightbox';
import styles from './page.module.css';

export const dynamic = 'force-static';

export default function GaleriPage() {
  const gallery = getGallery();

  return (
    <PageShell>
      <section className={styles.wrap}>
        <header className={styles.head}>
          <EditorialTitle as="h1">galeri</EditorialTitle>
          <span className={styles.count}>
            {gallery.length.toString().padStart(2, '0')} kare
          </span>
        </header>
        <Lightbox items={gallery} />
      </section>
    </PageShell>
  );
}
