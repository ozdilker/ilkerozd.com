'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  value: string;
  onChange: (path: string) => void;
}

/**
 * Dosya seçici / sürükle-bırak ile `/api/admin/upload`'a görsel yükler.
 * Yükleme başarılıysa dönen `path`'i (`/uploads/<ad>`) `onChange` ile üst
 * bileşene bildirir; üst bileşen bu path'i form durumunda tutar.
 */
export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Yükleme başarısız oldu');
        return;
      }
      onChange(data.path as string);
    } catch {
      setError('Sunucuya ulaşılamadı');
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) {
      void upload(file);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        {value ? (
          <div className={styles.preview}>
            <Image src={value} alt="Önizleme" fill className={styles.previewImage} sizes="200px" />
          </div>
        ) : (
          <p className={styles.hint}>
            {uploading ? 'Yükleniyor…' : 'Görsel seçmek için tıklayın veya sürükleyip bırakın'}
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className={styles.fileInput}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className={styles.controls}>
        {value && (
          <button type="button" className={styles.removeButton} onClick={() => onChange('')}>
            Görseli kaldır
          </button>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
