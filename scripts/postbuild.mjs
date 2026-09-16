import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { blogSitemapEntries } from "./blog-posts.mjs";
import { writeSitemap } from "./sitemap.mjs";
import { careersPage } from "./careers.mjs";
import {
  STATIC_PATH_LABELS,
  crumbsForPath,
  publicUrl,
  urlFromDistPath,
} from "./site-nav.mjs";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

const SITE = {
  domain: "peaklife.me",
  supportEmail: "support@peaklife.me",
  contactEmail: "support@peaklife.me",
  legalName: "Aryaman Knowledge Services Private Limited",
  address: "India",
  brand: "Peak",
};

const TITLE_BY_PATH = { ...STATIC_PATH_LABELS };

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Peak parchment + gold static shell (zero JS).
 * @param {{
 *   title: string;
 *   description?: string;
 *   eyebrow: string;
 *   heading: string;
 *   metaLine?: string;
 *   backHref?: string;
 *   backLabel?: string;
 *   extraHead?: string;
 *   content: string;
 * }} opts
 */
function htmlTemplate({
  title,
  description,
  eyebrow,
  heading,
  metaLine,
  backHref = "/",
  backLabel = "Home",
  breadcrumbs = [],
  noindex = false,
  canonical = "",
  extraHead = "",
  content,
}) {
  const desc = escapeHtml(
    description || `${String(title).split(" - ")[0]} for Peak - AI-powered Vedic astrology`,
  );
  // Static/SSR pages are full document loads — enable automatic page_view
  const GA4_ID = "G-0E72R2MF9P";
  const GTM_ID = "GTM-TTMK5Q4R";
  const crumbNav = breadcrumbsHtml(breadcrumbs, backHref, backLabel);
  const crumbJson = breadcrumbJsonLd(breadcrumbs);
  const robots = noindex
    ? `  <meta name="robots" content="noindex, follow">\n`
    : "";
  const canonicalTag = canonical
    ? `  <link rel="canonical" href="${escapeHtml(canonical)}">\n`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA4_ID}');
  </script>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
  <!-- End Google Tag Manager -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${desc}">
${robots}${canonicalTag}${crumbJson}${extraHead}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --parchment: #F4EFE5;
      --ink: #1A1614;
      --clay: #8A7360;
      --gold: #C28D2A;
      --border: #D9CDB8;
      --muted: #6B5B4F;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--parchment);
      color: var(--ink);
      font-family: Inter, system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrap {
      max-width: 48rem;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem;
    }
    .back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--clay);
      text-decoration: none;
      margin-bottom: 2.5rem;
    }
    .back:hover { color: var(--ink); }
    .eyebrow {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--clay);
      margin: 0 0 1rem;
    }
    h1 {
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.15;
      letter-spacing: -0.02em;
      font-weight: 600;
      margin: 0 0 1rem;
      color: var(--ink);
    }
    .meta {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--clay);
      margin: 0;
    }
    header.page-header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 2rem;
      margin-bottom: 2.5rem;
    }
    article {
      color: var(--muted);
      line-height: 1.75;
      font-size: 1rem;
    }
    article h1, article h2, article h3, article h4 {
      font-family: Fraunces, Georgia, serif;
      color: var(--ink);
      letter-spacing: -0.02em;
      margin: 2.25rem 0 0.75rem;
    }
    article h1 { font-size: 1.875rem; }
    article h2 { font-size: 1.5rem; }
    article h3 { font-size: 1.25rem; }
    article h4 { font-size: 1.125rem; }
    article p { margin: 0 0 1rem; }
    article ul, article ol {
      margin: 0 0 1.25rem;
      padding-left: 1.25rem;
    }
    article ul ul, article ol ol, article ul ol, article ol ul {
      margin: 0.5rem 0 0;
    }
    article li { margin-bottom: 0.4rem; }
    article strong { color: var(--ink); font-weight: 600; }
    article a { color: var(--gold); }
    article a:hover { color: var(--ink); }
    article hr {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 2rem 0;
    }
    article em { color: var(--clay); }
    article del { color: rgba(107, 91, 79, 0.7); }
    article blockquote {
      margin: 1.5rem 0;
      padding-left: 1rem;
      border-left: 2px solid var(--gold);
      color: var(--clay);
      font-style: italic;
    }
    article code {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.9em;
      color: var(--ink);
      background: rgba(255,255,255,0.4);
      border: 1px solid var(--border);
      padding: 0.1rem 0.35rem;
      border-radius: 0.25rem;
    }
    article pre {
      margin: 1.5rem 0;
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: rgba(255,255,255,0.4);
      padding: 1rem;
    }
    article pre code {
      border: 0;
      background: transparent;
      padding: 0;
    }
    article table {
      width: 100%;
      margin: 1.5rem 0;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }
    article thead th {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--clay);
      border-bottom: 1px solid var(--border);
      padding: 0 1rem 0.5rem 0;
    }
    article tbody td {
      border-bottom: 1px solid rgba(217, 205, 184, 0.7);
      padding: 0.65rem 1rem 0.65rem 0;
      vertical-align: top;
    }
    article details {
      margin: 1rem 0;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: rgba(255,255,255,0.3);
      overflow: hidden;
    }
    article details + details { margin-top: 0.5rem; }
    article summary {
      cursor: pointer;
      list-style: none;
      padding: 0.75rem 1rem;
      font-weight: 500;
      color: var(--ink);
      user-select: none;
    }
    article summary::-webkit-details-marker { display: none; }
    article summary::after {
      content: "+";
      float: right;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      color: var(--clay);
    }
    article details[open] > summary::after { content: "−"; }
    article details > :not(summary) {
      padding: 0 1rem 1rem;
    }
    article .blog-figure {
      margin: 2rem 0;
    }
    article .blog-figure img {
      width: 100%;
      height: auto;
      display: block;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
    }
    article .blog-figure figcaption {
      margin-top: 0.5rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--clay);
    }
    article .blog-embed {
      position: relative;
      margin: 2rem 0;
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
    }
    article .blog-embed iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    .post-card {
      display: block;
      text-decoration: none;
      color: inherit;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.35);
      padding: 1.5rem 1.75rem;
      margin-bottom: 1rem;
      transition: border-color 0.15s ease;
    }
    .post-card:hover { border-color: var(--gold); }
    .post-card h2 {
      font-family: Fraunces, Georgia, serif;
      font-size: 1.5rem;
      color: var(--ink);
      margin: 0.5rem 0 0.75rem;
      letter-spacing: -0.02em;
    }
    .post-card:hover h2 { color: var(--gold); }
    .post-card p { margin: 0; color: var(--muted); line-height: 1.6; }
    .post-card .read {
      margin-top: 1rem;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--clay);
    }
    .chip {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gold);
    }
    .row-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 1.25rem;
      margin-bottom: 0.25rem;
    }
    footer.site-footer {
      margin-top: 3.5rem;
      padding-top: 1.75rem;
      border-top: 1px solid var(--border);
    }
    footer.site-footer p {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--clay);
      margin: 0;
    }
    footer.site-footer nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem 1.5rem;
      margin-bottom: 1.25rem;
    }
    footer.site-footer a {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--clay);
      text-decoration: none;
    }
    footer.site-footer a:hover { color: var(--ink); }
    nav.breadcrumbs {
      margin: 0 0 2.5rem;
    }
    nav.breadcrumbs ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--clay);
    }
    nav.breadcrumbs li {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    nav.breadcrumbs a {
      color: var(--clay);
      text-decoration: none;
    }
    nav.breadcrumbs a:hover { color: var(--ink); }
    nav.breadcrumbs [aria-current="page"] { color: var(--ink); }
    nav.breadcrumbs .sep { color: rgba(138, 115, 96, 0.5); }
  </style>
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <div class="wrap">
    ${crumbNav}

    <header class="page-header">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h1>${escapeHtml(heading)}</h1>
      ${metaLine ? `<p class="meta">${metaLine}</p>` : ""}
    </header>

    <article>
      ${content}
    </article>

    <footer class="site-footer">
      <nav aria-label="Footer">
        <a href="/">Home</a>
        <a href="/careers/">Careers</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy-policy/">Privacy</a>
        <a href="/terms/">Terms</a>
      </nav>
      <p>© ${new Date().getFullYear()} ${escapeHtml(SITE.brand)} · All rights reserved</p>
    </footer>
  </div>
</body>
</html>`;
}

function breadcrumbsHtml(breadcrumbs, backHref, backLabel) {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length < 2) {
    return `<a class="back" href="${escapeHtml(backHref)}">← ${escapeHtml(backLabel)}</a>`;
  }
  const items = breadcrumbs
    .map((crumb, index) => {
      const sep = index > 0 ? `<span class="sep" aria-hidden="true">/</span>` : "";
      if (crumb.current) {
        return `<li>${sep}<span aria-current="page">${escapeHtml(crumb.label)}</span></li>`;
      }
      const href = crumb.href === "/" ? "/" : `${crumb.href}/`;
      return `<li>${sep}<a href="${escapeHtml(href)}">${escapeHtml(crumb.label)}</a></li>`;
    })
    .join("");
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

function breadcrumbJsonLd(breadcrumbs) {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length < 2) return "";
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: publicUrl(crumb.href),
    })),
  };
  return `  <script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

function writePage(page) {
  const filePath = resolve(dist, page.path);
  mkdirSync(dirname(filePath), { recursive: true });
  const urlPath = urlFromDistPath(page.path);
  const html = htmlTemplate({
    title: page.title,
    description: page.description,
    eyebrow: page.eyebrow ?? "Legal",
    heading: page.heading,
    metaLine: page.lastUpdated
      ? `Last updated · ${escapeHtml(page.lastUpdated)}`
      : page.metaLine,
    backHref: page.backHref ?? "/",
    backLabel: page.backLabel ?? "Home",
    breadcrumbs: page.breadcrumbs ?? crumbsForPath(urlPath, TITLE_BY_PATH),
    noindex: Boolean(page.noindex),
    canonical: page.canonical || publicUrl(urlPath),
    extraHead: page.extraHead ?? "",
    content: page.content,
  });
  writeFileSync(filePath, html);
  console.log(`✓ Generated ${page.path}`);
}


writePage(careersPage());

const sitemapBlogEntries = blogSitemapEntries();
writeSitemap(resolve(dist, "sitemap.xml"), sitemapBlogEntries, { domain: SITE.domain });
writeSitemap(resolve(root, "public", "sitemap.xml"), sitemapBlogEntries, { domain: SITE.domain });
console.log("✓ Generated sitemap.xml");
console.log("\n✓ Postbuild complete (careers + sitemap). React routes were prerendered.");
