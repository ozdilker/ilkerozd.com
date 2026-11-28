import type { Metadata } from 'next';
import AppShell from '../components/AppShell';
import styles from '../yasal/page.module.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Bitestep — Tiny Task Planner',
  description:
    'Bitestep breaks a big or vague task into small steps you can do in a few minutes. It runs on your iPhone, with no account and no server.',
};

export default function BitestepPage() {
  return (
    <AppShell
      appName="Bitestep"
      icon="/bitestep-icon.png"
      lang="en"
      footerLinks={[
        { href: '/bitestep/privacy', label: 'Privacy Policy' },
        { href: 'mailto:ozd.ilker@gmail.com', label: 'Support' },
      ]}
    >
      <div className={styles.wrap}>
        <header className={styles.masthead}>
          <h1 className={styles.pageTitle}>Bitestep</h1>
          <span className={styles.updated}>Coming soon for iPhone</span>
        </header>

        <article className={styles.doc}>
          <p className={styles.eyebrow}>Tiny Task Planner</p>
          <h2 className={styles.docTitle}>One small step at a time</h2>
          <p className={styles.intro}>
            Type a task that feels too big, such as homework, a move, tax paperwork or a messy room.
            Bitestep turns it into small steps of a few minutes each and shows you only the one to
            do now.
          </p>

          <h3 className={styles.h}>How it works</h3>
          <ul>
            <li>Type your task, or use your keyboard&apos;s dictation.</li>
            <li>Choose how detailed the plan should be: short, medium or detailed.</li>
            <li>Work through one step at a time. If a step still feels big, make it smaller.</li>
            <li>See what you have finished in History.</li>
          </ul>

          <h3 className={styles.h}>Private by design</h3>
          <p>
            Bitestep has no account, no server, no ads and no analytics. Your tasks stay on your
            iPhone. Read the <a href="/bitestep/privacy">Privacy Policy</a>.
          </p>

          <h3 className={styles.h}>Requirements</h3>
          <p>
            iPhone with iOS 18 or later. Plans written by on-device AI need iOS 26 or later and an
            iPhone with Apple Intelligence turned on, in a language it supports. Without it,
            Bitestep offers ready-made plans and lets you write your own steps.
          </p>

          <h3 className={styles.h}>Questions</h3>
          <p>
            <strong>Why do I see ready-made plans instead of AI steps?</strong> Apple Intelligence
            may be turned off, still downloading, or not available for your iPhone or language. You
            can check it in Settings under Apple Intelligence.
          </p>
          <p>
            <strong>How do I remove my data?</strong> You can delete any task in the app. Deleting
            the app removes everything it saved on your iPhone.
          </p>

          <h3 className={styles.h}>Support</h3>
          <div className={styles.contactCard}>
            <h4>Questions, bugs or ideas</h4>
            <dl>
              <div className={styles.contactRow}>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:ozd.ilker@gmail.com">ozd.ilker@gmail.com</a>
                </dd>
              </div>
            </dl>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
