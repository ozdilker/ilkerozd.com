'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Settings } from '@/lib/types';
import ImageUpload from './ImageUpload';
import Toast, { type ToastState } from './Toast';
import styles from './AdminForm.module.css';

interface SettingsFormProps {
  settings: Settings;
}

/**
 * Site ayarları formu (isim, unvan, hero, hakkımda, iletişim). `PUT
 * /api/admin/settings`'e gönderir. DB'ye doğrudan erişmez.
 */
export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
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
      setToast({ type: 'success', text: 'Ayarlar kaydedildi' });
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

      <label className={styles.field}>
        <span>İsim</span>
        <input value={form.isim} onChange={(e) => update('isim', e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>Unvan</span>
        <input value={form.unvan} onChange={(e) => update('unvan', e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>Hero tagline</span>
        <input
          value={form.hero_tagline}
          onChange={(e) => update('hero_tagline', e.target.value)}
        />
      </label>

      <div className={styles.field}>
        <span>Hero görsel</span>
        <ImageUpload value={form.hero_gorsel} onChange={(path) => update('hero_gorsel', path)} />
      </div>

      <label className={styles.field}>
        <span>Hakkımda</span>
        <textarea
          value={form.hakkimda_metin}
          onChange={(e) => update('hakkimda_metin', e.target.value)}
          rows={8}
        />
      </label>

      <label className={styles.field}>
        <span>E-posta</span>
        <input value={form.email} onChange={(e) => update('email', e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>GitHub</span>
        <input value={form.github} onChange={(e) => update('github', e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>LinkedIn</span>
        <input value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>Twitter</span>
        <input value={form.twitter} onChange={(e) => update('twitter', e.target.value)} />
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={saving}>
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
