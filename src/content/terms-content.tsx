import { Link } from "react-router-dom";
import { LegalSection } from "@/components/site/LegalLayout";
import { PAYMENTS_REFUNDS_FAQS, SITE } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

export function TermsContent() {
  return (
    <>
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing and using Peak services through our mobile application, website at{" "}
          {SITE.domain}, WhatsApp, iMessage, or any other platform, you agree to be bound by these
          Terms and Conditions. If you do not agree to these terms, please do not use our services.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of Services">
        <p>
          Peak provides AI-powered Vedic astrology services including but not limited to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Personalised daily muhurta (auspicious timing) recommendations</li>
          <li>Kundli (birth chart) based insights</li>
          <li>Goal tracking and pattern mapping aligned to your chart</li>
          <li>Astrological consultations via the app and messaging platforms</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. User Accounts and Registration">
        <p>
          To use our services, you must provide accurate birth details including date, time, and place
          of birth. You are responsible for maintaining the confidentiality of your account information
          and for all activities under your account.
        </p>
      </LegalSection>

      <LegalSection title="4. Subscription Plans and Payments">
        <p>
          Peak offers various subscription tiers with different features and pricing. By subscribing
          to a paid plan:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>You authorize us to charge the applicable fees to your chosen payment method</li>
          <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
          <li>Refunds are subject to our refund policy as outlined below</li>
          <li>Prices may change with 30 days prior notice</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Refund Policy">
        <p>
          We offer a 7-day money-back guarantee for new subscribers. Refund requests must be submitted
          within 7 days of the initial subscription. Partial refunds for unused portions of
          subscriptions are not available after this period.
        </p>
      </LegalSection>

      <LegalSection title="6. Payments and Refunds — FAQs">
        <div className="space-y-6">
          {PAYMENTS_REFUNDS_FAQS.map((faq) => (
            <div key={faq.question}>
              <p className="font-display text-lg text-ink">{faq.question}</p>
              <p className="mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="7. Messaging Services (WhatsApp/iMessage)">
        <p>By opting in to receive messages from Peak:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>You consent to receive service-related messages including daily recommendations</li>
          <li>Message frequency depends on your subscription tier</li>
          <li>Standard messaging rates may apply based on your carrier</li>
          <li>You can opt-out at any time by messaging &quot;STOP&quot;</li>
          <li>We will not share your phone number with third parties for marketing</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Disclaimer of Warranties">
        <p>
          Peak services are provided for informational and entertainment purposes only. Astrological
          guidance should not be considered as a substitute for professional advice in medical, legal,
          financial, or other matters. We make no guarantees about the accuracy of predictions or
          outcomes.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of Liability">
        <p>
          Peak and its founders shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of our services. Our total
          liability shall not exceed the amount paid by you for the services in the 12 months
          preceding the claim.
        </p>
      </LegalSection>

      <LegalSection title="10. Intellectual Property">
        <p>
          All content, algorithms, methodologies, and materials provided through Peak are proprietary
          and protected by intellectual property laws. You may not reproduce, distribute, or create
          derivative works without express written permission.
        </p>
      </LegalSection>

      <LegalSection title="11. Termination">
        <p>
          We reserve the right to suspend or terminate your access to our services at our discretion,
          including for violation of these terms. Upon termination, your right to use the services
          ceases immediately.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing Law">
        <p>
          These terms shall be governed by and construed in accordance with the laws of India. Any
          disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore,
          Karnataka.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to Terms">
        <p>
          We may update these terms from time to time. Continued use of our services after changes
          constitutes acceptance of the modified terms.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact Information">
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
