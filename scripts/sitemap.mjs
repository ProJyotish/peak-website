import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";

const root = resolve(import.meta.dirname, "..");
const postsDir = resolve(root, "posts");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Keep in sync with `src/lib/product.ts` PRODUCT_PAGES slugs. */
export const PRODUCT_SLUGS = [
  "daily-guidance",
  "hora-timing",
  "ask",
  "goals",
  "family-profiles",
  "how-it-works",
];

/** Calendar today in UTC as YYYY-MM-DD (never a locale string). */
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Normalize to W3C date (YYYY-MM-DD) for sitemap lastmod.
 * Returns "" if the value cannot be made valid (Google rejects locale dates).
 * @param {unknown} value
 */
function toIsoDate(value) {
  if (value == null || value === "") return "";

  let iso = "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    iso = value.toISOString().slice(0, 10);
  } else {
    const raw = String(value).trim();
    const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      iso = match[1];
    } else {
      // Reject locale strings like "Sat Aug 01" — do not Date-parse them.
      return "";
    }
  }

  if (!ISO_DATE.test(iso)) return "";

  // Google rejects lastmod in the future.
  const today = todayIso();
  return iso > today ? today : iso;
}

function loadBlogSlugs() {
  return readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const raw = readFileSync(join(postsDir, fileName), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        date: toIsoDate(data.date),
      };
    });
}

/**
 * @param {{ slug: string, date?: string }[]} [blogPosts]
 * @param {{ site?: "peak" | "horary", domain?: string }} [opts]
 */
export function buildSitemapXml(blogPosts = loadBlogSlugs(), opts = {}) {
  const site = opts.site === "horary" ? "horary" : "peak";
  const domain =
    opts.domain ||
    (site === "horary" ? "peaklifehorary.me" : "peaklife.me");

  /** @type {{ loc: string, changefreq: string, priority: string, lastmod?: string }[]} */
  const entries =
    site === "horary"
      ? [
          { loc: "/", changefreq: "weekly", priority: "1.0" },
          { loc: "/contact/", changefreq: "yearly", priority: "0.5" },
          { loc: "/terms/", changefreq: "yearly", priority: "0.3" },
          { loc: "/privacy-policy/", changefreq: "yearly", priority: "0.3" },
          { loc: "/delete-my-account/", changefreq: "yearly", priority: "0.2" },
        ]
      : [
          { loc: "/", changefreq: "weekly", priority: "1.0" },
          { loc: "/product/", changefreq: "weekly", priority: "0.9" },
          ...PRODUCT_SLUGS.map((slug) => ({
            loc: `/product/${slug}/`,
            changefreq: "weekly",
            priority: "0.8",
          })),
          { loc: "/blog/", changefreq: "weekly", priority: "0.8" },
          ...blogPosts.map((post) => ({
            loc: `/blog/${post.slug}/`,
            changefreq: "monthly",
            priority: "0.7",
            lastmod: toIsoDate(post.date),
          })),
          { loc: "/tools/astrocartography/", changefreq: "monthly", priority: "0.6" },
          { loc: "/contact/", changefreq: "yearly", priority: "0.5" },
          { loc: "/terms/", changefreq: "yearly", priority: "0.3" },
          { loc: "/privacy-policy/", changefreq: "yearly", priority: "0.3" },
          { loc: "/delete-my-account/", changefreq: "yearly", priority: "0.2" },
        ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => {
    const lastmod = entry.lastmod && ISO_DATE.test(entry.lastmod) ? entry.lastmod : "";
    const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
    return `  <url>
    <loc>https://${domain}${entry.loc}</loc>${lastmodLine}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;
}

/**
 * @param {string} outPath
 * @param {{ slug: string, date?: string }[]} [blogPosts]
 * @param {{ site?: "peak" | "horary", domain?: string }} [opts]
 */
export function writeSitemap(outPath, blogPosts, opts) {
  writeFileSync(outPath, buildSitemapXml(blogPosts, opts));
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  const siteArg = process.argv[2] === "horary" ? "horary" : "peak";
  const out = resolve(root, "public", "sitemap.xml");
  writeSitemap(out, undefined, { site: siteArg });
  console.log(`✓ Wrote ${out} (${siteArg})`);
}
