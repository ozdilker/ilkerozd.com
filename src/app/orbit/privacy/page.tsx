import type { Metadata } from 'next';
import AppShell from '../../components/AppShell';
import styles from '../../yasal/page.module.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Orbit — Privacy Policy',
  description:
    'Orbit is an offline shift-schedule app. It has no server and no accounts, and collects no personal data.',
};

const UPDATED = 'October 24, 2026';

export default function OrbitPrivacyPage() {
  return (
    <AppShell
      appName="Orbit"
      icon="/orbit-icon.png"
      lang="en"
      footerLinks={[
        { href: '/portfolyo/orbit', label: 'About Orbit' },
        { href: 'mailto:ozd.ilker@gmail.com', label: 'Contact' },
      ]}
    >
      <div className={styles.wrap}>
        <header className={styles.masthead}>
          <h1 className={styles.pageTitle}>Privacy</h1>
          <span className={styles.updated}>Last updated: {UPDATED}</span>
        </header>

        <article className={styles.doc}>
          <p className={styles.eyebrow}>Effective date: {UPDATED}</p>
          <h2 className={styles.docTitle}>Privacy Policy</h2>
          <p className={styles.intro}>
            Orbit is a shift-schedule calendar for iPhone and its widgets. Orbit does not collect,
            transmit or store any personal data on any server, because Orbit has no server and no
            user accounts.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>1.</span>What stays on your device
          </h3>
          <ul>
            <li>
              Your shift patterns, shift types, hand-edited days, pay-rate settings and preferences
              (such as week start and appearance) are stored only on your device, in the app&apos;s
              on-device database that Orbit&apos;s own widgets also read.
            </li>
            <li>
              Backups and exports (JSON, CSV, .ics) are files you create and save wherever you
              choose. Orbit never uploads them.
            </li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>2.</span>Permissions
          </h3>
          <ul>
            <li>
              <strong>Calendar (optional, write-only):</strong> if you turn on calendar sync, Orbit
              creates a calendar named &ldquo;Orbit&rdquo; and writes your shifts to it. Orbit never
              reads your existing calendars or events.
            </li>
            <li>
              <strong>Notifications (optional):</strong> shift reminders are scheduled locally on
              your device.
            </li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>3.</span>Third parties
          </h3>
          <p>
            Orbit contains no analytics, advertising, tracking or crash-reporting services and no
            third-party SDKs. The only network connection Orbit makes is to Apple&apos;s App Store
            (StoreKit) to process Orbit Plus subscriptions. Payments are handled entirely by Apple;
            Orbit never sees your payment details. Subscriptions are governed by Apple&apos;s{' '}
            <a
              href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
              target="_blank"
              rel="noopener noreferrer"
            >
              standard Licensed Application End User License Agreement
            </a>
            .
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>4.</span>Children
          </h3>
          <p>Orbit does not collect data from anyone, including children.</p>

          <h3 className={styles.h}>
            <span className={styles.num}>5.</span>Deleting your data
          </h3>
          <p>
            Because all data lives on your device, deleting the app removes it. Removing the
            &ldquo;Orbit&rdquo; calendar from Apple Calendar removes synced events.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>6.</span>Changes to this policy
          </h3>
          <p>
            If this policy changes, the date at the top of this page changes with it. Orbit will
            not start collecting personal data without a clear update to this page and to the app.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>7.</span>Contact
          </h3>
          <div className={styles.contactCard}>
            <h4>For privacy questions</h4>
            <dl>
              <div className={styles.contactRow}>
                <dt>Email</dt>
                <dd>ozd.ilker@gmail.com</dd>
              </div>
            </dl>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
