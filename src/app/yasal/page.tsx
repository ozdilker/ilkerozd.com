import type { Metadata } from 'next';
import PageShell from '../components/PageShell';
import styles from './page.module.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Yasal — Gizlilik Politikası ve Kullanım Şartları',
  description: 'Özet uygulaması gizlilik politikası ve kullanım şartları.',
};

const GUNCELLEME = '25 Ağustos 2026';

export default function YasalPage() {
  return (
    <PageShell>
      <div className={styles.wrap}>
        <header className={styles.masthead}>
          <h1 className={styles.pageTitle}>Yasal</h1>
          <span className={styles.updated}>Son güncelleme: {GUNCELLEME}</span>
        </header>

        <nav className={styles.tabs} aria-label="Belgeler">
          <a href="#gizlilik">Gizlilik Politikası</a>
          <a href="#kosullar">Kullanım Şartları</a>
        </nav>

        {/* ---------------- Gizlilik Politikası ---------------- */}
        <article id="gizlilik" className={styles.doc}>
          <p className={styles.eyebrow}>Yürürlük tarihi: {GUNCELLEME}</p>
          <h2 className={styles.docTitle}>Gizlilik Politikası</h2>
          <p className={styles.intro}>
            Özet, PDF belgelerini ve YouTube videolarını okunabilir notlara dönüştüren bir
            mobil uygulamadır. Bu sayfa, uygulamayı kullanırken hangi verilerin toplandığını,
            nasıl işlendiğini ve kiminle paylaşıldığını açıklar.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>1.</span>Topladığımız veriler
          </h3>
          <p>Hesap oluştururken ve uygulamayı kullanırken aşağıdaki verileri toplarız:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption>Veri kategorileri ve kaynakları</caption>
              <thead>
                <tr>
                  <th>Veri</th>
                  <th>Nereden gelir</th>
                  <th>Neden gerekli</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>E-posta adresi</td>
                  <td>Kayıt / giriş sırasında sen verirsin</td>
                  <td>Hesabını tanımlamak, giriş yapmanı sağlamak</td>
                </tr>
                <tr>
                  <td>Google hesap bilgisi (ad, e-posta)</td>
                  <td>“Google ile devam et” seçeneği</td>
                  <td>Şifresiz giriş alternatifi</td>
                </tr>
                <tr>
                  <td>Yüklediğin PDF / verdiğin video linki</td>
                  <td>“Yeni Özet” ekranında sen sağlarsın</td>
                  <td>Özeti üretebilmek</td>
                </tr>
                <tr>
                  <td>Oluşturulan özetler</td>
                  <td>Özetleme sonucunda üretilir</td>
                  <td>“Özetlerim” listende saklamak</td>
                </tr>
                <tr>
                  <td>Abonelik durumu</td>
                  <td>App Store / Google Play üzerinden</td>
                  <td>Özet Plus erişimini açmak</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Ödeme bilgisi toplamayız.</strong> Kart numaran hiçbir zaman Özet
            sunucularına ulaşmaz — abonelik ödemeleri tamamen Apple veya Google tarafından
            işlenir; biz yalnızca aboneliğin aktif olup olmadığı bilgisini alırız.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>2.</span>Verileri nasıl kullanırız
          </h3>
          <p>Topladığımız verileri şu amaçlarla kullanırız:</p>
          <ul>
            <li>Hesabına giriş yapmanı ve özetlerine erişmeni sağlamak</li>
            <li>Yüklediğin içeriği okuyup bir özet üretmek</li>
            <li>Ücretsiz plandaki günlük kullanım hakkını hesaplamak</li>
            <li>Abonelik durumuna göre Özet Plus özelliklerini açmak/kapatmak</li>
            <li>Teknik sorunları tespit edip düzeltmek</li>
          </ul>
          <p>
            İçeriğini reklam hedeflemek, üçüncü taraflara satmak veya senin dışındaki hiçbir
            kullanıcıyla paylaşmak için kullanmayız.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>3.</span>Üçüncü taraflarla paylaşım
          </h3>
          <p>
            Özeti üretebilmek için yüklediğin içeriğin (PDF metni veya video altyazısı) ilgili
            bölümü, o özetleme isteği süresince aşağıdaki alt işlemcilerden birine gönderilir:
          </p>
          <ul>
            <li>
              <strong>Ücretsiz planda:</strong> Groq (özetleme modeli sağlayıcısı)
            </li>
            <li>
              <strong>Özet Plus planında:</strong> Anthropic (Claude modeli sağlayıcısı)
            </li>
            <li>
              <strong>Supabase:</strong> hesap ve özet verilerinin saklandığı veritabanı altyapısı
            </li>
            <li>
              <strong>RevenueCat:</strong> abonelik durumunun App Store/Google Play ile eşitlenmesi
            </li>
          </ul>
          <p>
            Bu sağlayıcılar veriyi yalnızca Özet adına, hizmeti sağlamak için işler; kendi
            pazarlama amaçları için kullanmazlar. Yasal bir zorunluluk olmadıkça verini başka
            hiçbir üçüncü tarafla paylaşmayız.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>4.</span>Saklama ve silme
          </h3>
          <p>
            Hesabın açık olduğu sürece özetlerin saklanır. Hesabını silmek istersen aşağıdaki
            iletişim adresinden bize ulaşabilirsin; talebini aldıktan sonra makul bir süre
            içinde hesabını ve özetlerini kalıcı olarak sileriz.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>5.</span>Veri güvenliği
          </h3>
          <p>
            Verilerin, satır bazlı erişim kontrolü (RLS) uygulayan Supabase altyapısında
            saklanır — yalnızca sen kendi özetlerine erişebilirsin, başka bir kullanıcının
            hesabından senin verine ulaşılamaz. Tüm bağlantılar şifrelenmiş (HTTPS/TLS) olarak
            aktarılır.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>6.</span>Haklarınız
          </h3>
          <p>KVKK ve benzeri mevzuat kapsamında şu haklara sahipsin:</p>
          <ul>
            <li>Hangi verilerinin işlendiğini öğrenme</li>
            <li>Verilerinin bir kopyasını isteme</li>
            <li>Yanlış verinin düzeltilmesini isteme</li>
            <li>Hesabının ve verilerinin silinmesini isteme</li>
          </ul>
          <p>Bu haklarını kullanmak için aşağıdaki adresten bize ulaşabilirsin.</p>

          <h3 className={styles.h}>
            <span className={styles.num}>7.</span>Çocukların gizliliği
          </h3>
          <p>
            Özet, 13 yaşın altındaki çocuklardan bilerek veri toplamaz. Bir çocuğun bize veri
            sağladığını fark edersen lütfen bizimle iletişime geç; ilgili hesabı sileriz.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>8.</span>İletişim
          </h3>
          <div className={styles.contactCard}>
            <h4>Gizlilikle ilgili sorular için</h4>
            <dl>
              <div className={styles.contactRow}>
                <dt>E-posta</dt>
                <dd>gizlilik@ozet.app</dd>
              </div>
              <div className={styles.contactRow}>
                <dt>Yanıt süresi</dt>
                <dd>En geç 30 gün</dd>
              </div>
            </dl>
          </div>
        </article>

        {/* ---------------- Kullanım Şartları ---------------- */}
        <article id="kosullar" className={styles.doc}>
          <p className={styles.eyebrow}>Yürürlük tarihi: {GUNCELLEME}</p>
          <h2 className={styles.docTitle}>Kullanım Şartları</h2>
          <p className={styles.intro}>
            Bu şartlar, Özet mobil uygulamasını kullanırken sen ve biz arasındaki anlaşmayı
            tanımlar. Uygulamayı kullanarak bu şartları kabul etmiş olursun.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>1.</span>Hizmetin tanımı
          </h3>
          <p>
            Özet, yüklediğin PDF belgelerini ve verdiğin YouTube video linklerini yapay zeka
            yardımıyla okuyup düzenli notlara çeviren bir uygulamadır. Özetler otomatik olarak
            üretilir; doğruluğu kaynak içeriğe ve kullanılan modele bağlıdır, bu nedenle
            özetleri tek başına doğrulanmış bilgi kaynağı olarak kullanmamalısın.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>2.</span>Hesap sorumluluğu
          </h3>
          <ul>
            <li>Hesap bilgilerinin gizliliğinden sen sorumlusun.</li>
            <li>13 yaşından küçüklerin hesap açması gerekmez.</li>
            <li>Hesabınla yapılan tüm işlemlerden sen sorumlu tutulursun.</li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>3.</span>Kabul edilebilir kullanım
          </h3>
          <p>Özet’i kullanırken şunları yapmamayı kabul edersin:</p>
          <ul>
            <li>Telif hakkıyla korunan içeriği izinsiz yükleyip çoğaltmak</li>
            <li>Hizmeti başka birinin gizliliğini ihlal edecek şekilde kullanmak</li>
            <li>Sunuculara zarar verecek ya da aşırı yük bindirecek otomatik istekler göndermek</li>
            <li>Ücretsiz plan sınırlarını atlatmaya çalışmak</li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>4.</span>Abonelik ve ödemeler
          </h3>
          <p>
            Özet Plus, App Store veya Google Play üzerinden yönetilen bir otomatik yenilenen
            abonelik hizmetidir.
          </p>
          <ul>
            <li>Fiyatlar, satın alma ekranında mağaza tarafından gösterilir.</li>
            <li>Abonelik, iptal etmediğin sürece dönem sonunda otomatik yenilenir.</li>
            <li>İptal işlemini App Store / Google Play hesap ayarlarından yapabilirsin.</li>
            <li>Ücretsiz deneme süresi, süre bitmeden iptal edilmezse ücretli döneme döner.</li>
            <li>İadeler ilgili mağazanın (Apple / Google) politikasına tabidir.</li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>5.</span>Fikri mülkiyet
          </h3>
          <p>
            Yüklediğin içeriğin sahibi sensin; bize yalnızca özeti üretebilmek için gerekli,
            sınırlı bir işleme izni verirsin. Uygulamanın kendisi (tasarım, kod, marka) Özet’e
            aittir.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>6.</span>Sorumluluğun sınırlanması
          </h3>
          <p>
            Özet “olduğu gibi” sunulur. Yapay zeka tarafından üretilen özetlerdeki eksiklik veya
            hatalardan doğabilecek sonuçlardan, ilgili mevzuatın izin verdiği azami ölçüde
            sorumlu tutulamayız.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>7.</span>Fesih
          </h3>
          <p>
            Bu şartları ihlal ettiğini tespit edersek hesabını askıya alabilir veya
            kapatabiliriz. Sen de istediğin zaman Profil ekranından hesabını kapatmamızı
            isteyebilirsin.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>8.</span>Değişiklikler
          </h3>
          <p>
            Bu şartları zaman zaman güncelleyebiliriz. Önemli değişikliklerde seni uygulama
            içinden bilgilendiririz. Güncellemeden sonra uygulamayı kullanmaya devam etmen, yeni
            şartları kabul ettiğin anlamına gelir.
          </p>

          <div className={styles.contactCard}>
            <h4>Sorular için</h4>
            <dl>
              <div className={styles.contactRow}>
                <dt>E-posta</dt>
                <dd>destek@ozet.app</dd>
              </div>
            </dl>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
