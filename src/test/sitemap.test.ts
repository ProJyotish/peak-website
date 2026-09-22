import { afterEach, describe, expect, it } from "vitest";
import matter from "gray-matter";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { blogSitemapEntries, loadBlogPosts } from "../../scripts/blog-posts.mjs";
import { buildSitemapXml, loadSitePageRoutes, toIsoDate } from "../../scripts/sitemap.mjs";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const postsDir = resolve(__dirname, "../../posts");
const jyotishDir = resolve(__dirname, "../../site-pages/jyotish");

/** Exact <loc> values from the sitemap XML, so a check on `/jyotish/` can't
 * false-positive by matching as a substring of `/jyotish/aries-ascendant/`. */
function locs(xml: string): Set<string> {
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
}

/** loc -> lastmod ("" when the entry has none), for the /blog/<slug>/ urls only. */
function blogLastmods(xml: string) {
  const found = new Map<string, string>();
  for (const block of xml.split("<url>").slice(1)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "";
    if (!/\/blog\/[^/]+\/$/.test(loc)) continue;
    found.set(loc, block.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1] ?? "");
  }
  return found;
}

describe("blog sitemap lastmod", () => {
  it("keeps a lastmod on every blog url the build writes", () => {
    const entries = blogLastmods(buildSitemapXml(blogSitemapEntries()));
    expect(entries.size).toBe(readdirSync(postsDir).filter((f) => f.endsWith(".md")).length);
    for (const [loc, lastmod] of entries) {
      expect(lastmod, `${loc} lost its <lastmod>`).toMatch(ISO_DATE);
    }
  });

  it("writes the same blog lastmods from the build as from `npm run sitemap`", () => {
    // `npm run build` (postbuild -> blogSitemapEntries) and `npm run sitemap`
    // (sitemap.mjs's own loader) must not drift apart.
    expect(Object.fromEntries(blogLastmods(buildSitemapXml(blogSitemapEntries())))).toEqual(
      Object.fromEntries(blogLastmods(buildSitemapXml())),
    );
  });

  it("carries the ISO date, not the display string, for each post", () => {
    for (const post of loadBlogPosts()) {
      expect(post.isoDate, `${post.slug} has no ISO date`).toMatch(ISO_DATE);
    }
  });
});

describe("site-pages sitemap entries", () => {
  it("includes every jyotish page plus its /jyotish/ folder listing", () => {
    const found = locs(buildSitemapXml());
    // "index.md" is the folder's own page (-> /jyotish/, not /jyotish/index/),
    // same convention as urlPathFromPageRel; check it via the folder assertion below.
    const slugs = readdirSync(jyotishDir)
      .filter((f) => f.endsWith(".md") && f !== "index.md")
      .map((f) => f.replace(/\.md$/, ""));
    // All jyotish pages ship indexed today; if one goes noindex later,
    // update this instead of assuming the count.
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(found.has(`https://peaklife.me/jyotish/${slug}/`), `${slug} missing`).toBe(true);
    }
    expect(found.has("https://peaklife.me/jyotish/")).toBe(true);
  });

  describe("indexed/folder rules, against a throwaway fixture directory", () => {
    // Real site-pages/ content gets added, edited, and deleted mid-session by
    // CMS editors, so pinning these rules to it (as earlier drafts of this
    // file did, against astrology/* before that section was deleted) is
    // flaky. A synthetic fixture keeps this deterministic.
    let fixtureDir: string;

    afterEach(() => {
      if (fixtureDir) rmSync(fixtureDir, { recursive: true, force: true });
    });

    function writePage(rel: string, frontmatter: Record<string, unknown>, body = "Body.") {
      const filePath = join(fixtureDir, rel);
      mkdirSync(join(filePath, ".."), { recursive: true });
      const yaml = Object.entries(frontmatter)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      writeFileSync(filePath, `---\n${yaml}\n---\n\n${body}\n`);
    }

    it("includes an indexed page and a pure folder with no index.md of its own", () => {
      fixtureDir = mkdtempSync(join(tmpdir(), "sitemap-fixture-"));
      writePage("guides/saturn.md", { title: "Saturn" });
      const routes = loadSitePageRoutes(fixtureDir);
      expect(routes).toContain("/guides/saturn");
      expect(routes).toContain("/guides"); // pure folder: no guides/index.md
    });

    it("excludes a noindex page", () => {
      fixtureDir = mkdtempSync(join(tmpdir(), "sitemap-fixture-"));
      writePage("draft.md", { title: "Draft", index: false });
      expect(loadSitePageRoutes(fixtureDir)).not.toContain("/draft");
    });

    it("excludes a folder whose own index.md is noindex, rather than always indexing folders", () => {
      // A folder with an index.md is a real page following its own `indexed`
      // flag (CmsPage.tsx: noindex={page ? !page.indexed : false}), not an
      // always-on listing — unlike the pure-folder case above.
      fixtureDir = mkdtempSync(join(tmpdir(), "sitemap-fixture-"));
      writePage("guides/index.md", { title: "Guides", index: false });
      writePage("guides/saturn.md", { title: "Saturn" });
      const routes = loadSitePageRoutes(fixtureDir);
      expect(routes).not.toContain("/guides");
      expect(routes).toContain("/guides/saturn");
    });
  });
});

describe("toIsoDate", () => {
  it("normalizes the Date objects gray-matter parses unquoted YAML dates into", () => {
    for (const fileName of readdirSync(postsDir).filter((f) => f.endsWith(".md"))) {
      const { data } = matter(readFileSync(join(postsDir, fileName), "utf8"));
      expect(toIsoDate(data.date), `${fileName} frontmatter date`).toMatch(ISO_DATE);
    }
  });

  it("rejects a stringified Date, so the raw frontmatter value must be passed through", () => {
    const parsed = new Date("2026-08-02T00:00:00.000Z");
    expect(toIsoDate(parsed)).toBe("2026-08-02");
    // e.g. "Sun Aug 02 2026 05:30:00 GMT+0530" — the shape that dropped lastmod.
    expect(toIsoDate(String(parsed))).toBe("");
  });

  it("clamps a future date to today and passes an ISO string through", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(toIsoDate("2999-01-01")).toBe(today);
    expect(toIsoDate("2020-03-04")).toBe("2020-03-04");
    expect(toIsoDate("")).toBe("");
    expect(toIsoDate(null)).toBe("");
  });
});
