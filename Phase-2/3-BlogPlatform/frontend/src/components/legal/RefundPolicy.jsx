import React from "react";
import LegalLayout from "./LegalLayout";

const RefundPolicy = () => (
  <LegalLayout
    title="Refund Policy"
    subtitle="Our policy on refunds and cancellations."
    lastUpdated="October 8, 2026"
  >
    <p>
      Currently, <strong>Chronica is free to use</strong>. We do not charge for reading
      stories, liking, or commenting.
    </p>

    <h2>1. Free Services</h2>
    <p>
      No payment is required to access any feature on Chronica. Therefore, no refunds
      apply.
    </p>

    <h2>2. Future Paid Features</h2>
    <p>
      If we introduce paid features (e.g., premium stories, ad-free browsing), the
      following will apply:
    </p>
    <ul>
      <li>7-day refund window for first-time purchases.</li>
      <li>No refunds after 7 days or for partial months.</li>
      <li>Subscriptions can be cancelled anytime; access remains until the end of the billing cycle.</li>
    </ul>

    <h2>3. How to Request a Refund</h2>
    <p>
      Email{" "}
      <a href="mailto:sadisheikh169@gmail.com">sadisheikh169@gmail.com</a> with your
      account email and reason. We respond within 5 business days.
    </p>
  </LegalLayout>
);

export default RefundPolicy;