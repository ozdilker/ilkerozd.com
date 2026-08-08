import { getSettings } from '@/lib/queries';
import SettingsForm from '@/app/components/admin/SettingsForm';
import styles from './page.module.css';

/** Admin ayarlar sayfası: site geneli metin/görsel/iletişim alanları. */
export default function AdminSettingsPage() {
  const settings = getSettings();

  return (
    <div>
      <h1 className={styles.title}>Ayarlar</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
