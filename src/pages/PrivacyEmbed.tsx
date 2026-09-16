import { LegalContentLayout } from "@/components/site/LegalContentLayout";
import { PrivacyContent } from "@/content/privacy-content";
import { ROUTES } from "@/lib/routes";

const PrivacyEmbed = () => (
  <LegalContentLayout
    title="Privacy Policy - Peak"
    description="Privacy Policy for Peak - AI-powered Vedic astrology"
    path={ROUTES.privacyEmbed}
  >
    <PrivacyContent />
  </LegalContentLayout>
);

export default PrivacyEmbed;
