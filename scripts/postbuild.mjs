import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");

// Copy index.html to 404.html for client-side routing fallback
copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));

const SITE = {
  domain: "peaklife.me",
  supportEmail: "support@peaklife.me",
  contactEmail: "support@peaklife.me",
  legalName: "Aryaman Knowledge Services Private Limited",
};

const grievanceOfficer = {
  name: "Abhimanyu Singh Rana",
  email: "support@peaklife.me",
};

const PAYMENTS_REFUNDS_FAQS = [
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
];

// Standalone static HTML pages for SEO
const pages = [
  {
    path: "terms/index.html",
    title: "Terms and Conditions - Peak",
    heading: "Terms and Conditions",
    lastUpdated: "January 9, 2026",
    content: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">1. Acceptance of Terms</h2>
        <p style="color: #525252; line-height: 1.75;">
          By accessing and using Peak services through our mobile application, website at ${SITE.domain}, 
          WhatsApp, iMessage, or any other platform, you agree to be bound by these Terms and Conditions. 
          If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">2. Description of Services</h2>
        <p style="color: #525252; line-height: 1.75; margin-bottom: 1rem;">
          Peak provides AI-powered Vedic astrology services including but not limited to:
        </p>
        <ul style="list-style-type: disc; padding-left: 1.5rem; color: #525252; line-height: 1.75;">
          <li style="margin-bottom: 0.5rem;">Personalised daily muhurta (auspicious timing) recommendations</li>
          <li style="margin-bottom: 0.5rem;">Kundli (birth chart) based insights</li>
          <li style="margin-bottom: 0.5rem;">Goal tracking and pattern mapping aligned to your chart</li>
          <li style="margin-bottom: 0.5rem;">Astrological consultations via the app and messaging platforms</li>
        </ul>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">3. User Accounts and Registration</h2>
        <p style="color: #525252; line-height: 1.75;">
          To use our services, you must provide accurate birth details including date, time, and place of birth. 
          You are responsible for maintaining the confidentiality of your account information and for all activities 
          under your account.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">4. Subscription Plans and Payments</h2>
        <p style="color: #525252; line-height: 1.75; margin-bottom: 1rem;">
          Peak offers various subscription tiers with different features and pricing. By subscribing to a paid plan:
        </p>
        <ul style="list-style-type: disc; padding-left: 1.5rem; color: #525252; line-height: 1.75;">
          <li style="margin-bottom: 0.5rem;">You authorize us to charge the applicable fees to your chosen payment method</li>
          <li style="margin-bottom: 0.5rem;">Subscriptions auto-renew unless cancelled before the renewal date</li>
          <li style="margin-bottom: 0.5rem;">Refunds are subject to our refund policy as outlined below</li>
          <li style="margin-bottom: 0.5rem;">Prices may change with 30 days prior notice</li>
        </ul>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">5. Refund Policy</h2>
        <p style="color: #525252; line-height: 1.75;">
          We offer a 7-day money-back guarantee for new subscribers. Refund requests must be submitted within 7 days 
          of the initial subscription. Partial refunds for unused portions of subscriptions are not available after 
          this period.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">6. Payments and Refunds — FAQs</h2>
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${PAYMENTS_REFUNDS_FAQS.map(
            (faq) => `
            <div>
              <p style="font-size: 1.125rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">${faq.question}</p>
              <p style="color: #525252; line-height: 1.75;">${faq.answer}</p>
            </div>
          `
          ).join("")}
        </div>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">7. Messaging Services (WhatsApp/iMessage)</h2>
        <p style="color: #525252; line-height: 1.75; margin-bottom: 1rem;">By opting in to receive messages from Peak:</p>
        <ul style="list-style-type: disc; padding-left: 1.5rem; color: #525252; line-height: 1.75;">
          <li style="margin-bottom: 0.5rem;">You consent to receive service-related messages including daily recommendations</li>
          <li style="margin-bottom: 0.5rem;">Message frequency depends on your subscription tier</li>
          <li style="margin-bottom: 0.5rem;">Standard messaging rates may apply based on your carrier</li>
          <li style="margin-bottom: 0.5rem;">You can opt-out at any time by messaging "STOP"</li>
          <li style="margin-bottom: 0.5rem;">We will not share your phone number with third parties for marketing</li>
        </ul>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">8. Disclaimer of Warranties</h2>
        <p style="color: #525252; line-height: 1.75;">
          Peak services are provided for informational and entertainment purposes only. Astrological guidance should 
          not be considered as a substitute for professional advice in medical, legal, financial, or other matters. 
          We make no guarantees about the accuracy of predictions or outcomes.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">9. Limitation of Liability</h2>
        <p style="color: #525252; line-height: 1.75;">
          Peak and its founders shall not be liable for any indirect, incidental, special, consequential, or punitive 
          damages arising from your use of our services. Our total liability shall not exceed the amount paid by you 
          for the services in the 12 months preceding the claim.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">10. Intellectual Property</h2>
        <p style="color: #525252; line-height: 1.75;">
          All content, algorithms, methodologies, and materials provided through Peak are proprietary and protected by 
          intellectual property laws. You may not reproduce, distribute, or create derivative works without express 
          written permission.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">11. Termination</h2>
        <p style="color: #525252; line-height: 1.75;">
          We reserve the right to suspend or terminate your access to our services at our discretion, including for 
          violation of these terms. Upon termination, your right to use the services ceases immediately.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">12. Governing Law</h2>
        <p style="color: #525252; line-height: 1.75;">
          These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be 
          subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">13. Changes to Terms</h2>
        <p style="color: #525252; line-height: 1.75;">
          We may update these terms from time to time. Continued use of our services after changes constitutes 
          acceptance of the modified terms.
        </p>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">14. Contact Information</h2>
        <p style="color: #525252; line-height: 1.75; margin-bottom: 0.5rem;">For questions about these Terms and Conditions, please contact us at:</p>
        <p style="color: #525252; line-height: 1.75; margin-bottom: 0.5rem;">
          Email: <a href="mailto:${SITE.supportEmail}" style="color: #2563eb;">${SITE.supportEmail}</a>
        </p>
        <p style="color: #525252; line-height: 1.75;">
          You may also use our <a href="/contact" style="color: #2563eb;">contact form</a>.
        </p>
      </section>
    `,
  },
  {
    path: "privacy-policy/index.html",
    title: "Privacy Policy - Peak",
    heading: "Privacy Policy",
    lastUpdated: "January 9, 2026",
    content: `
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Peak ("we," "our," or "us"), operated by ${SITE.legalName}, is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
          our AI-powered Vedic astrology services through our mobile application, WhatsApp, iMessage, or our website 
          at ${SITE.domain}.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        
        <h3 class="text-xl font-semibold mb-3 mt-6">2.1 Personal Information</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-3">We collect information you provide directly:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Full name</li>
          <li>Date, time, and place of birth</li>
          <li>Phone number (for app authentication and WhatsApp/iMessage services)</li>
          <li>Email address</li>
          <li>Payment information (processed securely by third-party payment processors)</li>
          <li>Questions and messages you send us</li>
        </ul>

        <h3 class="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Device information (type, operating system)</li>
          <li>IP address and approximate location</li>
          <li>Usage data and interaction patterns</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">We use your information to:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Generate personalised astrological readings and muhurta recommendations</li>
          <li>Provide daily time slot notifications via the app, WhatsApp, and iMessage</li>
          <li>Process payments and manage subscriptions</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Improve our AI models and service quality</li>
          <li>Send service-related communications</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">We do not sell your personal information. We may share your data with:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>Service Providers:</strong> Payment processors, cloud hosting providers, and messaging platforms (WhatsApp, Apple) necessary to deliver our services</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>With Your Consent:</strong> For any other purpose with your explicit permission</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. WhatsApp and iMessage Communications</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">When you use our services via WhatsApp or iMessage:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Your phone number is used solely to deliver our astrological services</li>
          <li>Message content is processed to provide personalised readings</li>
          <li>We retain conversation history to improve service quality</li>
          <li>You can request deletion of your message history at any time</li>
          <li>We comply with WhatsApp's Business Policy and Apple's guidelines</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Data Security</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">We implement industry-standard security measures including:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Encryption of data in transit and at rest</li>
          <li>Secure payment processing through PCI-DSS compliant providers</li>
          <li>Regular security audits and assessments</li>
          <li>Access controls and authentication measures</li>
          <li>Employee training on data protection</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">7. Data Retention</h2>
        <p class="text-gray-700 dark:text-gray-300">
          We retain your personal information for as long as your account is active or as needed to provide services. 
          After account deletion, we may retain certain data for up to 3 years for legal compliance and legitimate 
          business purposes.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">8. Your Rights and Choices</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">You have the right to:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
          <li><strong>Withdraw Consent:</strong> Revoke previously given consent</li>
        </ul>
        <p class="text-gray-700 dark:text-gray-300 mt-3">
          To exercise these rights, contact us at <a href="mailto:${SITE.supportEmail}" class="text-blue-600 hover:underline">${SITE.supportEmail}</a>.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">9. Cookies and Tracking</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">Our website uses cookies and similar technologies for:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Essential website functionality</li>
          <li>Analytics and performance monitoring</li>
          <li>Remembering your preferences</li>
        </ul>
        <p class="text-gray-700 dark:text-gray-300 mt-3">You can manage cookie preferences through your browser settings.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal 
          information from minors. If we become aware of such collection, we will promptly delete the data.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place 
          to protect your information in compliance with applicable data protection laws.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">12. Third-Party Links</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Our services may contain links to third-party websites. We are not responsible for the privacy practices of 
          these external sites. We encourage you to review their privacy policies.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">13. Changes to This Policy</h2>
        <p class="text-gray-700 dark:text-gray-300">
          We may update this Privacy Policy periodically. We will notify you of material changes via email or through 
          our services. The "Last updated" date at the top indicates the latest revision.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">14. Contact Us</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-2">
          Privacy questions: <a href="mailto:${SITE.contactEmail}" class="text-blue-600 hover:underline">${SITE.contactEmail}</a>.
        </p>
        <p class="text-gray-700 dark:text-gray-300">
          Account deletion requests: see our <a href="/delete-my-account" class="text-blue-600 hover:underline">account deletion page</a> 
          or email <a href="mailto:${SITE.contactEmail}?subject=Account%20deletion%20request" class="text-blue-600 hover:underline">${SITE.contactEmail}</a> 
          from your registered email address with the phone number linked to your Peak account.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">15. Grievance Officer</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">
          In accordance with Information Technology Act 2000 and rules made thereunder, the name and contact details 
          of the Grievance Officer are provided below:
        </p>
        <p class="text-gray-700 dark:text-gray-300"><strong>Name:</strong> ${grievanceOfficer.name}</p>
        <p class="text-gray-700 dark:text-gray-300">
          <strong>Email:</strong> <a href="mailto:${grievanceOfficer.email}" class="text-blue-600 hover:underline">${grievanceOfficer.email}</a>
        </p>
      </section>
    `,
  },
  {
    path: "delete-my-account/index.html",
    title: "Delete your account - Peak",
    heading: "Delete your account",
    lastUpdated: "January 9, 2026",
    content: `
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Request account deletion</h2>
        <p class="text-gray-700 dark:text-gray-300">
          You can ask us to delete your Peak account and the personal data associated with it. To submit a request, 
          email us at <a href="mailto:${SITE.supportEmail}?subject=Account%20deletion%20request" class="text-blue-600 hover:underline">${SITE.supportEmail}</a> 
          from the email address registered on your Peak account.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">What to include in your email</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-3">Please include the following so we can verify and process your request:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Subject line: "Account deletion request"</li>
          <li>The phone number linked to your Peak account</li>
          <li>Your full name as shown in the app (if applicable)</li>
          <li>A clear statement that you want your account and associated data deleted</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Processing time</h2>
        <p class="text-gray-700 dark:text-gray-300">
          We aim to complete verified account deletion requests within <strong>5 working days</strong> of receiving 
          your email. We may contact you if we need additional information to confirm your identity.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">What happens after deletion</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Once your request is processed, your account will be deactivated and we will delete or anonymise your 
          personal data in line with our <a href="/privacy-policy" class="text-blue-600 hover:underline">Privacy Policy</a>. 
          Some information may be retained where required by law or for legitimate business purposes (for example, 
          billing records).
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Questions</h2>
        <p class="text-gray-700 dark:text-gray-300">
          For help with your request, contact <a href="mailto:${SITE.supportEmail}" class="text-blue-600 hover:underline">${SITE.supportEmail}</a>.
        </p>
      </section>
    `,
  },
  {
    path: "contact/index.html",
    title: "Contact Us - Peak",
    heading: "Contact Us",
    lastUpdated: "January 9, 2026",
    content: `
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          We'd love to hear from you! Reach out to us for any questions, feedback, or support needs.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Email</h2>
        <p class="text-gray-700 dark:text-gray-300">
          <a href="mailto:${SITE.supportEmail}" class="text-blue-600 hover:underline text-lg">${SITE.supportEmail}</a>
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Support Hours</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Monday - Friday: 9:00 AM - 6:00 PM IST<br/>
          We typically respond within 24 hours.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Legal Information</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Company:</strong> ${SITE.legalName}
        </p>
        <p class="text-gray-700 dark:text-gray-300">
          <strong>Location:</strong> ${SITE.address}
        </p>
      </section>
    `,
  },
];

const htmlTemplate = (title, heading, content, lastUpdated) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${title.split(' - ')[0]} for Peak - AI-powered Vedic astrology">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1a1a1a;
    }
    
    h1, h2, h3 {
      font-weight: 600;
      color: #0a0a0a;
    }
    
    a {
      color: #2563eb;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    strong {
      font-weight: 600;
      color: #0a0a0a;
    }
    
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0a0a0a;
        color: #e5e5e5;
      }
      
      h1, h2, h3, strong {
        color: #ffffff;
      }
      
      a {
        color: #60a5fa;
      }
    }
  </style>
</head>
<body style="min-height: 100vh; background-color: #ffffff;">
  <div style="max-width: 48rem; margin: 0 auto; padding: 3rem 1rem;">
    <div style="margin-bottom: 2rem;">
      <a href="/" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #2563eb; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">
        ← Back to Home
      </a>
    </div>
    
    <header style="border-bottom: 1px solid #e5e5e5; padding-bottom: 2rem; margin-bottom: 3rem;">
      <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; margin-bottom: 1rem;">Legal</p>
      <h1 style="font-size: 2.25rem; line-height: 2.5rem; font-weight: 700; margin-bottom: 1rem;">${heading}</h1>
      <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #737373;">
        Last updated · ${lastUpdated}
      </p>
    </header>
    
    <article style="line-height: 1.75; color: #525252;">
      ${content}
    </article>

    <footer style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #e5e5e5;">
      <p style="font-size: 0.875rem; color: #737373;">
        © ${new Date().getFullYear()} Peak. All rights reserved.
      </p>
    </footer>
  </div>
</body>
</html>`;

for (const page of pages) {
  const filePath = resolve(dist, page.path);
  const dir = dirname(filePath);
  
  mkdirSync(dir, { recursive: true });
  
  const html = htmlTemplate(page.title, page.heading, page.content, page.lastUpdated);
  writeFileSync(filePath, html);
  console.log(`✓ Generated ${page.path}`);
}

console.log("\n✓ Static HTML pages generated successfully!");
