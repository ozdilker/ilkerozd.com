'use client';

import styles from './Toast.module.css';

export interface ToastState {
  type: 'success' | 'error';
  text: string;
}

interface ToastProps {
  state: ToastState | null;
  onClose: () => void;
}

/** Form/liste bileşenlerinde başarı/hata mesajı göstermek için kullanılan basit toast. */
export default function Toast({ state, onClose }: ToastProps) {
  if (!state) return null;

  return (
    <div
      className={`${styles.toast} ${state.type === 'error' ? styles.error : styles.success}`}
      role="status"
    >
      <span>{state.text}</span>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Kapat">
        ×
      </button>
    </div>
  );
}
