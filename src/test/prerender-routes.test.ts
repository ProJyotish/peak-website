import { describe, expect, it } from "vitest";
import { getAllSlugs } from "@/lib/blog";
import { getAllPages, getFolderPaths } from "@/lib/pages";
import { PRODUCT_PAGES } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import { collectPrerenderRoutes } from "@/lib/prerender-routes";

describe("collectPrerenderRoutes", () => {
  const routes = collectPrerenderRoutes();

  it("includes the marketing and app-owned pages", () => {
    expect(routes[0]).toBe("/");
    expect(routes).toContain(ROUTES.home);
    expect(routes).toContain(ROUTES.blog);
    expect(routes).toContain(ROUTES.product);
    expect(routes).toContain(ROUTES.terms);
    expect(routes).toContain(ROUTES.contact);
    expect(routes).toContain(ROUTES.checkout);
    expect(routes).toContain(ROUTES.astrocartography);
  });

  it("includes every product and blog slug", () => {
    for (const product of PRODUCT_PAGES) {
      expect(routes).toContain(`/product/${product.slug}`);
    }
    for (const slug of getAllSlugs()) {
      expect(routes).toContain(`/blog/${slug}`);
    }
  });

  it("includes CMS pages and folder indexes", () => {
    for (const page of getAllPages()) {
      expect(routes).toContain(page.path);
    }
    for (const folder of getFolderPaths()) {
      expect(routes).toContain(folder);
    }
  });

  it("does not prerender careers (static form page)", () => {
    expect(routes).not.toContain(ROUTES.careers);
  });
});
