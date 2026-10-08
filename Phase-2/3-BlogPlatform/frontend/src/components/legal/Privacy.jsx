import React from "react";
import LegalLayout from "./LegalLayout";

const Privacy = () => (
  <LegalLayout
    title="Privacy Policy"
    subtitle="How we collect, use, and protect your information."
    lastUpdated="October 8, 2026"
  >
    <p>
      At <strong>Chronica</strong>, your privacy matters. This policy explains what data we
      collect, why we collect it, and how we protect it.
    </p>

    <h2>1. Information We Collect</h2>
    <h3>a) Information you provide</h3>
    <ul>
      <li><strong>Account data:</strong> name, email address, password (encrypted).</li>
      <li><strong>Profile data:</strong> bio, avatar image, optionally role.</li>
      <li><strong>Comments:</strong> any text you submit on stories.</li>
    </ul>

    <h3>b) Information collected automatically</h3>
    <ul>
      <li><strong>Log data:</strong> IP address, browser type, device info, timestamps.</li>
      <li><strong>Usage data:</strong> pages viewed, stories read, likes, session duration.</li>
      <li><strong>Cookies & similar technologies:</strong> see our <a href="/cookies">Cookie Policy</a>.</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>To create and manage your account.</li>
      <li>To authenticate your login and secure the platform.</li>
      <li>To display your comments, avatar, and profile info.</li>
      <li>To improve our content, UX, and features.</li>
      <li>To send transactional emails (e.g., password reset).</li>
      <li>To prevent fraud, abuse, and security threats.</li>
      <li>To comply with legal obligations.</li>
    </ul>

    <h2>3. Legal Basis (GDPR)</h2>
    <p>If you are in the EEA, we process your data based on:</p>
    <ul>
      <li><strong>Consent</strong> — you agree to our processing when creating an account.</li>
      <li><strong>Contract</strong> — to provide the service you signed up for.</li>
      <li><strong>Legitimate interests</strong> — security, fraud prevention, analytics.</li>
      <li><strong>Legal obligation</strong> — when required by law.</li>
    </ul>

    <h2>4. Sharing Your Information</h2>
    <p>We do <strong>not</strong> sell your personal data. We may share it with:</p>
    <ul>
      <li><strong>Service providers</strong> — hosting, database, email (all under strict data-processing agreements).</li>
      <li><strong>Legal authorities</strong> — when required by law or to protect rights and safety.</li>
      <li><strong>Successors</strong> — in case of merger, acquisition, or asset sale.</li>
    </ul>

    <h2>5. Data Retention</h2>
    <p>
      We retain your account data as long as your account is active. After deletion, we
      may retain certain data for up to 90 days for backup, legal, or security purposes.
    </p>

    <h2>6. Your Rights</h2>
    <p>Depending on your location, you may have the right to:</p>
    <ul>
      <li>Access, correct, or delete your personal data.</li>
      <li>Object to or restrict certain processing.</li>
      <li>Request data portability.</li>
      <li>Withdraw consent at any time.</li>
      <li>Lodge a complaint with a supervisory authority.</li>
    </ul>
    <p>
      To exercise these rights, email{" "}
      <a href="mailto:sadisheikh169@gmail.com">sadisheikh169@gmail.com</a>.
    </p>

    <h2>7. Children's Privacy</h2>
    <p>
      Chronica is not intended for children under 13. We do not knowingly collect data
      from children under 13. If you believe we have, contact us immediately.
    </p>

    <h2>8. Security</h2>
    <p>
      We use industry-standard security measures: HTTPS encryption, hashed passwords
      (bcrypt), JWT authentication, rate limiting, input sanitization, and security
      headers (Helmet). No system is 100% secure, but we take this seriously.
    </p>

    <h2>9. International Transfers</h2>
    <p>
      Your data may be stored and processed in countries outside your own. We take
      reasonable steps to ensure your data receives adequate protection.
    </p>

    <h2>10. Changes to This Policy</h2>
    <p>
      We may update this Privacy Policy. Material changes will be notified via email or
      a prominent notice on the platform.
    </p>

    <h2>11. Contact</h2>
    <p>
      Questions? Email{" "}
      <a href="mailto:sadisheikh169@gmail.com">sadisheikh169@gmail.com</a>.
    </p>
  </LegalLayout>
);

export default Privacy;