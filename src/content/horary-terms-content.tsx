import { Link } from "react-router-dom";
import { LegalSection } from "@/components/site/LegalLayout";
import { HORARY_PAYMENTS_FAQS, SITE } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/** PeakLife Horary terms (peaklifehorary.me). Separate from Peak / peaklife.me. */
export function HoraryTermsContent() {
  return (
    <>
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing and using PeakLife Horary through our mobile application, website at{" "}
          {SITE.domain}, or any related platform, you agree to be bound by these Terms and
          Conditions. If you do not agree to these terms, please do not use our services.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of Services">
        <p>
          PeakLife Horary provides KP (Krishnamurti Paddhati) horary astrology services, including
          but not limited to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Question-based horary chart casting for the moment you ask</li>
          <li>Number-based (1-249) ascendant selection for KP Prashna</li>
          <li>Verdicts with plain-English reasoning</li>
          <li>In-app balance top-ups for pay-per-ask usage</li>
        </ul>
        <p className="mt-3">
          PeakLife Horary does not require a birth chart. Location at the time of asking is used to
          cast the horary chart.
        </p>
      </LegalSection>

      <LegalSection title="3. User Accounts and Registration">
        <p>
          To use PeakLife Horary, you sign in with a phone number and may be asked for location
          permission so a chart can be cast for where you are when you ask. You are responsible for
          maintaining the confidentiality of your account and for all activity under it.
        </p>
      </LegalSection>

      <LegalSection title="4. Payments">
        <p>
          PeakLife Horary is a pay-per-ask service. By purchasing asks or topping up your balance:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>You authorize us to charge the applicable fees to your chosen payment method</li>
          <li>Fees are for one-time asks or prepaid balance, not an ongoing Peak subscription</li>
          <li>Refunds are subject to our refund policy as outlined below</li>
          <li>Prices may change with prior notice in the app or on this website</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Refund Policy">
        <p>
          We do not offer refunds once payment is made for asks or top-ups, except where required by
          applicable law.
        </p>
      </LegalSection>

      <LegalSection title="6. Payments FAQs">
        <div className="space-y-6">
          {HORARY_PAYMENTS_FAQS.map((faq) => (
            <div key={faq.question}>
              <p className="font-display text-lg text-ink">{faq.question}</p>
              <p className="mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="7. Disclaimer of Warranties">
        <p>
          PeakLife Horary services are provided for informational and entertainment purposes only.
          Astrological guidance should not be considered a substitute for professional advice in
          medical, legal, financial, or other matters. We make no guarantees about the accuracy of
          predictions or outcomes.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          PeakLife Horary and its operators shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising from your use of our services. Our
          total liability shall not exceed the amount paid by you for PeakLife Horary services in
          the 12 months preceding the claim.
        </p>
      </LegalSection>

      <LegalSection title="9. Intellectual Property">
        <p>
          All content, algorithms, methodologies, and materials provided through PeakLife Horary are
          proprietary and protected by intellectual property laws. You may not reproduce,
          distribute, or create derivative works without express written permission.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          We reserve the right to suspend or terminate your access to PeakLife Horary at our
          discretion, including for violation of these terms. Upon termination, your right to use
          the services ceases immediately.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing Law">
        <p>
          These terms shall be governed by and construed in accordance with the laws of India. Any
          disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore,
          Karnataka.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to Terms">
        <p>
          We may update these terms from time to time. Continued use of PeakLife Horary after
          changes constitutes acceptance of the modified terms.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact Information">
        <p>For questions about these Terms and Conditions, please contact us at:</p>
        <p>
          Email:{" "}
          <a
            href={`mailto:${SITE.supportEmail}`}
            className="text-ink underline underline-offset-2"
          >
            {SITE.supportEmail}
          </a>
        </p>
        <p>
          You may also use our{" "}
          <Link to={ROUTES.contact} className="text-ink underline underline-offset-2">
            contact form
          </Link>
          .
        </p>
      </LegalSection>
    </>
  );
}
