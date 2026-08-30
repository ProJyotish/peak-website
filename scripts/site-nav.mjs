/**
 * Shared nav helpers for CMS folder listings, breadcrumbs, and sitemap.
 * Used by postbuild (Node) and the Vite app (via src/lib/pages.ts).
 */
import {
  isReservedPagePath,
  normalizePagePath,
} from "./cms-paths.mjs";

export const SITE_ORIGIN = "https://peaklife.me";

/** Labels for app-owned routes (not CMS files). */
export const STATIC_PATH_LABELS = {
  "/": "Home",
  "/blog": "Blog",
  "/terms": "Terms",
  "/privacy-policy": "Privacy",
  "/delete-my-account": "Delete your account",
  "/contact": "Contact",
  "/tools/astrocartography": "Astrocartography",
};

export function parentPath(pathname) {
  const path = normalizePagePath(pathname);
  if (path === "/") return null;
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return parts.length ? `/${parts.join("/")}` : "/";
}

export function titleFromSlug(slug) {
  return String(slug ?? "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function publicUrl(pathname, origin = SITE_ORIGIN) {
  const path = normalizePagePath(pathname);
  if (path === "/") return `${origin}/`;
  return `${origin}${path}/`;
}

/** Dist file `blog/slug/index.html` → `/blog/slug`. */
export function urlFromDistPath(distPath) {
  let path = String(distPath ?? "")
    .replaceAll("\\", "/")
    .replace(/^\.\/+/, "")
    .replace(/\/index\.html$/i, "")
    .replace(/\.html$/i, "");
  if (!path || path === "index") return "/";
  return normalizePagePath(path);
}

export function pageIsIndexed(data) {
  if (!data || typeof data !== "object") return true;
  if (data.noindex === true || data.noindex === "true") return false;
  if (data.index === false || data.index === "false") return false;
  return true;
}

/**
 * Immediate listing cards under `parentPath`.
 * `pages` is `{ path, title, description, eyebrow }[]`.
 */
export function listingItems(parent, pages) {
  const parentNorm = normalizePagePath(parent);
  const items = [];
  const seen = new Set();
  const prefix = parentNorm === "/" ? "/" : `${parentNorm}/`;

  for (const page of pages) {
    const path = normalizePagePath(page.path);
    if (path === parentNorm) continue;
    if (parentPath(path) === parentNorm) {
      items.push({
        type: "page",
        path,
        title: page.title,
        description: page.description ?? "",
        eyebrow: page.eyebrow ?? "",
      });
      seen.add(path);
    }
  }

  for (const page of pages) {
    const path = normalizePagePath(page.path);
    if (path === parentNorm) continue;
    if (!path.startsWith(prefix)) continue;
    const rest = path.slice(prefix.length);
    const segs = rest.split("/").filter(Boolean);
    if (segs.length < 2) continue;
    const folderPath = `${prefix}${segs[0]}`.replace(/\/{2,}/g, "/");
    const normalizedFolder = normalizePagePath(folderPath);
    if (seen.has(normalizedFolder)) continue;
    seen.add(normalizedFolder);
    const named = pages.find(
      (p) => normalizePagePath(p.path) === normalizedFolder,
    );
    items.push({
      type: "folder",
      path: normalizedFolder,
      title: named?.title ?? titleFromSlug(segs[0]),
      description: named?.description ?? "",
      eyebrow: named?.eyebrow ?? "Folder",
    });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

/** Folder URLs that have at least one descendant page (excluding reserved). */
export function collectFolderPaths(pages) {
  const folders = new Set();
  for (const page of pages) {
    let current = parentPath(page.path);
    while (current && current !== "/") {
      if (!isReservedPagePath(current)) folders.add(current);
      current = parentPath(current);
    }
  }
  return [...folders].sort();
}

export function crumbsForPath(pathname, titleByPath = {}) {
  const path = normalizePagePath(pathname);
  const crumbs = [{ href: "/", label: "Home", current: path === "/" }];
  if (path === "/") return crumbs;

  const parts = path.split("/").filter(Boolean);
  let acc = "";
  for (let i = 0; i < parts.length; i += 1) {
    acc += `/${parts[i]}`;
    const isLast = i === parts.length - 1;
    const label =
      titleByPath[acc] ||
      STATIC_PATH_LABELS[acc] ||
      titleFromSlug(parts[i]);
    crumbs.push({ href: acc, label, current: isLast });
  }
  return crumbs;
}

export function buildSitemapXml(urls, origin = SITE_ORIGIN) {
  const seen = new Set();
  const locs = [];
  for (const raw of urls) {
    const loc = raw.startsWith("http") ? raw : publicUrl(raw, origin);
    if (seen.has(loc)) continue;
    seen.add(loc);
    locs.push(loc);
  }
  locs.sort();
  const body = locs
    .map((loc) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
