'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Settings } from '@/lib/types';
import ImageUpload from './ImageUpload';
import Toast, { type ToastState } from './Toast';
import styles from './AdminForm.module.css';

type PageImageKey = 'hero_gorsel' | 'kapak_gorsel_2' | 'hakkimda_gorsel' | 'iletisim_gorsel';

interface PageImagesFormProps {
  settings: Settings;
}

const SLOTS: { key: PageImageKey; label: string }[] = [
  { key: 'hero_gorsel', label: 'Kapak — ana görsel' },
  { key: 'kapak_gorsel_2', label: 'Kapak — ikincil görsel' },
  { key: 'hakkimda_gorsel', label: 'Hakkımda görseli' },
  { key: 'iletisim_gorsel', label: 'İletişim görseli' },
];

/**
 * Sayfa başına düzenlenebilir görsel slotları. Yalnızca dört görsel alanını
 * `PUT /api/admin/settings`'e gönderir. DB'ye doğrudan erişmez.
 */
export default function PageImagesForm({ settings }: PageImagesFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<PageImageKey, string>>({
    hero_gorsel: settings.hero_gorsel,
    kapak_gorsel_2: settings.kapak_gorsel_2,
    hakkimda_gorsel: settings.hakkimda_gorsel,
    iletisim_gorsel: settings.iletisim_gorsel,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function update(key: PageImageKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast({ type: 'error', text: data.error ?? 'Kaydetme başarısız oldu' });
        return;
      }
      setToast({ type: 'success', text: 'Sayfa görselleri kaydedildi' });
      router.refresh();
    } catch {
      setToast({ type: 'error', text: 'Sunucuya ulaşılamadı' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Toast state={toast} onClose={() => setToast(null)} />

      {SLOTS.map((slot) => (
        <div key={slot.key} className={styles.field}>
          <span>{slot.label}</span>
          <ImageUpload value={form[slot.key]} onChange={(path) => update(slot.key, path)} />
        </div>
      ))}

      <div className={styles.actions}>
        <button type="submit" disabled={saving}>
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
