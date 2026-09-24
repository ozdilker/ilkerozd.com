'use client';

import { useEffect, useState, type FormEvent } from 'react';
import styles from './page.module.css';

// Bu anon key mobil uygulamadaki (src/lib/supabase.ts) ile birebir aynı —
// herkese açık olacak şekilde tasarlanmıştır, asıl koruma RLS politikalarında.
const SUPABASE_URL = 'https://ikfabmwjzquduwaszgvc.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmFibXdqenF1ZHV3YXN6Z3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNzI4NDcsImV4cCI6MjEwMjk0ODg0N30.JBVZJqSLGbpmOa9Myfh_iJDUqk2d6_3qPnwERarI2VU';

type Mode = 'loading' | 'confirmed' | 'recovery' | 'recovery-done' | 'error';
type Lang = 'tr' | 'en';

/**
 * Sayfa tek ve statik; dil istemcide, tarayıcı dilinden seçilir (mobil
 * uygulamadaki mantığın aynısı): navigator.language 'tr' ile başlıyorsa
 * Türkçe, diğer her dilde İngilizce. Ayrı bir /en sayfası yok — Supabase Site
 * URL'i tek adrese işaret ediyor.
 */
const TEXT = {
  tr: {
    errorTitle: 'Bağlantının süresi dolmuş',
    linkInvalid: 'Bu bağlantı artık geçerli değil.',
    linkExpiredOrInvalid: 'Bu bağlantı geçersiz ya da süresi dolmuş.',
    errorHint: 'Uygulamaya dönüp işlemi tekrar başlatabilirsin.',
    confirmedTitle: 'E-postan doğrulandı',
    confirmedText:
      'Hesabın başarıyla doğrulandı. Şimdi Özet uygulamasına dönüp giriş yapabilirsin.',
    openApp: "Özet'i Aç",
    doneTitle: 'Şifren güncellendi',
    doneText:
      'Yeni şifreni kaydettik. Şimdi Özet uygulamasına dönüp yeni şifrenle giriş yapabilirsin.',
    recoveryTitle: 'Yeni şifre belirle',
    recoveryText: 'Özet hesabın için yeni bir şifre gir.',
    newPassword: 'Yeni şifre',
    newPasswordAgain: 'Yeni şifre (tekrar)',
    save: 'Şifreyi Kaydet',
    saving: 'Kaydediliyor…',
    errTooShort: 'Şifre en az 6 karakter olmalı.',
    errMismatch: 'Şifreler eşleşmiyor.',
    errUpdateFailed: 'Şifre güncellenemedi.',
    errSamePassword: 'Yeni şifre eskisinden farklı olmalı.',
  },
  en: {
    errorTitle: 'This link has expired',
    linkInvalid: 'This link is no longer valid.',
    linkExpiredOrInvalid: 'This link is invalid or has expired.',
    errorHint: 'Go back to the app and start again.',
    confirmedTitle: 'Your email is confirmed',
    confirmedText:
      'Your account is verified. Head back to the Ozet app to sign in.',
    openApp: 'Open Ozet',
    doneTitle: 'Password updated',
    doneText: "We've saved your new password. Head back to the Ozet app and sign in with it.",
    recoveryTitle: 'Set a new password',
    recoveryText: 'Choose a new password for your Ozet account.',
    newPassword: 'New password',
    newPasswordAgain: 'Confirm new password',
    save: 'Save password',
    saving: 'Saving…',
    errTooShort: 'Password must be at least 6 characters.',
    errMismatch: "Passwords don't match.",
    errUpdateFailed: "Couldn't update your password.",
    errSamePassword: 'Your new password must be different from the old one.',
  },
} as const;

function detectLang(): Lang {
  return (navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

/**
 * Supabase'in ham (İngilizce) hata metni kullanıcıya ASLA gösterilmez — iki dilde
 * de aynı davranış: bilinen durumlar seçilen dilde karşılanır, tanınmayan her şey
 * genel mesaja düşer. Ham metin yalnızca tarayıcı konsoluna yazılır (hata ayıklama).
 */
function localizeServerMessage(
  raw: string | null | undefined,
  lang: Lang,
  fallback: string
): string {
  const t = TEXT[lang];
  if (raw) {
    console.error('[auth-callback] server message:', raw);
    if (/different from the old password/i.test(raw)) return t.errSamePassword;
    if (/at least \d+ characters/i.test(raw)) return t.errTooShort;
    if (/expired|invalid/i.test(raw)) return t.linkExpiredOrInvalid;
  }
  return fallback;
}

/**
 * Supabase'in Site URL'i olarak tek bu sayfa tanımlı; hem e-posta doğrulama
 * hem şifre sıfırlama linkleri buraya düşüyor. Hangisi olduğunu URL hash'indeki
 * `type` alanından ayırt edip doğru arayüzü gösteriyoruz.
 */
export default function AuthCallback() {
  const [mode, setMode] = useState<Mode>('loading');
  // Dil, sayfa istemcide açıldığında bir kez belirlenir. Sunucuda render edilen
  // (statik) çıktı 'loading' modunda boş olduğu için yanlış dilde bir flaş yok.
  const [lang, setLang] = useState<Lang>('en');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const t = TEXT[lang];

  useEffect(() => {
    const detected = detectLang();
    setLang(detected);
    document.documentElement.lang = detected;

    const raw = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(raw);
    const type = params.get('type');
    const token = params.get('access_token');
    const err = params.get('error_description') || params.get('error');

    if (err) {
      const decoded = decodeURIComponent(err.replace(/\+/g, ' '));
      setErrorMsg(localizeServerMessage(decoded, detected, TEXT[detected].linkInvalid));
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
      setErrorMsg(t.errTooShort);
      return;
    }
    if (password !== password2) {
      setErrorMsg(t.errMismatch);
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
        setErrorMsg(
          localizeServerMessage(json?.msg ?? json?.error_description, lang, t.errUpdateFailed)
        );
        return;
      }
      setMode('recovery-done');
    } catch (err: unknown) {
      // Ağ hatası gibi ham tarayıcı metinleri de kullanıcıya gösterilmez.
      console.error('[auth-callback] password update failed:', err);
      setErrorMsg(t.errUpdateFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'loading') return null;

  if (mode === 'error') {
    return (
      <div className={styles.wrap}>
        <span className={styles.checkError}>!</span>
        <h1 className={styles.title}>{t.errorTitle}</h1>
        <p className={styles.text}>
          {errorMsg ?? t.linkInvalid} {t.errorHint}
        </p>
      </div>
    );
  }

  if (mode === 'confirmed') {
    return (
      <div className={styles.wrap}>
        <span className={styles.check}>✓</span>
        <h1 className={styles.title}>{t.confirmedTitle}</h1>
        <p className={styles.text}>{t.confirmedText}</p>
        <a className={styles.button} href="ozetapp://">
          {t.openApp}
        </a>
      </div>
    );
  }

  if (mode === 'recovery-done') {
    return (
      <div className={styles.wrap}>
        <span className={styles.check}>✓</span>
        <h1 className={styles.title}>{t.doneTitle}</h1>
        <p className={styles.text}>{t.doneText}</p>
        <a className={styles.button} href="ozetapp://">
          {t.openApp}
        </a>
      </div>
    );
  }

  // mode === 'recovery'
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{t.recoveryTitle}</h1>
      <p className={styles.text}>{t.recoveryText}</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="password"
          placeholder={t.newPassword}
          aria-label={t.newPassword}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          className={styles.input}
          type="password"
          placeholder={t.newPasswordAgain}
          aria-label={t.newPasswordAgain}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
        />
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? t.saving : t.save}
        </button>
      </form>
    </div>
  );
}
