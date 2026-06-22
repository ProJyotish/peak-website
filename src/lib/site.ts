export const SITE = {
  name: "Peak",
  legalName: "Aryaman Knowledge Services Private Limited",
  domain: "peaklife.me",
  contactEmail: "support@peaklife.me",
  supportEmail: "support@peaklife.me",
  deleteAccountMailto:
    "mailto:support@peaklife.me?subject=Account%20deletion%20request",
  address: "India",
  social: {
    linkedin: "https://www.linkedin.com/in/nishant-kyal",
    instagram: "https://www.instagram.com/peaklife.me",
    x: "https://x.com/peaklife_me",
  },
} as const;

export const LEGAL_LAST_UPDATED = "January 9, 2026";

export const grievanceOfficer = {
  name: "Abhimanyu Singh Rana",
  email: "support@peaklife.me",
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
