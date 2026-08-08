import { getSettings } from '@/lib/queries';
import PageImagesForm from '@/app/components/admin/PageImagesForm';
import styles from './page.module.css';

/** Admin: sayfa başına düzenlenebilir görsel slotları. */
export default function AdminPageImagesPage() {
  const settings = getSettings();

  return (
    <div>
      <h1 className={styles.title}>Sayfa Görselleri</h1>
      <p className={styles.hint}>
        Kapak, hakkımda ve iletişim sayfalarında görünen görselleri buradan
        değiştirebilirsin. Ürün ve galeri görselleri kendi ekranlarından yönetilir.
      </p>
      <PageImagesForm settings={settings} />
    </div>
  );
}
