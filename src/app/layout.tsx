import type { Metadata } from 'next';
import './globals.css';
import { getSettings } from '@/lib/queries';
import { bodyFont, displayFont } from './fonts';

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
    <html lang="tr" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
