import { Children, isValidElement, type ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { formatPostDate } from "@/lib/blog";

type BlogPostViewProps = {
  title: string;
  content: string;
  category: string;
  date: string;
};

function youtubeIdFromUrl(href: string): string | null {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/")[2] || null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function isBareMediaLink(href: string | undefined, children: ReactNode): boolean {
  if (!href) return false;
  const text = String(children ?? "").trim();
  return text === href || text === href.replace(/^https?:\/\//, "");
}

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="blog-embed">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

function BlogFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="blog-figure">
      <img src={src} alt={alt} loading="lazy" />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}

function isBlockChild(node: ReactNode): boolean {
  return (
    isValidElement(node) && (node.type === YouTubeEmbed || node.type === BlogFigure)
  );
}

const markdownComponents: Components = {
  a({ href, children, ...props }) {
    const videoId = href ? youtubeIdFromUrl(href) : null;
    if (videoId && isBareMediaLink(href, children)) {
      return <YouTubeEmbed videoId={videoId} />;
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
  p({ children }) {
    const only = Children.toArray(children);
    if (only.length === 1 && isBlockChild(only[0])) {
      return only[0];
    }
    return <p>{children}</p>;
  },
  img({ src, alt }) {
    if (!src) return null;
    return <BlogFigure src={src} alt={alt ?? ""} />;
  },
};

export function BlogPostView({ title, content, category, date }: BlogPostViewProps) {
  return (
    <article>
      <header className="mb-10">
        {category ? <p className="eyebrow mb-4">{category}</p> : null}
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">{title}</h1>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
          {formatPostDate(date)}
        </p>
      </header>
      <div className="blog-prose">
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
