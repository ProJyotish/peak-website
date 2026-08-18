import { parseFrontmatter } from "./frontmatter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

const postModules = import.meta.glob("../../posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function slugFromPath(filePath: string): string {
  const fileName = filePath.split("/").pop() ?? filePath;
  return fileName.replace(/\.md$/, "");
}

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    excerpt: String(data.excerpt ?? ""),
    content: content.trim(),
  };
}

/** All posts, newest first. */
export function getAllPosts(): BlogPost[] {
  return Object.entries(postModules)
    .map(([path, raw]) => parsePost(slugFromPath(path), raw))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const entry = Object.entries(postModules).find(([path]) => slugFromPath(path) === slug);
  if (!entry) return undefined;
  return parsePost(slug, entry[1]);
}

export function getAllSlugs(): string[] {
  return Object.keys(postModules).map(slugFromPath);
}

export function formatPostDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
