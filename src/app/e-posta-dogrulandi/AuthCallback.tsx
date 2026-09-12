'use client';

import { useEffect, useState, type FormEvent } from 'react';
import styles from './page.module.css';

// Bu anon key mobil uygulamadaki (src/lib/supabase.ts) ile birebir aynı —
// herkese açık olacak şekilde tasarlanmıştır, asıl koruma RLS politikalarında.
const SUPABASE_URL = 'https://ikfabmwjzquduwaszgvc.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmFibXdqenF1ZHV3YXN6Z3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNzI4NDcsImV4cCI6MjEwMjk0ODg0N30.JBVZJqSLGbpmOa9Myfh_iJDUqk2d6_3qPnwERarI2VU';

type Mode = 'loading' | 'confirmed' | 'recovery' | 'recovery-done' | 'error';

/**
 * Supabase'in Site URL'i olarak tek bu sayfa tanımlı; hem e-posta doğrulama
 * hem şifre sıfırlama linkleri buraya düşüyor. Hangisi olduğunu URL hash'indeki
 * `type` alanından ayırt edip doğru arayüzü gösteriyoruz.
 */
export default function AuthCallback() {
  const [mode, setMode] = useState<Mode>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raw = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(raw);
    const type = params.get('type');
    const token = params.get('access_token');
    const err = params.get('error_description') || params.get('error');

    if (err) {
      setErrorMsg(decodeURIComponent(err.replace(/\+/g, ' ')));
      setMode('error');
      return;
    }
    if (type === 'recovery' && token) {
      setAccessToken(token);
      setMode('recovery');
      return;
    }
    setMode('confirmed');
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('Şifre en az 6 karakter olmalı.');
      return;
    }
    if (password !== password2) {
      setErrorMsg('Şifreler eşleşmiyor.');
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.msg ?? json?.error_description ?? 'Şifre güncellenemedi.');
      }
      setMode('recovery-done');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Şifre güncellenemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'loading') return null;

  if (mode === 'error') {
    return (
      <div className={styles.wrap}>
        <span className={styles.checkError}>!</span>
        <h1 className={styles.title}>Bağlantının süresi dolmuş</h1>
        <p className={styles.text}>
          {errorMsg ?? 'Bu bağlantı artık geçerli değil.'} Uygulamaya dönüp işlemi tekrar
          başlatabilirsin.
        </p>
      </div>
    );
  }

  if (mode === 'confirmed') {
    return (
      <div className={styles.wrap}>
        <span className={styles.check}>✓</span>
        <h1 className={styles.title}>E-postan doğrulandı</h1>
        <p className={styles.text}>
          Hesabın başarıyla doğrulandı. Şimdi Özet uygulamasına dönüp e-posta ve şifrenle
          giriş yapabilirsin.
        </p>
        <a className={styles.button} href="ozetapp://">
          Özet&apos;i Aç
        </a>
      </div>
    );
  }

  if (mode === 'recovery-done') {
    return (
      <div className={styles.wrap}>
        <span className={styles.check}>✓</span>
        <h1 className={styles.title}>Şifren güncellendi</h1>
        <p className={styles.text}>
          Yeni şifreni kaydettik. Şimdi Özet uygulamasına dönüp yeni şifrenle giriş
          yapabilirsin.
        </p>
        <a className={styles.button} href="ozetapp://">
          Özet&apos;i Aç
        </a>
      </div>
    );
  }

  // mode === 'recovery'
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Yeni şifre belirle</h1>
      <p className={styles.text}>Özet hesabın için yeni bir şifre gir.</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="password"
          placeholder="Yeni şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Yeni şifre (tekrar)"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
        />
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? 'Kaydediliyor…' : 'Şifreyi Kaydet'}
        </button>
      </form>
    </div>
  );
}
