import { LegalContentLayout } from "@/components/site/LegalContentLayout";
import { TermsContent } from "@/content/terms-content";
import { ROUTES } from "@/lib/routes";

const TermsEmbed = () => (
  <LegalContentLayout
    title="Terms and Conditions - Peak"
    description="Terms and Conditions for Peak - AI-powered Vedic astrology"
    path={ROUTES.termsEmbed}
  >
    <TermsContent />
  </LegalContentLayout>
);

export default TermsEmbed;
