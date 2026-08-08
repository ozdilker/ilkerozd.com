import styles from './Nav.module.css';

interface NavProps {
  isim: string;
}

const links = [
  { href: '/#hakkimda', label: 'Hakkımda' },
  { href: '/#portfolyo', label: 'Portfolyo' },
  { href: '/#galeri', label: 'Galeri' },
  { href: '/#iletisim', label: 'İletişim' },
];

export default function Nav({ isim }: NavProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.brand}>
          {isim}
        </a>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
