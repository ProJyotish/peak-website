import { LegalContentLayout } from "@/components/site/LegalContentLayout";
import { TermsContent } from "@/content/terms-content";
import { HoraryTermsContent } from "@/content/horary-terms-content";
import { isHorarySite } from "@/lib/siteMode";

const TermsEmbed = () => (
  <LegalContentLayout>
    {isHorarySite ? <HoraryTermsContent /> : <TermsContent />}
  </LegalContentLayout>
);

export default TermsEmbed;
