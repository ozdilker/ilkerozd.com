import type { Metadata } from 'next';
import OzetShell from '../../components/OzetShell';
import styles from '../../yasal/page.module.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Legal — Privacy Policy and Terms of Use',
  description: 'Ozet app privacy policy and terms of use.',
};

const UPDATED = 'September 23, 2026';

export default function LegalPage() {
  return (
    <OzetShell
      lang="en"
      footerLinks={[
        { href: '#privacy', label: 'Privacy Policy' },
        { href: '#terms', label: 'Terms of Use' },
      ]}
    >
      <div className={styles.wrap}>
        <header className={styles.masthead}>
          <h1 className={styles.pageTitle}>Legal</h1>
          <span className={styles.updated}>Last updated: {UPDATED}</span>
        </header>

        <nav className={styles.tabs} aria-label="Documents">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
        </nav>

        {/* ---------------- Privacy Policy ---------------- */}
        <article id="privacy" className={styles.doc}>
          <p className={styles.eyebrow}>Effective date: {UPDATED}</p>
          <h2 className={styles.docTitle}>Privacy Policy</h2>
          <p className={styles.intro}>
            Ozet is a mobile app that turns PDF documents and YouTube videos into readable
            notes. This page explains what data we collect while you use the app, how it&apos;s
            processed, and who it&apos;s shared with.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>1.</span>Data we collect
          </h3>
          <p>When you create an account and use the app, we collect the following data:</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption>Data categories and sources</caption>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Where it comes from</th>
                  <th>Why it&apos;s needed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Email address</td>
                  <td>You provide it when signing up / signing in</td>
                  <td>To identify your account and let you sign in</td>
                </tr>
                <tr>
                  <td>Google account info (name, email)</td>
                  <td>The &quot;Continue with Google&quot; option</td>
                  <td>A password-free sign-in alternative</td>
                </tr>
                <tr>
                  <td>The PDF you upload / the video link you provide</td>
                  <td>You provide it on the &quot;New Summary&quot; screen</td>
                  <td>To generate the summary</td>
                </tr>
                <tr>
                  <td>Generated summaries</td>
                  <td>Produced as a result of summarization</td>
                  <td>To store them in your summary list</td>
                </tr>
                <tr>
                  <td>Subscription status</td>
                  <td>Via the App Store / Google Play</td>
                  <td>To unlock Ozet Plus access</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>We don&apos;t collect payment information.</strong> Your card number never
            reaches Ozet&apos;s servers — subscription payments are processed entirely by Apple
            or Google; we only receive information about whether the subscription is active.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>2.</span>How we use your data
          </h3>
          <p>We use the data we collect for the following purposes:</p>
          <ul>
            <li>Letting you sign in to your account and access your summaries</li>
            <li>Reading the content you upload to generate a summary</li>
            <li>Calculating your total summary allowance on the free plan</li>
            <li>Turning Ozet Plus features on or off based on your subscription status</li>
            <li>Detecting and fixing technical issues</li>
          </ul>
          <p>
            We don&apos;t use your content to target ads, sell it to third parties, or share it
            with any user other than you.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>3.</span>Sharing with third parties
          </h3>
          <p>
            To generate a summary, the relevant part of the content you upload (PDF text or
            video captions) is sent to one of the following subprocessors for the duration of
            that summarization request:
          </p>
          <ul>
            <li>
              <strong>On the free plan:</strong> Groq (summarization model provider)
            </li>
            <li>
              <strong>On the Ozet Plus plan:</strong> Anthropic (Claude model provider)
            </li>
            <li>
              <strong>Supabase:</strong> the database infrastructure where account and summary
              data is stored
            </li>
            <li>
              <strong>RevenueCat:</strong> syncing subscription status with the App Store /
              Google Play
            </li>
          </ul>
          <p>
            These providers process your data only on Ozet&apos;s behalf, to provide the
            service; they don&apos;t use it for their own marketing purposes. We don&apos;t
            share your data with any other third party unless legally required to.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>4.</span>Retention and deletion
          </h3>
          <p>
            Your summaries are stored for as long as your account is open. You can delete your
            account yourself at any time from within the app, using the &quot;Delete account&quot;
            option on the Profile screen — this permanently removes your account and all of your
            summaries. You can also reach us at the contact address below to request this
            instead.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>5.</span>Data security
          </h3>
          <p>
            Your data is stored on Supabase infrastructure with row-level access control (RLS)
            — only you can access your own summaries, and no other user&apos;s account can reach
            your data. All connections are transmitted encrypted (HTTPS/TLS).
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>6.</span>Your rights
          </h3>
          <p>
            Under applicable data protection law, including Türkiye&apos;s KVKK and, where it
            applies to you, the GDPR, you have the right to:
          </p>
          <ul>
            <li>Find out what data of yours is being processed</li>
            <li>Request a copy of your data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
          </ul>
          <p>To exercise these rights, you can reach us at the address below.</p>

          <h3 className={styles.h}>
            <span className={styles.num}>7.</span>Children&apos;s privacy
          </h3>
          <p>
            Ozet does not knowingly collect data from children under 13. If you notice that a
            child has provided us with data, please contact us and we will delete the relevant
            account.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>8.</span>Contact
          </h3>
          <div className={styles.contactCard}>
            <h4>For privacy questions</h4>
            <dl>
              <div className={styles.contactRow}>
                <dt>Email</dt>
                <dd>ozd.ilker@gmail.com</dd>
              </div>
              <div className={styles.contactRow}>
                <dt>Response time</dt>
                <dd>Within 30 days</dd>
              </div>
            </dl>
          </div>
        </article>

        {/* ---------------- Terms of Use ---------------- */}
        <article id="terms" className={styles.doc}>
          <p className={styles.eyebrow}>Effective date: {UPDATED}</p>
          <h2 className={styles.docTitle}>Terms of Use</h2>
          <p className={styles.intro}>
            These terms define the agreement between you and us while using the Ozet mobile
            app. By using the app, you accept these terms.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>1.</span>Description of the service
          </h3>
          <p>
            Ozet is an app that uses AI to read the PDF documents you upload and the YouTube
            video links you provide, turning them into tidy notes. Summaries are generated
            automatically; their accuracy depends on the source content and the model used, so
            you shouldn&apos;t treat summaries alone as a verified source of information.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>2.</span>Account responsibility
          </h3>
          <ul>
            <li>You&apos;re responsible for keeping your account information confidential.</li>
            <li>You must be 13 or older to create an account.</li>
            <li>You&apos;re held responsible for all activity carried out with your account.</li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>3.</span>Acceptable use
          </h3>
          <p>While using Ozet, you agree not to:</p>
          <ul>
            <li>Upload or reproduce copyrighted content without permission</li>
            <li>Use the service in a way that violates someone else&apos;s privacy</li>
            <li>Send automated requests that could harm or overload our servers</li>
            <li>Attempt to circumvent the free plan&apos;s limits</li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>4.</span>Subscriptions and payments
          </h3>
          <p>
            Ozet Plus is an auto-renewing subscription service managed through the App Store or
            Google Play.
          </p>
          <ul>
            <li>Prices are shown by the store on the purchase screen.</li>
            <li>Unless you cancel, the subscription renews automatically at the end of each period.</li>
            <li>You can cancel from your App Store / Google Play account settings.</li>
            <li>Refunds are subject to the relevant store&apos;s (Apple / Google) policy.</li>
          </ul>

          <h3 className={styles.h}>
            <span className={styles.num}>5.</span>Intellectual property
          </h3>
          <p>
            You own the content you upload; you only grant us a limited license to process it
            in order to generate the summary. The app itself (its design, code, and brand)
            belongs to Ozet.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>6.</span>Limitation of liability
          </h3>
          <p>
            Ozet is provided &quot;as is.&quot; To the maximum extent permitted by applicable
            law, we cannot be held liable for consequences arising from gaps or errors in
            AI-generated summaries.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>7.</span>Termination
          </h3>
          <p>
            If we determine that you&apos;ve violated these terms, we may suspend or close your
            account. You may also ask us to close your account at any time from the Profile
            screen.
          </p>

          <h3 className={styles.h}>
            <span className={styles.num}>8.</span>Changes
          </h3>
          <p>
            We may update these terms from time to time. We&apos;ll notify you in-app of any
            significant changes. Continuing to use the app after an update means you accept the
            new terms.
          </p>

          <div className={styles.contactCard}>
            <h4>Questions</h4>
            <dl>
              <div className={styles.contactRow}>
                <dt>Email</dt>
                <dd>ozd.ilker@gmail.com</dd>
              </div>
            </dl>
          </div>
        </article>
      </div>
    </OzetShell>
  );
}
