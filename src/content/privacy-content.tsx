import { LegalSection, LegalSubsection } from "@/components/site/LegalLayout";
import { grievanceOfficer, SITE } from "@/lib/site";

export function PrivacyContent() {
  return (
    <>
      <LegalSection title="1. Introduction">
        <p>
          Peak (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operated by {SITE.legalName}, is
          committed to protecting your privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our AI-powered Vedic astrology
          services through our mobile application, WhatsApp, iMessage, or our website at{" "}
          {SITE.domain}.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <LegalSubsection title="2.1 Personal Information">
          <p>We collect information you provide directly:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Full name</li>
            <li>Date, time, and place of birth</li>
            <li>Phone number (for app authentication and WhatsApp/iMessage services)</li>
            <li>Email address</li>
            <li>Payment information (processed securely by third-party payment processors)</li>
            <li>Questions and messages you send us</li>
          </ul>
        </LegalSubsection>
        <LegalSubsection title="2.2 Automatically Collected Information">
          <ul className="list-disc pl-5 space-y-2">
            <li>Device information (type, operating system)</li>
            <li>IP address and approximate location</li>
            <li>Usage data and interaction patterns</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Generate personalised astrological readings and muhurta recommendations</li>
          <li>Provide daily time slot notifications via the app, WhatsApp, and iMessage</li>
          <li>Process payments and manage subscriptions</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Improve our AI models and service quality</li>
          <li>Send service-related communications</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data Sharing and Disclosure">
        <p>We do not sell your personal information. We may share your data with:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-ink">Service Providers:</strong> Payment processors, cloud
            hosting providers, and messaging platforms (WhatsApp, Apple) necessary to deliver our
            services
          </li>
          <li>
            <strong className="text-ink">Legal Requirements:</strong> When required by law, court
            order, or government request
          </li>
          <li>
            <strong className="text-ink">Business Transfers:</strong> In connection with a merger,
            acquisition, or sale of assets
          </li>
          <li>
            <strong className="text-ink">With Your Consent:</strong> For any other purpose with your
            explicit permission
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. WhatsApp and iMessage Communications">
        <p>When you use our services via WhatsApp or iMessage:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your phone number is used solely to deliver our astrological services</li>
          <li>Message content is processed to provide personalised readings</li>
          <li>We retain conversation history to improve service quality</li>
          <li>You can request deletion of your message history at any time</li>
          <li>We comply with WhatsApp&apos;s Business Policy and Apple&apos;s guidelines</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Data Security">
        <p>We implement industry-standard security measures including:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Encryption of data in transit and at rest</li>
          <li>Secure payment processing through PCI-DSS compliant providers</li>
          <li>Regular security audits and assessments</li>
          <li>Access controls and authentication measures</li>
          <li>Employee training on data protection</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Data Retention">
        <p>
          We retain your personal information for as long as your account is active or as needed to
          provide services. After account deletion, we may retain certain data for up to 3 years for
          legal compliance and legitimate business purposes.
        </p>
      </LegalSection>

      <LegalSection title="8. Your Rights and Choices">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-ink">Access:</strong> Request a copy of your personal data
          </li>
          <li>
            <strong className="text-ink">Correction:</strong> Update or correct inaccurate information
          </li>
          <li>
            <strong className="text-ink">Deletion:</strong> Request deletion of your personal data
          </li>
          <li>
            <strong className="text-ink">Opt-out:</strong> Unsubscribe from marketing communications
          </li>
          <li>
            <strong className="text-ink">Data Portability:</strong> Receive your data in a structured
            format
          </li>
          <li>
            <strong className="text-ink">Withdraw Consent:</strong> Revoke previously given consent
          </li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-ink underline underline-offset-2">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies and Tracking">
        <p>Our website uses cookies and similar technologies for:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Essential website functionality</li>
          <li>Analytics and performance monitoring</li>
          <li>Remembering your preferences</li>
        </ul>
        <p>You can manage cookie preferences through your browser settings.</p>
      </LegalSection>

      <LegalSection title="10. Children's Privacy">
        <p>
          Our services are not intended for individuals under 18 years of age. We do not knowingly
          collect personal information from minors. If we become aware of such collection, we will
          promptly delete the data.
        </p>
      </LegalSection>

      <LegalSection title="11. International Data Transfers">
        <p>
          Your data may be processed in countries other than your own. We ensure appropriate
          safeguards are in place to protect your information in compliance with applicable data
          protection laws.
        </p>
      </LegalSection>

      <LegalSection title="12. Third-Party Links">
        <p>
          Our services may contain links to third-party websites. We are not responsible for the
          privacy practices of these external sites. We encourage you to review their privacy
          policies.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. We will notify you of material changes via
          email or through our services. The &quot;Last updated&quot; date at the top indicates the
          latest revision.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact Us">
        <p>
          Privacy questions:{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-ink underline underline-offset-2">
            {SITE.contactEmail}
          </a>
          .
        </p>
        <p>
          Account deletion requests: email{" "}
          <a href={SITE.deleteAccountMailto} className="text-ink underline underline-offset-2">
            {SITE.contactEmail}
          </a>{" "}
          from your registered email address with the phone number linked to your Peak account.
        </p>
      </LegalSection>

      <LegalSection title="15. Grievance Officer">
        <p>
          In accordance with Information Technology Act 2000 and rules made thereunder, the name and
          contact details of the Grievance Officer are provided below:
        </p>
        <p>
          <strong className="text-ink">Name:</strong> {grievanceOfficer.name}
        </p>
        <p>
          <strong className="text-ink">Email:</strong>{" "}
          <a
            href={`mailto:${grievanceOfficer.email}`}
            className="text-ink underline underline-offset-2"
          >
            {grievanceOfficer.email}
          </a>
        </p>
      </LegalSection>
    </>
  );
}
