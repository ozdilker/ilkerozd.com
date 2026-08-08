'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import ImageUpload from './ImageUpload';
import TagInput from './TagInput';
import Toast, { type ToastState } from './Toast';
import styles from './AdminForm.module.css';

interface ProductFormProps {
  product: Product | null;
}

interface FormState {
  baslik: string;
  slug: string;
  kisa_aciklama: string;
  detay: string;
  kapak_gorsel: string;
  canli_link: string;
  github_link: string;
  teknolojiler: string[];
  sira: number;
  yayinda: boolean;
}

function toFormState(product: Product | null): FormState {
  if (!product) {
    return {
      baslik: '',
      slug: '',
      kisa_aciklama: '',
      detay: '',
      kapak_gorsel: '',
      canli_link: '',
      github_link: '',
      teknolojiler: [],
      sira: 0,
      yayinda: true,
    };
  }
  return {
    baslik: product.baslik,
    slug: product.slug,
    kisa_aciklama: product.kisa_aciklama,
    detay: product.detay,
    kapak_gorsel: product.kapak_gorsel,
    canli_link: product.canli_link,
    github_link: product.github_link,
    teknolojiler: product.teknolojiler,
    sira: product.sira,
    yayinda: product.yayinda,
  };
}

/**
 * Ürün oluşturma/düzenleme formu. `product` null ise POST (yeni ürün),
 * doluysa PUT (düzenle) ile `/api/admin/products`'a gönderir. DB'ye
 * doğrudan erişmez — yalnızca `fetch` ile API'yi çağırır ve `@/lib/types`
 * üzerinden tip alır (build zamanında elenir, client bundle'a DB girmez).
 */
export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(product));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.baslik.trim()) {
      setToast({ type: 'error', text: 'Başlık zorunludur' });
      return;
    }

    setSaving(true);
    setToast(null);
    try {
      const payload = {
        baslik: form.baslik,
        slug: form.slug,
        kisa_aciklama: form.kisa_aciklama,
        detay: form.detay,
        kapak_gorsel: form.kapak_gorsel,
        canli_link: form.canli_link,
        github_link: form.github_link,
        teknolojiler: form.teknolojiler,
        sira: form.sira,
        yayinda: form.yayinda,
      };

      const res = await fetch('/api/admin/products', {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product ? { id: product.id, ...payload } : payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast({ type: 'error', text: data.error ?? 'Kaydetme başarısız oldu' });
        return;
      }

      router.push('/admin/urunler');
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
        <span>Başlık</span>
        <input value={form.baslik} onChange={(e) => update('baslik', e.target.value)} required />
      </label>

      <label className={styles.field}>
        <span>Slug</span>
        <input
          value={form.slug}
          onChange={(e) => update('slug', e.target.value)}
          placeholder="boş bırakılırsa otomatik"
        />
      </label>

      <label className={styles.field}>
        <span>Kısa açıklama</span>
        <input
          value={form.kisa_aciklama}
          onChange={(e) => update('kisa_aciklama', e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Detay</span>
        <textarea
          value={form.detay}
          onChange={(e) => update('detay', e.target.value)}
          rows={8}
        />
      </label>

      <div className={styles.field}>
        <span>Kapak görsel</span>
        <ImageUpload value={form.kapak_gorsel} onChange={(path) => update('kapak_gorsel', path)} />
      </div>

      <label className={styles.field}>
        <span>Canlı link</span>
        <input value={form.canli_link} onChange={(e) => update('canli_link', e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>GitHub link</span>
        <input value={form.github_link} onChange={(e) => update('github_link', e.target.value)} />
      </label>

      <div className={styles.field}>
        <span>Teknolojiler</span>
        <TagInput value={form.teknolojiler} onChange={(tags) => update('teknolojiler', tags)} />
      </div>

      <label className={styles.field}>
        <span>Sıra</span>
        <input
          type="number"
          value={form.sira}
          onChange={(e) => update('sira', Number(e.target.value))}
        />
      </label>

      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          checked={form.yayinda}
          onChange={(e) => update('yayinda', e.target.checked)}
        />
        <span>Yayında</span>
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={saving}>
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
