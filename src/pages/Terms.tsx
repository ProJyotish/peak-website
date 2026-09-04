import { LegalLayout } from "@/components/site/LegalLayout";
import { TermsContent } from "@/content/terms-content";
import { HoraryTermsContent } from "@/content/horary-terms-content";
import { isHorarySite } from "@/lib/siteMode";

const Terms = () => (
  <LegalLayout title="Terms and Conditions">
    {isHorarySite ? <HoraryTermsContent /> : <TermsContent />}
  </LegalLayout>
);

export default Terms;
