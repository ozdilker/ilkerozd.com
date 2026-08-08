import type { Metadata } from 'next';
import './globals.css';
import { getSettings } from '@/lib/queries';

export function generateMetadata(): Metadata {
  const settings = getSettings();
  return {
    title: `${settings.isim} — Portfolyo`,
    description: settings.hero_tagline || undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
