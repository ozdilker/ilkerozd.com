'use client';

import { useState } from 'react';
import styles from './TagInput.module.css';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

/** Teknoloji etiketleri için ekle/kaldır girişi. Enter veya virgül ile ekler, Backspace ile sonuncuyu kaldırır. */
export default function TagInput({ value, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function addTag() {
    const tag = draft.trim();
    if (!tag) {
      setDraft('');
      return;
    }
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className={styles.wrapper}>
      {value.map((tag) => (
        <span key={tag} className={styles.tag}>
          {tag}
          <button
            type="button"
            className={styles.remove}
            onClick={() => removeTag(tag)}
            aria-label={`${tag} etiketini kaldır`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="Teknoloji ekle, Enter'a bas"
        className={styles.input}
      />
    </div>
  );
}
