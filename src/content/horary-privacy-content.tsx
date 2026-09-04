import { Link } from "react-router-dom";
import { LegalSection, LegalSubsection } from "@/components/site/LegalLayout";
import { grievanceOfficer, SITE } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/** PeakLife Horary privacy policy (peaklifehorary.me). Separate from Peak / peaklife.me. */
export function HoraryPrivacyContent() {
  return (
    <>
      <LegalSection title="1. Introduction">
        <p>
          PeakLife Horary (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operated by{" "}
          {SITE.legalName}, is committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you use PeakLife Horary
          through our mobile application or website at {SITE.domain}.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <LegalSubsection title="2.1 Personal Information">
          <p>We collect information you provide directly:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Phone number (for authentication)</li>
            <li>Questions you ask and numbers you select for horary casting</li>
            <li>Approximate location when you ask (to cast a horary chart for that place and time)</li>
            <li>Email address, if you contact support</li>
            <li>Payment information (processed securely by third-party payment processors)</li>
          </ul>
          <p className="mt-3">
            PeakLife Horary does not require birth chart details (date, time, or place of birth) to
            answer a question.
          </p>
        </LegalSubsection>
        <LegalSubsection title="2.2 Automatically Collected Information">
          <ul className="list-disc pl-5 space-y-2">
            <li>Device information (type, operating system)</li>
            <li>IP address and approximate location</li>
            <li>Usage data and interaction patterns</li>
            <li>Cookies and similar tracking technologies on our website</li>
          </ul>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cast horary charts and deliver verdicts for your questions</li>
          <li>Process payments and manage your ask balance</li>
          <li>Respond to support inquiries</li>
          <li>Improve product quality and reliability</li>
          <li>Send service-related communications</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data Sharing and Disclosure">
        <p>We do not sell your personal information. We may share data with:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Service Providers:</strong> payment processors, cloud hosting, and analytics
            needed to operate PeakLife Horary
          </li>
          <li>
            <strong>Legal Requirements:</strong> when required by law, court order, or government
            request
          </li>
          <li>
            <strong>Business Transfers:</strong> in connection with a merger, acquisition, or sale
            of assets
          </li>
          <li>
            <strong>With Your Consent:</strong> for any other purpose with your explicit permission
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>We implement industry-standard security measures including:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Encryption of data in transit and at rest where applicable</li>
          <li>Secure payment processing through PCI-DSS compliant providers</li>
          <li>Access controls and authentication measures</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We retain your personal information for as long as your account is active or as needed to
          provide services. After account deletion, we may retain certain data for up to 3 years for
          legal compliance and legitimate business purposes.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights and Choices">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Access:</strong> request a copy of your personal data
          </li>
          <li>
            <strong>Correction:</strong> update or correct inaccurate information
          </li>
          <li>
            <strong>Deletion:</strong> request deletion of your personal data
          </li>
          <li>
            <strong>Withdraw Consent:</strong> revoke previously given consent where applicable
          </li>
        </ul>
        <p className="mt-3">
          To exercise these rights, contact us at{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-ink underline underline-offset-2">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies and Tracking">
        <p>Our website may use cookies and similar technologies for:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Essential website functionality</li>
          <li>Analytics and performance monitoring</li>
        </ul>
        <p className="mt-3">You can manage cookie preferences through your browser settings.</p>
      </LegalSection>

      <LegalSection title="9. Children&apos;s Privacy">
        <p>
          PeakLife Horary is not intended for individuals under 18 years of age. We do not knowingly
          collect personal information from minors. If we become aware of such collection, we will
          promptly delete the data.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. The &quot;Last updated&quot; date at the
          top indicates the latest revision. Continued use after changes constitutes acceptance of
          the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          Privacy questions:{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-ink underline underline-offset-2">
            {SITE.contactEmail}
          </a>
          .
        </p>
        <p>
          Account deletion requests: see our{" "}
          <Link to={ROUTES.accountDeletion} className="text-ink underline underline-offset-2">
            account deletion page
          </Link>{" "}
          or email{" "}
          <a
            href={SITE.deleteAccountMailto}
            className="text-ink underline underline-offset-2"
          >
            {SITE.contactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="12. Grievance Officer">
        <p>
          In accordance with the Information Technology Act 2000 and rules made thereunder, the name
          and contact details of the Grievance Officer are:
        </p>
        <p>
          <strong>Name:</strong> {grievanceOfficer.name}
        </p>
        <p>
          <strong>Email:</strong>{" "}
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
