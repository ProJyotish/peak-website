import { getAllSlugs } from "@/lib/blog";
import { getAllPages, getFolderPaths } from "@/lib/pages";
import { PRODUCT_PAGES, productPath } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import { STORE_CATEGORIES } from "@/lib/store";

const STATIC_ROUTES = [
  ROUTES.home,
  ROUTES.blog,
  ROUTES.product,
  ROUTES.terms,
  ROUTES.termsEmbed,
  ROUTES.privacy,
  ROUTES.privacyEmbed,
  ROUTES.accountDeletion,
  ROUTES.contact,
  ROUTES.checkout,
  ROUTES.astrocartography,
  ROUTES.store,
] as const;

/**
 * Every React route written as `dist/<path>/index.html` for S3 + CloudFront.
 * `/careers` is generated separately (Apps Script form, no React route).
 * Pooja slugs come from the build-time Shopify catalog snapshot. Old `/pooja/*` links
 * have no page of their own: they reach the SPA through 404.html and redirect there.
 */
export function collectPrerenderRoutes(poojaSlugs: string[] = []): string[] {
  const routes = new Set<string>(STATIC_ROUTES);

  for (const category of STORE_CATEGORIES) {
    routes.add(ROUTES.storeCategory(category.slug));
  }
  for (const slug of poojaSlugs) {
    routes.add(ROUTES.poojaPage(slug));
  }

  for (const slug of getAllSlugs()) {
    routes.add(ROUTES.blogPost(slug));
  }
  for (const product of PRODUCT_PAGES) {
    routes.add(productPath(product.slug));
  }
  for (const page of getAllPages()) {
    routes.add(page.path);
  }
  for (const folder of getFolderPaths()) {
    routes.add(folder);
  }

  return [...routes].sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });
}
