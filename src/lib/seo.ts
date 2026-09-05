import { SITE } from "@/lib/site";

/** Shared SEO terms for every product page. */
export const PRODUCT_SEO_KEYWORDS = [
  "daily horoscope",
  "personalized horoscope",
  "kundali",
  "kundli",
  "rashi",
  "birth chart",
  "vedic astrology chart",
  "astrology chat",
  "AI astrology",
  "jyotish",
  "personalized astrology",
  "online kundali",
  "rashi chart",
] as const;

export type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  /** Open Graph type — defaults to website */
  type?: "website" | "article";
  /** Absolute or root-relative og:image path. Omitted when a page has no card image. */
  image?: string;
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `https://${SITE.domain}${normalized === "/" ? "" : normalized}`;
}

export function keywordsToString(keywords: string[]): string {
  return [...new Set(keywords.map((k) => k.trim()).filter(Boolean))].join(", ");
}

export function productSeoKeywords(...pageTerms: string[]): string[] {
  return [...PRODUCT_SEO_KEYWORDS, ...pageTerms];
}
