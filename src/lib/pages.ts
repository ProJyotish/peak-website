import { parseFrontmatter } from "./frontmatter";
import {
  isReservedPagePath,
  normalizePagePath,
  urlPathFromPageRel,
} from "../../scripts/cms-paths.mjs";

export interface CmsPage {
  path: string;
  title: string;
  eyebrow: string;
  description: string;
  content: string;
}

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
