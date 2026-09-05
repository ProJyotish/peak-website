import { useEffect } from "react";
import type { PageSeo } from "@/lib/seo";
import { absoluteUrl, keywordsToString } from "@/lib/seo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Updates document title + meta tags for the active route (SPA SEO). */
export function SeoHead({ title, description, keywords, path, type = "website", image }: PageSeo) {
  const keywordsCsv = keywordsToString(keywords);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywordsCsv);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", absoluteUrl(path));
    if (image) {
      upsertMeta("property", "og:image", absoluteUrl(image));
      upsertMeta("name", "twitter:card", "summary_large_image");
    }
    upsertLink("canonical", absoluteUrl(path));

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, keywordsCsv, path, type, image]);

  return null;
}
