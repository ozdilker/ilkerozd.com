import type { Metadata } from 'next';
import OzetShell from '../components/OzetShell';
import AuthCallback from './AuthCallback';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  // Dil istemcide seçildiği için (bkz. AuthCallback) sekme başlığı dilden bağımsız,
  // yalnızca marka adı. Sunucu çıktısı statik; başlığı sonradan istemcide değiştirmek
  // Next'in metadata güncellemesiyle yarışıyor.
  title: 'Ozet',
  description: 'Ozet — e-posta doğrulama ve şifre sıfırlama / email confirmation and password reset.',
};

export default function EpostaDogrulandiPage() {
  return (
    <OzetShell>
      <AuthCallback />
    </OzetShell>
  );
}
