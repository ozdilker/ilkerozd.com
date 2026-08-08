'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { GalleryItem } from '@/lib/types';
import ImageUpload from './ImageUpload';
import Toast, { type ToastState } from './Toast';
import styles from './GalleryManager.module.css';

interface GalleryManagerProps {
  items: GalleryItem[];
}

/**
 * Galeri yönetimi: yeni görsel ekleme (ImageUpload → POST), grid içinde
 * her öğe için düzenle (başlık/açıklama/sıra) ve sil. DB'ye doğrudan
 * erişmez, yalnızca `/api/admin/gallery`'yi `fetch` ile çağırır.
 */
export default function GalleryManager({ items }: GalleryManagerProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleAdd(path: string) {
    setAdding(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gorsel: path, sira: items.length }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast({ type: 'error', text: data.error ?? 'Ekleme başarısız oldu' });
        return;
      }
      setToast({ type: 'success', text: 'Görsel eklendi' });
      router.refresh();
    } catch {
      setToast({ type: 'error', text: 'Sunucuya ulaşılamadı' });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <Toast state={toast} onClose={() => setToast(null)} />

      <div className={styles.addSection}>
        <p className={styles.addLabel}>{adding ? 'Ekleniyor…' : 'Yeni görsel ekle'}</p>
        <ImageUpload value="" onChange={handleAdd} />
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>Henüz galeri görseli eklenmedi.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <GalleryItemCard key={item.id} item={item} onNotify={setToast} />
          ))}
        </div>
      )}
    </div>
  );
}

interface GalleryItemCardProps {
  item: GalleryItem;
  onNotify: (toast: ToastState | null) => void;
}

function GalleryItemCard({ item, onNotify }: GalleryItemCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [baslik, setBaslik] = useState(item.baslik);
  const [aciklama, setAciklama] = useState(item.aciklama);
  const [sira, setSira] = useState(item.sira);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, baslik, aciklama, sira }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify({ type: 'error', text: data.error ?? 'Güncelleme başarısız oldu' });
        return;
      }
      onNotify({ type: 'success', text: 'Görsel güncellendi' });
      setEditing(false);
      router.refresh();
    } catch {
      onNotify({ type: 'error', text: 'Sunucuya ulaşılamadı' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Bu görsel silinsin mi? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify({ type: 'error', text: data.error ?? 'Silme başarısız oldu' });
        return;
      }
      onNotify({ type: 'success', text: 'Görsel silindi' });
      router.refresh();
    } catch {
      onNotify({ type: 'error', text: 'Sunucuya ulaşılamadı' });
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={item.gorsel}
          alt={item.baslik || 'Galeri görseli'}
          fill
          className={styles.image}
          sizes="220px"
        />
      </div>

      {editing ? (
        <div className={styles.editForm}>
          <input value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="Başlık" />
          <input
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            placeholder="Açıklama"
          />
          <input
            type="number"
            value={sira}
            onChange={(e) => setSira(Number(e.target.value))}
            placeholder="Sıra"
          />
          <div className={styles.cardActions}>
            <button type="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
            <button type="button" className={styles.secondary} onClick={() => setEditing(false)}>
              Vazgeç
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.cardBody}>
          <p className={styles.cardTitle}>{item.baslik || '(başlıksız)'}</p>
          {item.aciklama && <p className={styles.cardDesc}>{item.aciklama}</p>}
          <p className={styles.cardSira}>Sıra: {item.sira}</p>
          <div className={styles.cardActions}>
            <button type="button" onClick={() => setEditing(true)}>
              Düzenle
            </button>
            <button type="button" className={styles.deleteButton} onClick={handleDelete}>
              Sil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
