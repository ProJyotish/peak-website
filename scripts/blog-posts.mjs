import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import matter from "gray-matter";
import { renderPostHtml } from "./markdown.mjs";
import { toIsoDate } from "./sitemap.mjs";

const postsDir = resolve(import.meta.dirname, "..", "posts");

/**
 * Blog posts from `posts/*.md`, newest first.
 *
 * Unquoted YAML dates parse to `Date` objects, so `date` (the display string)
 * is a locale string like "Sun Aug 02 2026 05:30:00 GMT+0530". `toIsoDate`
 * rejects those on purpose, so keep the sitemap-safe form alongside it as
 * `isoDate` rather than re-deriving it from `date`.
 */
export function loadBlogPosts() {
  const fileNames = readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const raw = readFileSync(join(postsDir, fileName), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        isoDate: toIsoDate(data.date),
        category: String(data.category ?? ""),
        excerpt: String(data.excerpt ?? ""),
        content,
        html: renderPostHtml(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Blog entries in the shape `buildSitemapXml`/`writeSitemap` expect, with the
 * ISO date so every post keeps its `<lastmod>`.
 * @param {ReturnType<typeof loadBlogPosts>} [posts]
 */
export function blogSitemapEntries(posts = loadBlogPosts()) {
  return posts.map((post) => ({ slug: post.slug, date: post.isoDate }));
}
