import { getGallery } from '@/lib/queries';
import GalleryManager from '@/app/components/admin/GalleryManager';
import styles from './page.module.css';

/** Admin galeri sayfası: mevcut görseller + ekleme/düzenleme/silme. */
export default function AdminGalleryPage() {
  const items = getGallery();

  return (
    <div>
      <h1 className={styles.title}>Galeri</h1>
      <GalleryManager items={items} />
    </div>
  );
}
