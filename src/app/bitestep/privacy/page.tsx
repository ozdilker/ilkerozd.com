import type { Metadata } from 'next';
import AppShell from '../../components/AppShell';
import styles from '../../yasal/page.module.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Bitestep — Privacy Policy',
  description:
    'Bitestep has no server and no accounts. Your tasks stay on your device and no personal data is collected.',
};

const UPDATED = 'November 28, 2026';

export default function BitestepPrivacyPage() {
  return (
    <AppShell
      appName="Bitestep"
      icon="/bitestep-icon.png"
      lang="en"
      footerLinks={[
        { href: '/bitestep', label: 'About Bitestep' },
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
            Bitestep is an iPhone app that breaks tasks into small steps. Bitestep does not collect
            any personal data. It has no server and no user accounts, and your tasks do not leave
            your device through the app.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>1.</span>What stays on your device
          </h3>
          <ul>
            <li>The tasks you type, their steps and time estimates.</li>
            <li>When you finished each step, used for your history and streak.</li>
            <li>Your preferences, such as the detail level you last chose.</li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>2.</span>How steps are created
          </h3>
          <p>
            On supported iPhones, steps are written by Apple&apos;s on-device language model. Your
            task text is processed on your device and is not sent to us or to anyone else. Where
            that model is not available, Bitestep uses ready-made plans built into the app.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>3.</span>Reminders and sharing
          </h3>
          <ul>
            <li>
              <strong>Daily reminder:</strong> if you turn it on, Bitestep schedules one
              notification a day on your iPhone. It is not sent from a server and does not contain
              your task names.
            </li>
            <li>
              <strong>Share card:</strong> the card goes only where you send it, and shows the task
              name only if you leave &quot;Show task name&quot; on. If you choose Save Image, iOS
              asks for permission to add it to your photos; Bitestep cannot see your photos.
            </li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>4.</span>Third parties
          </h3>
          <p>
            Bitestep contains no analytics, advertising, tracking or crash-reporting services and
            no third-party SDKs. The app makes no network requests of its own.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>5.</span>Features provided by Apple
          </h3>
          <ul>
            <li>
              <strong>Backups:</strong> if you back up your iPhone to iCloud or a computer, the
              backup may include the data Bitestep saved. Your Apple settings control this.
            </li>
            <li>
              <strong>Dictation:</strong> dictating with the keyboard is a feature of iOS, handled
              according to your device settings and Apple&apos;s privacy policy.
            </li>
            <li>
              <strong>Crash reports and TestFlight:</strong> if you choose to share analytics with
              developers, or test a beta version through TestFlight, Apple may send us crash
              reports and the feedback you submit.
            </li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>6.</span>Deleting your data
          </h3>
          <p>
            Deleting a task in the app removes its title and steps. A record that a step was
            finished (internal identifiers and the time, without any text) is kept on your device
            so your streak and weekly count stay correct. Deleting the app removes everything.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>7.</span>Children
          </h3>
          <p>Bitestep does not collect data from anyone, including children.</p>

          <h3 className={styles.h}>
            <span className={styles.num}>8.</span>Changes to this policy
          </h3>
          <p>
            If this policy changes, the date at the top of this page changes with it. Bitestep will
            not start collecting personal data without a clear update to this page and to the app.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>9.</span>Contact
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
