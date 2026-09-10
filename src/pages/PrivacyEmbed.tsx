import { LegalContentLayout } from "@/components/site/LegalContentLayout";
import { PrivacyContent } from "@/content/privacy-content";
import { HoraryPrivacyContent } from "@/content/horary-privacy-content";
import { isHorarySite } from "@/lib/siteMode";

const PrivacyEmbed = () => (
  <LegalContentLayout>
    {isHorarySite ? <HoraryPrivacyContent /> : <PrivacyContent />}
  </LegalContentLayout>
);

export default PrivacyEmbed;
