import { getAllSlugs } from "@/lib/blog";
import { getAllPages, getFolderPaths } from "@/lib/pages";
import { PRODUCT_PAGES, productPath } from "@/lib/product";
import { ROUTES } from "@/lib/routes";

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
] as const;

/**
 * Every React route written as `dist/<path>/index.html` for S3 + CloudFront.
 * `/careers` is generated separately (Apps Script form, no React route).
 */
export function collectPrerenderRoutes(): string[] {
  const routes = new Set<string>(STATIC_ROUTES);

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
