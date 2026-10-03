import type { QueryClient } from "@tanstack/react-query";
import { POOJA_API_URL } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { trackEvent } from "@/lib/tracking";

export type PoojaImage = { url: string; altText: string | null };

export type PoojaVariant = {
  id: string;
  numericId: string;
  title: string;
  price: number;
  sku: string | null;
};

export type Pooja = {
  id: string;
  slug: string;
  title: string;
  titleHi: string | null;
  descriptionHtml: string;
  images: PoojaImage[];
  variantId: string;
  numericVariantId: string;
  price: number;
  currency: string;
  brahmins: number | null;
  tags: string[];
  bookable: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: string;
};

export type PoojaAddon = {
  id: string;
  slug: string;
  title: string;
  titleHi: string | null;
  descriptionHtml: string;
  image: PoojaImage | null;
  optionName: string;
  variants: PoojaVariant[];
  currency: string;
};

export type PoojaCatalog = { pujas: Pooja[]; addons: PoojaAddon[]; generatedAt: string };

export type PoojaSlot = { startTime: string; durationMinutes: number; available: boolean };
export type PoojaSlotDay = { date: string; slots: PoojaSlot[] };
export type PoojaSlots = { mode: "appointo" | "manual"; timezone: string; days: PoojaSlotDay[] };

export const PREFERRED_WINDOWS = ["Morning", "Afternoon", "Evening"] as const;
export type PreferredWindow = (typeof PREFERRED_WINDOWS)[number];

/** What the visitor picked; exactly one of startTime / preferred* is set. */
export type PoojaSchedule =
  | { mode: "appointo"; startTime: string }
  | { mode: "manual"; preferredDate: string; preferredWindow: PreferredWindow };

export type SelectedAddon = { addonId: string; variantId: string; quantity: number };

export type PoojaCheckoutInput = {
  slug: string;
  startTime?: string;
  preferredDate?: string;
  preferredWindow?: string;
  addons: Array<{ variantId: string; quantity: number }>;
  phone: string;
  email?: string;
  name?: string;
  /** Pandit / discount code (Shopify discount code, optionally linked to a pandit). */
  code?: string;
};

export type PoojaCodeInput = {
  code: string;
  slug: string;
  addons: Array<{ variantId: string; quantity: number }>;
};

/** A validated code: the linked pandit (if any) and the discount Shopify applies to this cart. */
export type PoojaCodeResult = {
  code: string;
  panditName: string | null;
  discountAmount: number;
  currency: string;
};

export type PoojaCheckoutResult = {
  invoiceUrl: string;
  bookingRef: string;
  draftOrderName: string;
  total: { amount: number; currency: string };
};

export type PoojaDetailsFields = {
  devoteeName: string;
  gotra: string;
  place: string;
  purpose: string;
};

export type PoojaOrderDetails = {
  orderName: string;
  pujaTitle: string;
  slotLabel: string | null;
  scheduleMode: "appointo" | "manual";
  addons: Array<{ title: string; variantTitle: string | null; quantity: number; price: string }>;
  detailsStatus: "pending" | "submitted";
  details: { [K in keyof PoojaDetailsFields]: string | null };
};

type Envelope<T> = { success: boolean; data?: T; message?: string | string[] };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!POOJA_API_URL) throw new Error("VITE_API_BASE_URL is not set.");
  const res = await fetch(`${POOJA_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const json = (await res.json().catch(() => ({}))) as Envelope<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    const msg = Array.isArray(json.message) ? json.message[0] : json.message;
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return json.data;
}

export const poojaKeys = {
  catalog: ["pooja-catalog"] as const,
  detail: (slug: string) => ["pooja", slug] as const,
};

/** Prerender: put the build-time catalog where `/pooja` and `/pooja/:slug` read it. */
export function seedPoojaQueries(client: QueryClient, catalog: PoojaCatalog, url: string) {
  const updatedAt = Date.parse(catalog.generatedAt) || Date.now();
  const path = url.replace(/\/+$/, "") || "/";
  if (path === ROUTES.pooja) {
    client.setQueryData(poojaKeys.catalog, catalog, { updatedAt });
    return;
  }
  const puja = catalog.pujas.find((p) => ROUTES.poojaPage(p.slug) === path);
  if (puja) client.setQueryData(poojaKeys.detail(puja.slug), { puja, addons: catalog.addons }, { updatedAt });
}

export const fetchPoojaCatalog = () => request<PoojaCatalog>("/catalog");

export const fetchPooja = (slug: string) =>
  request<{ puja: Pooja; addons: PoojaAddon[] }>(`/${encodeURIComponent(slug)}`);

/** With a pandit code, only that pandit's Appointo slots are returned. */
export const fetchPoojaSlots = (slug: string, code?: string | null) =>
  request<PoojaSlots>(`/${encodeURIComponent(slug)}/slots${code ? `?code=${encodeURIComponent(code)}` : ""}`);

export const checkPoojaCode = (input: PoojaCodeInput) =>
  request<PoojaCodeResult>("/code", { method: "POST", body: JSON.stringify(input) });

const CODE_STORAGE_KEY = "peak_pooja_code";

export function normalizePoojaCode(raw: string | null | undefined): string | null {
  const code = (raw ?? "").trim().toUpperCase();
  return /^[A-Z0-9_-]{2,40}$/.test(code) ? code : null;
}

/** A code from a partner link (`?code=`) is kept for the session so it survives navigation. */
export function rememberPoojaCode(code: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (code) window.sessionStorage.setItem(CODE_STORAGE_KEY, code);
    else window.sessionStorage.removeItem(CODE_STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode); the URL param still works.
  }
}

export function rememberedPoojaCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return normalizePoojaCode(window.sessionStorage.getItem(CODE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export const createPoojaCheckout = (input: PoojaCheckoutInput) =>
  request<PoojaCheckoutResult>("/checkout", { method: "POST", body: JSON.stringify(input) });

export const fetchPoojaDetails = (token: string) =>
  request<PoojaOrderDetails>(`/details/${encodeURIComponent(token)}`);

export const submitPoojaDetails = (token: string, fields: PoojaDetailsFields) =>
  request<PoojaOrderDetails>(`/details/${encodeURIComponent(token)}`, {
    method: "POST",
    body: JSON.stringify(fields),
  });

export function formatMoney(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** Merchandising/tax tags on every puja product; not meaningful as visitor filters. */
const INTERNAL_TAG_RE = /^(brahmins?-\d+|gst[\s-]?\d*|puja|pooja|digital[\s-]puja|puja-addon)$/i;

/** Festival/occasion tags shown as filters. */
export function occasionTags(puja: Pooja): string[] {
  return puja.tags.filter((t) => !INTERNAL_TAG_RE.test(t.trim()));
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };

/** Plain text from Shopify description HTML; regex-based so it runs during prerender (no DOM). */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e: string) => ENTITIES[e])
    .replace(/\s+/g, " ")
    .trim();
}

export function poojaSeoTitle(puja: Pooja): string {
  return puja.seoTitle || `${puja.title} · Book Online · Peak`;
}

export function poojaSeoDescription(puja: Pooja): string {
  if (puja.seoDescription) return puja.seoDescription;
  const text = htmlToText(puja.descriptionHtml);
  if (!text) return `Book ${puja.title} online, performed by Brahmins and joined live on video.`;
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}…` : text;
}

/** Product + Offer and breadcrumb structured data for a pooja page. */
export function poojaJsonLd(puja: Pooja): unknown[] {
  const url = absoluteUrl(ROUTES.poojaPage(puja.slug));
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: puja.title,
      ...(puja.titleHi ? { alternateName: puja.titleHi } : {}),
      description: poojaSeoDescription(puja),
      image: puja.images.map((i) => i.url),
      url,
      brand: { "@type": "Brand", name: "Peak" },
      offers: {
        "@type": "Offer",
        price: puja.price,
        priceCurrency: puja.currency,
        availability: "https://schema.org/InStock",
        url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Pooja", item: absoluteUrl(ROUTES.pooja) },
        { "@type": "ListItem", position: 3, name: puja.title, item: url },
      ],
    },
  ];
}

/** GA4 + PostHog in one call. */
export function trackPooja(
  event: "pooja_view" | "pooja_addon_selected" | "pooja_checkout_started" | "pooja_code_applied",
  props: Record<string, string | number | boolean | undefined>,
) {
  trackEvent(event, props);
  if (typeof window !== "undefined") window.posthog?.capture?.(event, props);
}
