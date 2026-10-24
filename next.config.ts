import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  // Uygulama ana sayfası portfolyodaki proje sayfasına gider. Not: Next.js
  // yönlendirme kaynaklarını büyük/küçük harfe duyarsız eşler (/Orbit de buraya
  // düşer); bu yüzden /orbit/privacy için büyük harfli varyant YAZILMAZ —
  // kendi kendine yönlenip döngüye girer. Büyük harfli URL'ler middleware ile
  // küçültülür.
  async redirects() {
    return [
      { source: '/orbit', destination: '/portfolyo/orbit', permanent: true },
    ];
  },
};

export default nextConfig;
