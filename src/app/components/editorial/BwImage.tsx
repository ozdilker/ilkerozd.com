import Image, { type ImageProps } from 'next/image';

type BwImageProps = ImageProps & { alt: string };

/**
 * next/image sarmalayıcı: içerik görsellerini siyah-beyaz (.bw) render eder.
 * fill veya width/height + sizes proplarının hepsini geçirir.
 */
export default function BwImage({ className, alt, ...props }: BwImageProps) {
  return <Image alt={alt} className={`bw ${className ?? ''}`} {...props} />;
}
