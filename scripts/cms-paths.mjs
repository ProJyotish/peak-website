/**
 * URL mapping for CMS markdown pages (peak-website/site-pages).
 * Keep reserved paths in sync with src/lib/routes.ts + App.tsx.
 */

export const RESERVED_PAGE_PATHS = new Set([
  "/",
  "/blog",
  "/terms",
  "/embed/terms",
  "/privacy-policy",
  "/embed/privacy",
  "/delete-my-account",
  "/contact",
  "/checkout",
  "/tools/astrocartography",
]);

/** Children of these prefixes are owned by the app, not CMS pages. */
export const RESERVED_PAGE_PREFIXES = ["/blog/", "/embed/"];

export function normalizePagePath(pathname) {
  const raw = String(pathname ?? "").replaceAll("\\", "/").trim();
  if (!raw || raw === "/") return "/";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.length > 1 && withSlash.endsWith("/")
    ? withSlash.slice(0, -1)
    : withSlash;
}

/**
 * Relative file under site-pages/ → public URL.
 * about.md → /about
 * guides/saturn.md → /guides/saturn
 * guides/index.md → /guides
 */
export function urlPathFromPageRel(rel) {
  let path = String(rel ?? "")
    .replaceAll("\\", "/")
    .replace(/^\.\/+/, "")
    .replace(/\.md$/i, "");
  if (path === "index" || path === "") return "/";
  if (path.endsWith("/index")) path = path.slice(0, -"/index".length);
  return normalizePagePath(path);
}

export function isReservedPagePath(pathname) {
  const path = normalizePagePath(pathname);
  if (RESERVED_PAGE_PATHS.has(path)) return true;
  return RESERVED_PAGE_PREFIXES.some((prefix) => path.startsWith(prefix));
}
