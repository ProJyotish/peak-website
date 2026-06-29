import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");

// Copy index.html to 404.html for client-side routing fallback
copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));

// Standalone static HTML pages for SEO
const pages = [
  {
    path: "terms/index.html",
    title: "Terms of Service - Peak",
    heading: "Terms and Conditions",
    content: `
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p class="text-gray-700 dark:text-gray-300">
          By accessing and using Peak services through our mobile application, website at peaklife.me, 
          WhatsApp, iMessage, or any other platform, you agree to be bound by these Terms and Conditions. 
          If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. Description of Services</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Peak provides AI-powered Vedic astrology services including but not limited to:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Personalised daily muhurta (auspicious timing) recommendations</li>
          <li>Kundli (birth chart) based insights</li>
          <li>Goal tracking and pattern mapping aligned to your chart</li>
          <li>Astrological consultations via the app and messaging platforms</li>
          <li>Karmic analysis and guidance</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
        <p class="text-gray-700 dark:text-gray-300">
          To use our services, you must provide accurate birth details including date, time, and place of birth. 
          You are responsible for maintaining the confidentiality of your account information and for all activities 
          under your account.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Subscription Plans and Payments</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Peak offers various subscription tiers with different features and pricing. By subscribing to a paid plan:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>You authorize us to charge the applicable fees to your chosen payment method</li>
          <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
          <li>Refunds are subject to our refund policy as outlined below</li>
          <li>Prices may change with 30 days prior notice</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Refund Policy</h2>
        <p class="text-gray-700 dark:text-gray-300">
          We offer refunds within 7 days of purchase if you are not satisfied with our services. 
          To request a refund, contact us at <a href="mailto:hello@peaklife.me" class="text-blue-600 hover:underline">hello@peaklife.me</a>.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Peak provides astrological guidance and should not be considered as professional medical, legal, or financial advice. 
          Use of our services is at your own risk.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">7. Contact Information</h2>
        <p class="text-gray-700 dark:text-gray-300">
          For questions about these Terms and Conditions, contact us at 
          <a href="mailto:hello@peaklife.me" class="text-blue-600 hover:underline">hello@peaklife.me</a>.
        </p>
      </section>
    `
  },
  {
    path: "privacy-policy/index.html",
    title: "Privacy Policy - Peak",
    heading: "Privacy Policy",
    content: `
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">We collect the following information:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Birth details (date, time, place) for astrological calculations</li>
          <li>Contact information (phone number, email)</li>
          <li>Usage data and interaction patterns</li>
          <li>Payment information (processed securely through payment providers)</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">Your information is used to:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Generate personalized astrological insights and recommendations</li>
          <li>Provide and improve our services</li>
          <li>Process payments and subscriptions</li>
          <li>Communicate with you about services and updates</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. Data Security</h2>
        <p class="text-gray-700 dark:text-gray-300">
          We implement industry-standard security measures to protect your personal information. 
          Your birth chart data and personal details are encrypted and stored securely.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
        <p class="text-gray-700 dark:text-gray-300">
          We may use third-party services for payment processing, analytics, and communication. 
          These services have their own privacy policies.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">You have the right to:</p>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Contact Us</h2>
        <p class="text-gray-700 dark:text-gray-300">
          For privacy-related questions or requests, contact us at 
          <a href="mailto:hello@peaklife.me" class="text-blue-600 hover:underline">hello@peaklife.me</a>.
        </p>
      </section>
    `
  },
  {
    path: "delete-my-account/index.html",
    title: "Delete Account - Peak",
    heading: "Delete Your Account",
    content: `
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Account Deletion Request</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          To delete your Peak account, please contact us at 
          <a href="mailto:hello@peaklife.me" class="text-blue-600 hover:underline">hello@peaklife.me</a> 
          with the subject line "Account Deletion Request".
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">What Happens When You Delete Your Account</h2>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>All your personal data will be permanently deleted</li>
          <li>Your birth chart and astrological data will be removed</li>
          <li>Your subscription will be cancelled</li>
          <li>This action cannot be undone</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Processing Time</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Account deletion requests are typically processed within 7 business days. 
          You will receive a confirmation email once your account has been deleted.
        </p>
      </section>
    `
  },
  {
    path: "contact/index.html",
    title: "Contact Us - Peak",
    heading: "Contact Us",
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
          <a href="mailto:hello@peaklife.me" class="text-blue-600 hover:underline text-lg">hello@peaklife.me</a>
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Support Hours</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Monday - Friday: 9:00 AM - 6:00 PM IST<br/>
          We typically respond within 24 hours.
        </p>
      </section>
    `
  }
];

const htmlTemplate = (title, heading, content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${title.split(' - ')[0]} for Peak - AI-powered Vedic astrology">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="bg-white dark:bg-gray-900 min-h-screen">
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <div class="mb-8">
      <a href="/" class="text-blue-600 hover:underline">&larr; Back to Home</a>
    </div>
    
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">${heading}</h1>
    
    <div class="prose prose-lg max-w-none">
      ${content}
    </div>

    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        &copy; ${new Date().getFullYear()} Peak. All rights reserved.
      </p>
    </div>

    <!-- Optional: Load React app for navigation -->
    <noscript>
      <p class="mt-8 text-sm text-gray-600">This is a static version of the page. Enable JavaScript for the full experience.</p>
    </noscript>
  </div>
</body>
</html>`;

for (const page of pages) {
  const filePath = resolve(dist, page.path);
  const dir = dirname(filePath);
  
  mkdirSync(dir, { recursive: true });
  
  const html = htmlTemplate(page.title, page.heading, page.content);
  writeFileSync(filePath, html);
  console.log(`✓ Generated ${page.path}`);
}

console.log("\n✓ Static HTML pages generated successfully!");
