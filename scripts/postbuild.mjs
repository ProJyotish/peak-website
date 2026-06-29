import { copyFileSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

// GitHub Pages serves 404.html for unknown paths while keeping the URL.
// Copying the built SPA shell lets React Router handle /privacy, /terms, etc.
const dist = resolve(import.meta.dirname, "..", "dist");
const indexHtml = readFileSync(resolve(dist, "index.html"), "utf-8");

// Copy index.html to 404.html for client-side routing fallback
copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));

// Pre-generate static HTML files for SEO and faster initial loads
const routes = [
  { path: "terms/index.html", title: "Terms of Service - Peak" },
  { path: "embed/terms/index.html", title: "Terms of Service - Peak" },
  { path: "privacy-policy/index.html", title: "Privacy Policy - Peak" },
  { path: "embed/privacy/index.html", title: "Privacy Policy - Peak" },
  { path: "delete-my-account/index.html", title: "Delete Account - Peak" },
  { path: "contact/index.html", title: "Contact Us - Peak" },
];

for (const route of routes) {
  const filePath = resolve(dist, route.path);
  const dir = dirname(filePath);
  
  // Create directory if it doesn't exist
  mkdirSync(dir, { recursive: true });
  
  // Create HTML with updated title for SEO
  const html = indexHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${route.title}</title>`
  );
  
  writeFileSync(filePath, html);
  console.log(`✓ Generated ${route.path}`);
}

console.log("\n✓ Static pages generated successfully!");

