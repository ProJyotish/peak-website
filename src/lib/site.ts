const peakDomain = "peaklife.me";
const peakSupport = "support@peaklife.me";
const envDomain = (import.meta.env.VITE_SITE_DOMAIN as string | undefined)?.trim();
const supportEmail = peakSupport;

export const SITE = {
  name: "Peak",
  legalName: "Aryaman Knowledge Services Private Limited",
  domain: envDomain || peakDomain,
  peakDomain,
  peakUrl: `https://${peakDomain}`,
  app: "https://app.peaklife.me",
  contactEmail: supportEmail,
  supportEmail,
  deleteAccountMailto: `mailto:${supportEmail}?subject=Account%20deletion%20request`,
  address: "India",
  social: {
    linkedin: "https://www.linkedin.com/company/peaklife-me",
    instagram: "https://www.instagram.com/peaklife_me/",
  },
  stores: {
    android: "https://play.google.com/store/apps/details?id=me.peaklife",
    ios: null as string | null,
  },
} as const;

export const LEGAL_LAST_UPDATED = "January 9, 2026";

export const grievanceOfficer = {
  name: "Abhimanyu Singh Rana",
  email: supportEmail,
} as const;

export const PAYMENTS_REFUNDS_FAQS = [
  {
    question: "Only Rs 5 were deducted when I made the payment",
    answer:
      "As per UPI AutoPay standard procedure, Rs 5 is deducted to verify your payment method. Your chosen plan amount will be deducted automatically later at the selected billing frequency.",
  },
  {
    question: "How can I upgrade to Power User if I am on Premium?",
    answer:
      "You can upgrade anytime. Your old subscription will be cancelled, and any unused balance will be refunded.",
  },
  {
    question: "How can I cancel?",
    answer:
      "You can cancel your subscription directly from your UPI app or through your credit card provider. Cancellations will be effective from the next billing date and subscription will stay active until the end of the current billing period. You can also contact us at support@peaklife.me for assistance.",
  },
  {
    question: "Refund policy",
    answer:
      "We do not offer refunds once payment is made. We provide a free trial of 5 questions and 3 days of personalized reports so you can evaluate our service before subscribing.",
  },
] as const;
