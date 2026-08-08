import { Archivo } from 'next/font/google';

// Fontlar build anında self-host edilir; runtime'da dış istek yoktur.
// latin-ext, Türkçe karakterler (İ, ş, ğ, ç, ö, ü) için gereklidir.
// Archivo, SIL Open Font License ile lisanslıdır.

export const bodyFont = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const displayFont = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: ['800', '900'],
  variable: '--font-display',
  display: 'swap',
});
