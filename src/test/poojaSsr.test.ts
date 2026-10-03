import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { buildSitemapXml } from "../../scripts/sitemap.mjs";
import {
  htmlToText,
  poojaKeys,
  poojaSeoDescription,
  seedPoojaQueries,
  type Pooja,
  type PoojaCatalog,
} from "@/lib/pooja";

const puja: Pooja = {
  id: "gid://shopify/Product/1",
  slug: "mundan-sanskar-puja",
  title: "Mundan Sanskar Puja",
  titleHi: "मुंडन संस्कार पूजा",
  descriptionHtml: "<p>First haircut &amp; blessings.</p><ul><li>Sankalp</li></ul>",
  images: [],
  variantId: "gid://shopify/ProductVariant/2",
  numericVariantId: "2",
  price: 1650,
  currency: "INR",
  brahmins: 1,
  tags: [],
  bookable: true,
  updatedAt: "2026-09-30T10:00:00Z",
};
const catalog: PoojaCatalog = { pujas: [puja], addons: [], generatedAt: "2026-10-01T00:00:00Z" };

describe("pooja SSR seeding", () => {
  it("seeds the detail query for a pooja page and the catalog for the index", () => {
    const detail = new QueryClient();
    seedPoojaQueries(detail, catalog, "/pooja/mundan-sanskar-puja/");
    expect(detail.getQueryData(poojaKeys.detail(puja.slug))).toEqual({ puja, addons: [] });
    expect(detail.getQueryData(poojaKeys.catalog)).toBeUndefined();

    const index = new QueryClient();
    seedPoojaQueries(index, catalog, "/pooja");
    expect(index.getQueryData(poojaKeys.catalog)).toEqual(catalog);
  });

  it("marks seeded data with the catalog time so the client refetches it", () => {
    const client = new QueryClient();
    seedPoojaQueries(client, catalog, "/pooja/mundan-sanskar-puja");
    const state = client.getQueryState(poojaKeys.detail(puja.slug));
    expect(state?.dataUpdatedAt).toBe(Date.parse(catalog.generatedAt));
  });

  it("derives SEO copy from Shopify HTML when no SEO override is set", () => {
    expect(htmlToText(puja.descriptionHtml)).toBe("First haircut & blessings. Sankalp");
    expect(poojaSeoDescription(puja)).toBe("First haircut & blessings. Sankalp");
    expect(poojaSeoDescription({ ...puja, seoDescription: "Custom" })).toBe("Custom");
  });
});

describe("pooja sitemap entries", () => {
  it("lists each pooja with its Shopify updatedAt as lastmod", () => {
    const xml = buildSitemapXml([], { poojas: [{ slug: puja.slug, lastmod: puja.updatedAt }] });
    expect(xml).toContain("<loc>https://peaklife.me/pooja/mundan-sanskar-puja/</loc>");
    expect(xml).toMatch(/pooja\/mundan-sanskar-puja\/<\/loc>\s*<lastmod>2026-09-30<\/lastmod>/);
  });
});
