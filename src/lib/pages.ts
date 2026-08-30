import { parseFrontmatter } from "./frontmatter";
import {
  isReservedPagePath,
  normalizePagePath,
  urlPathFromPageRel,
} from "../../scripts/cms-paths.mjs";
import {
  collectFolderPaths,
  crumbsForPath,
  listingItems,
  pageIsIndexed,
  parentPath,
  publicUrl,
  STATIC_PATH_LABELS,
  titleFromSlug,
} from "../../scripts/site-nav.mjs";

export interface CmsPage {
  path: string;
  title: string;
  eyebrow: string;
  description: string;
  content: string;
  indexed: boolean;
}

export type FolderListItem = {
  type: "page" | "folder";
  path: string;
  title: string;
  description: string;
  eyebrow: string;
};

export type Breadcrumb = {
  href: string;
  label: string;
  current: boolean;
};

const pageModules = import.meta.glob("../../site-pages/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function relFromGlobKey(filePath: string): string {
  const normalized = filePath.replaceAll("\\", "/");
  const marker = "/site-pages/";
  const idx = normalized.lastIndexOf(marker);
  if (idx === -1) return normalized.split("/").pop() ?? normalized;
  return normalized.slice(idx + marker.length);
}

function parsePage(rel: string, raw: string): CmsPage | null {
  const posix = rel.replaceAll("\\", "/");
  const fileName = posix.split("/").pop() ?? "";
  if (fileName.startsWith(".")) return null;
  const path = urlPathFromPageRel(rel);
  if (isReservedPagePath(path)) return null;
  const { data, content } = parseFrontmatter(raw);
  return {
    path,
    title: String(data.title ?? (path.replace(/^\//, "") || "Untitled")),
    eyebrow: String(data.eyebrow ?? ""),
    description: String(data.description ?? ""),
    content: content.trim(),
    indexed: pageIsIndexed(data),
  };
}

/** Published CMS pages, sorted by URL. */
export function getAllPages(): CmsPage[] {
  return Object.entries(pageModules)
    .map(([filePath, raw]) => parsePage(relFromGlobKey(filePath), raw))
    .filter((page): page is CmsPage => page != null)
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function getPageByPath(pathname: string): CmsPage | undefined {
  const path = normalizePagePath(pathname);
  return getAllPages().find((page) => page.path === path);
}

export function getListingItems(pathname: string): FolderListItem[] {
  const path = normalizePagePath(pathname);
  if (isReservedPagePath(path)) return [];
  return listingItems(path, getAllPages()) as FolderListItem[];
}

export function getFolderPaths(): string[] {
  return collectFolderPaths(getAllPages());
}

export function folderTitle(pathname: string): string {
  const path = normalizePagePath(pathname);
  const indexPage = getPageByPath(path);
  if (indexPage?.title) return indexPage.title;
  const slug = path.split("/").filter(Boolean).pop() ?? path;
  return titleFromSlug(slug);
}

function titleByPath(): Record<string, string> {
  const map: Record<string, string> = { ...STATIC_PATH_LABELS };
  for (const page of getAllPages()) {
    map[page.path] = page.title;
  }
  for (const folder of getFolderPaths()) {
    if (!map[folder]) map[folder] = folderTitle(folder);
  }
  return map;
}

export function breadcrumbsForPath(
  pathname: string,
  currentTitle?: string,
): Breadcrumb[] {
  const path = normalizePagePath(pathname);
  const labels = titleByPath();
  if (currentTitle) labels[path] = currentTitle;
  return crumbsForPath(path, labels) as Breadcrumb[];
}

export { parentPath, publicUrl, titleFromSlug };
