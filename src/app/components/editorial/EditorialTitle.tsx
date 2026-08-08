import styles from './EditorialTitle.module.css';

type Level = 'h1' | 'h2';

interface EditorialTitleProps {
  children: React.ReactNode;
  as?: Level;
  className?: string;
}

/** İri, kalın, kırmızı editoryal başlık. */
export default function EditorialTitle({ children, as = 'h2', className }: EditorialTitleProps) {
  const Tag = as;
  return <Tag className={`${styles.title} ${className ?? ''}`}>{children}</Tag>;
}
