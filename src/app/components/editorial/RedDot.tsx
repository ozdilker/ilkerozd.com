import styles from './RedDot.module.css';

interface RedDotProps {
  size?: number;
  className?: string;
}

/** Kırmızı daire motifi. */
export default function RedDot({ size = 56, className }: RedDotProps) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.dot} ${className ?? ''}`}
      style={{ width: size, height: size }}
    />
  );
}
