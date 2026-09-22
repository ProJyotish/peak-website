import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { isReservedPagePath, urlPathFromPageRel } from "./cms-paths.mjs";
import { collectFolderPaths, pageIsIndexed } from "./site-nav.mjs";

const root = resolve(import.meta.dirname, "..");
const postsDir = resolve(root, "posts");
const sitePagesDir = resolve(root, "site-pages");

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
 * Pass the raw frontmatter value: gray-matter parses unquoted YAML dates into
 * `Date` objects, and their stringified form is a rejected locale date.
 * @param {unknown} value
 */
export function toIsoDate(value) {
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

function walkMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

/**
 * CMS page + folder-listing routes under `site-pages/` (the astrology/jyotish
 * decision pages), mirroring `src/lib/pages.ts`'s `getAllPages()` /
 * `getFolderPaths()` without Vite's `import.meta.glob`, which plain Node
 * can't load.
 *
 * A folder is only unconditionally indexed when it has no `index.md` of its
 * own — that's `CmsPage.tsx`'s `noindex={page ? !page.indexed : false}`: no
 * page at that path means noindex is always false. A folder that *does* have
 * an `index.md` is a normal page and follows that page's own `indexed` flag
 * instead, so it's handled by the indexed-pages filter below, not treated as
 * an always-on folder route.
 */
function loadSitePageRoutes() {
  const pages = walkMarkdownFiles(sitePagesDir)
    .map((filePath) => {
      const path = urlPathFromPageRel(relative(sitePagesDir, filePath));
      const { data } = matter(readFileSync(filePath, "utf8"));
      return { path, indexed: pageIsIndexed(data) };
    })
    .filter((page) => !isReservedPagePath(page.path));

  const pagePaths = new Set(pages.map((page) => page.path));
  const indexedPaths = pages.filter((page) => page.indexed).map((page) => page.path);
  const pureFolderPaths = collectFolderPaths(pages).filter((path) => !pagePaths.has(path));

  return [...indexedPaths, ...pureFolderPaths].sort();
}

/**
 * @param {{ slug: string, date?: string }[]} [blogPosts]
 * @param {{ domain?: string, sitePageRoutes?: string[] }} [opts]
 */
export function buildSitemapXml(blogPosts = loadBlogSlugs(), opts = {}) {
  const domain = opts.domain || "peaklife.me";
  const sitePageRoutes = opts.sitePageRoutes ?? loadSitePageRoutes();

  /** @type {{ loc: string, changefreq: string, priority: string, lastmod?: string }[]} */
  const entries = [
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
    ...sitePageRoutes.map((path) => ({
      loc: `${path}/`,
      changefreq: "monthly",
      priority: "0.6",
    })),
    { loc: "/tools/astrocartography/", changefreq: "monthly", priority: "0.6" },
    { loc: "/careers/", changefreq: "weekly", priority: "0.6" },
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
 * @param {{ domain?: string, sitePageRoutes?: string[] }} [opts]
 */
export function writeSitemap(outPath, blogPosts, opts) {
  writeFileSync(outPath, buildSitemapXml(blogPosts, opts));
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  const out = resolve(root, "public", "sitemap.xml");
  writeSitemap(out);
  console.log(`✓ Wrote ${out}`);
}
