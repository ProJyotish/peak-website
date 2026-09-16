import { LegalLayout } from "@/components/site/LegalLayout";
import { AccountDeletionContent } from "@/content/account-deletion-content";

const AccountDeletion = () => (
  <LegalLayout title="Delete your account" description="How to delete your Peak account">
    <AccountDeletionContent />
  </LegalLayout>
);

export default AccountDeletion;
