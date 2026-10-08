import React from "react";
import LegalLayout from "./LegalLayout";

const Cookies = () => (
  <LegalLayout
    title="Cookie Policy"
    subtitle="What cookies are and how we use them."
    lastUpdated="October 8, 2026"
  >
    <p>
      This Cookie Policy explains how <strong>Chronica</strong> uses cookies and similar
      technologies to recognize you when you visit our website.
    </p>

    <h2>1. What Are Cookies?</h2>
    <p>
      Cookies are small text files stored on your device by your browser. They help
      websites remember your preferences and improve your experience.
    </p>

    <h2>2. How We Use Cookies</h2>
    <ul>
      <li><strong>Essential cookies</strong> — required for login, security, and core features.</li>
      <li><strong>Preference cookies</strong> — remember your theme (light/dark), language, and settings.</li>
      <li><strong>Analytics cookies</strong> — help us understand how visitors use Chronica (e.g., page views, popular stories).</li>
      <li><strong>Performance cookies</strong> — improve load times and platform responsiveness.</li>
    </ul>

    <h2>3. Cookies We Use</h2>
    <ul>
      <li><strong>authToken</strong> — JWT token stored in localStorage (not a cookie, but similar) to keep you logged in.</li>
      <li><strong>theme</strong> — remembers whether you prefer light or dark mode.</li>
      <li><strong>hasSeenTutorial</strong> — remembers if you have completed the onboarding tour.</li>
      <li><strong>_ga / _gid</strong> — Google Analytics (if enabled) to measure traffic.</li>
    </ul>

    <h2>4. Managing Cookies</h2>
    <p>
      You can control or delete cookies through your browser settings. Note that
      disabling essential cookies may break parts of Chronica (like staying logged in).
    </p>
    <ul>
      <li><strong>Chrome:</strong> Settings → Privacy → Cookies and other site data.</li>
      <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data.</li>
      <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data.</li>
      <li><strong>Edge:</strong> Settings → Cookies and site permissions.</li>
    </ul>

    <h2>5. Third-Party Cookies</h2>
    <p>
      Some third-party services (Google Analytics, hosting providers) may set their own
      cookies. We do not control these cookies — please review their privacy policies.
    </p>

    <h2>6. Updates</h2>
    <p>
      We may update this Cookie Policy periodically. Any significant changes will be
      posted on this page.
    </p>

    <h2>7. Contact</h2>
    <p>
      For questions, email{" "}
      <a href="mailto:sadisheikh169@gmail.com">sadisheikh169@gmail.com</a>.
    </p>
  </LegalLayout>
);

export default Cookies;