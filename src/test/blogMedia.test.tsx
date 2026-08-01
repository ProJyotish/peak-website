import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogPostView } from "@/components/site/BlogPostView";
import { renderPostHtml } from "../../scripts/markdown.mjs";

const BARE_URL = "https://www.youtube.com/watch?v=QXGSVFYdJAw";
const EMBED_SRC = "https://www.youtube.com/embed/QXGSVFYdJAw";

const post = [
  `${BARE_URL}`,
  "",
  `Linked (not embedded): [this Saturn overview](${BARE_URL}).`,
  "",
  "![Peak mark](/placeholder.svg)",
].join("\n");

function renderPost(content: string) {
  return render(
    <BlogPostView title="Saturn" content={content} category="Saturn" date="2026-07-24" />,
  );
}

describe("static post rendering", () => {
  it("embeds a bare YouTube URL", () => {
    const html = renderPostHtml(post);
    expect(html).toContain(`<div class="blog-embed"><iframe src="${EMBED_SRC}"`);
  });

  it("keeps an anchored YouTube link as a link", () => {
    const html = renderPostHtml(post);
    expect(html).toContain(`<a href="${BARE_URL}">this Saturn overview</a>`);
  });

  it("wraps a standalone image in a figure", () => {
    const html = renderPostHtml(post);
    expect(html).toContain('<figure class="blog-figure"><img src="/placeholder.svg"');
    expect(html).toContain("<figcaption>Peak mark</figcaption>");
  });
});

describe("BlogPostView", () => {
  it("embeds a bare YouTube URL", () => {
    const { container } = renderPost(post);
    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toBe(EMBED_SRC);
    expect(container.querySelector("p .blog-embed")).toBeNull();
  });

  it("keeps an anchored YouTube link as a link", () => {
    renderPost(post);
    expect(screen.getByRole("link", { name: "this Saturn overview" })).toHaveAttribute(
      "href",
      BARE_URL,
    );
  });

  it("wraps a standalone image in a figure", () => {
    const { container } = renderPost(post);
    expect(container.querySelector("figure.blog-figure img")).toHaveAttribute(
      "src",
      "/placeholder.svg",
    );
    expect(container.querySelector("p figure")).toBeNull();
  });
});
