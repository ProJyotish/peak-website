import { LegalLayout } from "@/components/site/LegalLayout";
import { AccountDeletionContent } from "@/content/account-deletion-content";
import { HoraryAccountDeletionContent } from "@/content/horary-account-deletion-content";
import { isHorarySite } from "@/lib/siteMode";

const AccountDeletion = () => (
  <LegalLayout title="Delete your account">
    {isHorarySite ? <HoraryAccountDeletionContent /> : <AccountDeletionContent />}
  </LegalLayout>
);

export default AccountDeletion;
