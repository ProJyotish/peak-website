import { describe, expect, it } from "vitest";
import {
  buildSitemapXml,
  collectFolderPaths,
  crumbsForPath,
  listingItems,
  pageIsIndexed,
  parentPath,
  publicUrl,
  titleFromSlug,
  urlFromDistPath,
} from "../../scripts/site-nav.mjs";

const pages = [
  { path: "/astrology", title: "Astrology for real decisions", description: "Hub", eyebrow: "Astrology" },
  { path: "/astrology/career", title: "Career decisions", description: "Jobs", eyebrow: "Career" },
  { path: "/astrology/career/change-jobs", title: "Should I change jobs now?", description: "Exit window", eyebrow: "Career" },
  { path: "/astrology/career/take-this-offer", title: "Should I take this job offer?", description: "Two paths", eyebrow: "Career" },
  { path: "/app/how-it-works", title: "How It Works", description: "", eyebrow: "" },
];

describe("parentPath", () => {
  it("walks up to the folder, then home", () => {
    expect(parentPath("/astrology/career/change-jobs")).toBe("/astrology/career");
    expect(parentPath("/astrology/career")).toBe("/astrology");
    expect(parentPath("/astrology")).toBe("/");
    expect(parentPath("/")).toBeNull();
  });
});

describe("listingItems", () => {
  it("lists life-area folders under /astrology like a blog index", () => {
    const items = listingItems("/astrology", pages);
    expect(items.map((item) => item.path)).toEqual(["/astrology/career"]);
    expect(items[0].type).toBe("page");
    expect(items[0].title).toBe("Career decisions");
  });

  it("lists decision pages under a life area", () => {
    const items = listingItems("/astrology/career", pages);
    expect(items.map((item) => item.path).sort()).toEqual([
      "/astrology/career/change-jobs",
      "/astrology/career/take-this-offer",
    ]);
  });

  it("synthesizes a folder card when the folder has no index.md", () => {
    const items = listingItems("/app", pages);
    expect(items).toEqual([
      expect.objectContaining({
        type: "page",
        path: "/app/how-it-works",
        title: "How It Works",
      }),
    ]);
    expect(collectFolderPaths(pages)).toContain("/app");
  });
});

describe("crumbsForPath", () => {
  it("builds Home > Astrology > Career > page", () => {
    const crumbs = crumbsForPath("/astrology/career/change-jobs", {
      "/astrology": "Astrology for real decisions",
      "/astrology/career": "Career decisions",
      "/astrology/career/change-jobs": "Should I change jobs now?",
    });
    expect(crumbs.map((c) => c.label)).toEqual([
      "Home",
      "Astrology for real decisions",
      "Career decisions",
      "Should I change jobs now?",
    ]);
    expect(crumbs.at(-1)?.current).toBe(true);
    expect(crumbs[0].href).toBe("/");
  });
});

describe("pageIsIndexed", () => {
  it("defaults to indexed and honors index: false", () => {
    expect(pageIsIndexed({})).toBe(true);
    expect(pageIsIndexed({ index: false })).toBe(false);
    expect(pageIsIndexed({ index: "false" })).toBe(false);
    expect(pageIsIndexed({ noindex: true })).toBe(false);
  });
});

describe("sitemap", () => {
  it("rebuilds from the current URL list and skips duplicates", () => {
    const xml = buildSitemapXml(["/", "/blog", "/blog/", "https://peaklife.me/contact/"]);
    expect(xml).toContain("<loc>https://peaklife.me/</loc>");
    expect(xml).toContain("<loc>https://peaklife.me/blog/</loc>");
    expect(xml).toContain("<loc>https://peaklife.me/contact/</loc>");
    expect(xml.match(/<url>/g)?.length).toBe(3);
  });
});

describe("url helpers", () => {
  it("maps dist paths and slugs", () => {
    expect(urlFromDistPath("astrology/career/change-jobs/index.html")).toBe(
      "/astrology/career/change-jobs",
    );
    expect(publicUrl("/astrology/career")).toBe("https://peaklife.me/astrology/career/");
    expect(titleFromSlug("change-jobs")).toBe("Change Jobs");
  });
});
