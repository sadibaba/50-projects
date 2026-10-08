import React from "react";
import LegalLayout from "./LegalLayout";

const DMCA = () => (
  <LegalLayout
    title="DMCA / Copyright Policy"
    subtitle="How to report copyright infringement."
    lastUpdated="October 8, 2026"
  >
    <p>
      Chronica respects the intellectual property rights of others. If you believe your
      copyrighted work has been used on our platform without authorization, you may
      submit a DMCA takedown notice.
    </p>

    <h2>1. Filing a DMCA Notice</h2>
    <p>
      Send a written notice to{" "}
      <a href="mailto:sadisheikh169@gmail.com">sadisheikh169@gmail.com</a> including:
    </p>
    <ul>
      <li>Your full name, address, phone, and email.</li>
      <li>A description of the copyrighted work you claim has been infringed.</li>
      <li>The exact URL(s) of the infringing material on Chronica.</li>
      <li>A statement that you have a good-faith belief the use is unauthorized.</li>
      <li>A statement, under penalty of perjury, that the information is accurate and you are the copyright owner or authorized to act on their behalf.</li>
      <li>Your physical or electronic signature.</li>
    </ul>

    <h2>2. Our Response</h2>
    <ul>
      <li>We will review your notice within 5 business days.</li>
      <li>If valid, we will remove or disable access to the infringing content.</li>
      <li>We will notify the user who posted the content.</li>
    </ul>

    <h2>3. Counter-Notice</h2>
    <p>
      If your content was removed and you believe it was a mistake, you may file a
      counter-notice with the same information requirements. We will forward it to the
      original complainant.
    </p>

    <h2>4. Repeat Infringers</h2>
    <p>
      Accounts that repeatedly post infringing content will be permanently terminated.
    </p>

    <h2>5. Contact</h2>
    <p>
      DMCA Agent: <a href="mailto:sadisheikh169@gmail.com">sadisheikh169@gmail.com</a>
    </p>
  </LegalLayout>
);

export default DMCA;