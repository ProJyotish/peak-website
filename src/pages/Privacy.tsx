import { LegalLayout } from "@/components/site/LegalLayout";
import { PrivacyContent } from "@/content/privacy-content";
import { HoraryPrivacyContent } from "@/content/horary-privacy-content";
import { isHorarySite } from "@/lib/siteMode";

const Privacy = () => (
  <LegalLayout title="Privacy Policy">
    {isHorarySite ? <HoraryPrivacyContent /> : <PrivacyContent />}
  </LegalLayout>
);

export default Privacy;
