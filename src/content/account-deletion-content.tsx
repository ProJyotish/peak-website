import { Link } from "react-router-dom";
import { LegalSection } from "@/components/site/LegalLayout";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

export function AccountDeletionContent() {
  return (
    <>
      <LegalSection title="Request account deletion">
        <p>
          You can ask us to delete your Peak account and the personal data associated with it. To
          submit a request, email us at{" "}
          <a
            href={`mailto:${SITE.supportEmail}?subject=Account%20deletion%20request`}
            className="text-ink underline underline-offset-2"
          >
            {SITE.supportEmail}
          </a>{" "}
          from the email address registered on your Peak account.
        </p>
      </LegalSection>

      <LegalSection title="What to include in your email">
        <p>Please include the following so we can verify and process your request:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Subject line: &quot;Account deletion request&quot;</li>
          <li>The phone number linked to your Peak account</li>
          <li>Your full name as shown in the app (if applicable)</li>
          <li>A clear statement that you want your account and associated data deleted</li>
        </ul>
      </LegalSection>

      <LegalSection title="Processing time">
        <p>
          We aim to complete verified account deletion requests within{" "}
          <strong className="text-ink">5 working days</strong> of receiving your email. We may
          contact you if we need additional information to confirm your identity.
        </p>
      </LegalSection>

      <LegalSection title="What happens after deletion">
        <p>
          Once your request is processed, your account will be deactivated and we will delete or
          anonymise your personal data in line with our{" "}
          <Link to={ROUTES.privacy} className="text-ink underline underline-offset-2">
            Privacy Policy
          </Link>
          . Some information may be retained where required by law or for legitimate business
          purposes (for example, billing records).
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          For help with your request, contact{" "}
          <a
            href={`mailto:${SITE.supportEmail}`}
            className="text-ink underline underline-offset-2"
          >
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>
    </>
  );
}
