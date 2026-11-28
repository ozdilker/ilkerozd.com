import { NextResponse, type NextRequest } from 'next/server';

/**
 * Uygulama yasal sayfaları küçük harfle yayınlanır (/orbit/privacy). Biri
 * /Orbit/Privacy gibi büyük harfle yazarsa küçük harfli adrese yönlendirir.
 * Yeni bir uygulama eklendiğinde adını APP_PREFIXES'a eklemek yeterli.
 */
const APP_PREFIXES = ['/orbit', '/bitestep'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();
  if (pathname !== lower && APP_PREFIXES.some((p) => lower === p || lower.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/Orbit',
    '/Orbit/:path*',
    '/orbit/:path*',
    '/Bitestep',
    '/Bitestep/:path*',
    '/bitestep/:path*',
  ],
};
