import { Marked } from "marked";

/** Returns the video id for any YouTube watch/short/embed/youtu.be URL, else null. */
export function youtubeIdFromUrl(href) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function escapeAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** True when the link renders as its own URL (an autolink), not as custom anchor text. */
function isBareLink(token) {
  const text = String(token.text ?? "").trim();
  const href = String(token.href ?? "");
  return text === href || text === href.replace(/^https?:\/\//, "");
}

function youtubeEmbedHtml(videoId) {
  return `<div class="blog-embed"><iframe src="https://www.youtube.com/embed/${escapeAttr(videoId)}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>\n`;
}

function figureHtml(src, alt) {
  const caption = alt ? `<figcaption>${escapeAttr(alt)}</figcaption>` : "";
  return `<figure class="blog-figure"><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy">${caption}</figure>\n`;
}

const markdown = new Marked({
  renderer: {
    paragraph(token) {
      const children = token.tokens ?? [];
      if (children.length === 1) {
        const [child] = children;
        if (child.type === "link") {
          const videoId = youtubeIdFromUrl(child.href);
          if (videoId && isBareLink(child)) return youtubeEmbedHtml(videoId);
        }
        if (child.type === "image") {
          return figureHtml(child.href, child.text ?? "");
        }
      }
      return `<p>${this.parser.parseInline(children)}</p>\n`;
    },
  },
});

/** Renders blog post markdown to the same HTML shape the React renderer produces. */
export function renderPostHtml(source) {
  return markdown.parse(String(source).trim(), { async: false });
}
