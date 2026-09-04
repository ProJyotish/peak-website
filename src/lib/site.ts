import { isHorarySite } from "@/lib/siteMode";

const peakDomain = "peaklife.me";
const horaryDomainDefault = "peaklifehorary.me";
const peakSupport = "support@peaklife.me";
const horarySupport = "support@peaklifehorary.me";

const envDomain = (import.meta.env.VITE_SITE_DOMAIN as string | undefined)?.trim();
const supportEmail = isHorarySite ? horarySupport : peakSupport;

export const SITE = {
  name: isHorarySite ? "PeakLife Horary" : "Peak",
  legalName: "Aryaman Knowledge Services Private Limited",
  domain: envDomain || (isHorarySite ? horaryDomainDefault : peakDomain),
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
  horary: {
    stores: {
      android: "https://play.google.com/store/apps/details?id=me.peaklife.prashna",
      ios: null as string | null,
    },
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
      "We do not offer refunds once payment is made. We provide a free trial of 10 questions and 3 days of personalized reports so you can evaluate our service before subscribing.",
  },
] as const;

/** PeakLife Horary is pay-per-ask, not Peak subscriptions. */
export const HORARY_PAYMENTS_FAQS = [
  {
    question: "How much does each question cost?",
    answer:
      "Each PeakLife Horary ask costs ₹51. You top up your balance in the app before asking.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We do not offer refunds once payment is made for asks or top-ups. You can evaluate the product with the downloadable app experience before purchasing additional asks.",
  },
  {
    question: "Who do I contact about billing?",
    answer: `Email ${horarySupport} with your phone number and payment reference.`,
  },
] as const;
