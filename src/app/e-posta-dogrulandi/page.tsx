import type { Metadata } from 'next';
import PageShell from '../components/PageShell';
import AuthCallback from './AuthCallback';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Hesap İşlemi — Özet',
  description: 'E-posta doğrulama ve şifre sıfırlama işlemleri için Özet yönlendirme sayfası.',
};

export default function EpostaDogrulandiPage() {
  return (
    <PageShell>
      <AuthCallback />
    </PageShell>
  );
}
