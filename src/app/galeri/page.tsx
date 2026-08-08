import { getSettings, getGallery } from '@/lib/queries';
import Nav from '../components/Nav';
import Lightbox from '../components/Lightbox';
import Footer from '../components/Footer';

export const dynamic = 'force-static';

export default function GaleriPage() {
  const settings = getSettings();
  const gallery = getGallery();

  return (
    <>
      <Nav isim={settings.isim} />
      <main>
        <Lightbox items={gallery} />
      </main>
      <Footer isim={settings.isim} />
    </>
  );
}
