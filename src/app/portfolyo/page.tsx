import { getSettings, getPublishedProducts } from '@/lib/queries';
import Nav from '../components/Nav';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

export const dynamic = 'force-static';

export default function PortfolyoPage() {
  const settings = getSettings();
  const products = getPublishedProducts();

  return (
    <>
      <Nav isim={settings.isim} />
      <main>
        <ProductGrid products={products} />
      </main>
      <Footer isim={settings.isim} />
    </>
  );
}
