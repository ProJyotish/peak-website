import { SITE } from "@/lib/site";

const STORAGE_KEY = "peak_landing_attribution";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const ONELINK_URL = SITE.stores.onelink;

export interface LandingAttribution {
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

const DEFAULT_ATTRIBUTION: LandingAttribution = {
  source: "website",
  medium: "cta",
  campaign: "homepage",
};

const REFERRER_SOURCES: [test: (host: string) => boolean, source: string][] = [
  [(h) => h.includes("instagram"), "instagram"],
  [(h) => h.includes("facebook") || h.startsWith("fb.") || h === "messenger.com", "facebook"],
  [(h) => h.includes("threads.net"), "threads"],
  [(h) => h.includes("youtube") || h === "youtu.be", "youtube"],
  [(h) => h.includes("reddit"), "reddit"],
  [(h) => h === "t.co" || h === "x.com" || h.endsWith(".x.com") || h.includes("twitter"), "x"],
  [(h) => h.includes("linkedin") || h === "lnkd.in", "linkedin"],
  [(h) => h === "t.me" || h.includes("telegram."), "telegram"],
  [(h) => h.includes("whatsapp") || h === "wa.me", "whatsapp"],
  [(h) => h.includes("google."), "google"],
  [(h) => h.includes("bing."), "bing"],
];

const SEARCH_SOURCES = new Set(["google", "bing"]);

/** Reads where this visit came from: explicit UTMs, then ad click ids, then the referrer. */
export function parseLandingAttribution(search: string, referrer: string): LandingAttribution | null {
  const q = new URLSearchParams(search);
  const source = q.get("utm_source")?.trim();
  if (source) {
    const pick = (k: string) => q.get(k)?.trim() || undefined;
    return {
      source,
      medium: pick("utm_medium"),
      campaign: pick("utm_campaign"),
      content: pick("utm_content"),
      term: pick("utm_term"),
    };
  }

  if (q.has("gclid") || q.has("gbraid") || q.has("wbraid")) return { source: "google", medium: "cpc" };
  if (q.has("fbclid")) return { source: fromReferrer(referrer) ?? "facebook", medium: "social" };
  if (q.has("twclid")) return { source: "x", medium: "social" };
  if (q.has("li_fat_id")) return { source: "linkedin", medium: "social" };

  const fromRef = fromReferrer(referrer);
  if (!fromRef) return null;
  return { source: fromRef, medium: SEARCH_SOURCES.has(fromRef) ? "organic" : "social" };
}

function fromReferrer(referrer: string): string | null {
  if (!referrer) return null;
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  if (host === SITE.domain || host.endsWith(`.${SITE.peakDomain}`) || host === SITE.peakDomain) return null;
  return REFERRER_SOURCES.find(([test]) => test(host))?.[1] ?? null;
}

/**
 * Stores this visit's source so it survives in-site navigation. Direct visits and internal
 * clicks leave a stored source alone (last non-direct touch wins).
 */
export function captureLandingAttribution(): void {
  if (typeof window === "undefined") return;
  const found = parseLandingAttribution(window.location.search, document.referrer);
  if (!found) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...found, at: Date.now() }));
  } catch {
    /* storage blocked (private mode / in-app browser) — links fall back to defaults */
  }
}

export function getLandingAttribution(): LandingAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { at, ...attr } = JSON.parse(raw) as LandingAttribution & { at: number };
    if (!attr.source || Date.now() - at > TTL_MS) return null;
    return attr;
  } catch {
    return null;
  }
}

function setOrDelete(params: URLSearchParams, key: string, value: string | undefined) {
  if (value) params.set(key, value);
  else params.delete(key);
}

function applyUtm(u: URL, attr: LandingAttribution, placement: string) {
  const p = u.searchParams;
  p.set("utm_source", attr.source);
  setOrDelete(p, "utm_medium", attr.medium);
  setOrDelete(p, "utm_campaign", attr.campaign);
  p.set("utm_content", attr.content ?? placement);
  setOrDelete(p, "utm_term", attr.term);
}

/**
 * Play Store only forwards the URL-encoded `referrer` param to the Install Referrer API —
 * top-level `utm_*` on a Play URL never reach the app.
 */
function applyPlayReferrer(u: URL, attr: LandingAttribution, placement: string) {
  const utm = new URL("https://x/");
  applyUtm(utm, attr, placement);
  u.searchParams.set("referrer", utm.searchParams.toString());
}

/**
 * OneLink param names: pid = media source, c = campaign. Without `af_web_dp` / `af_ios_url` the
 * template falls back to peaklife.me (a loop back to this site) on desktop and iOS, so both point
 * at the web app with UTMs, which is all the web app reads.
 */
function applyOneLink(u: URL, attr: LandingAttribution, placement: string) {
  const p = u.searchParams;
  p.set("pid", attr.source);
  setOrDelete(p, "af_channel", attr.medium);
  setOrDelete(p, "c", attr.campaign);
  p.set("af_ad", attr.content ?? placement);
  p.set("af_sub1", placement);
  const web = new URL(SITE.app);
  applyUtm(web, attr, placement);
  p.set("af_web_dp", web.toString());
  p.set("af_ios_url", web.toString());
}

type LinkKind = "web" | "play" | "onelink";

function kindOf(u: URL): LinkKind | null {
  if (`${u.protocol}//${u.host}` === SITE.app) return "web";
  if (u.host === "play.google.com") return "play";
  if (u.href.startsWith(ONELINK_URL)) return "onelink";
  return null;
}

function decorate(url: string, placement: string, attr: LandingAttribution): string {
  const u = new URL(url);
  const kind = kindOf(u);
  if (kind === "onelink") applyOneLink(u, attr, placement);
  else {
    applyUtm(u, attr, placement);
    if (kind === "play") applyPlayReferrer(u, attr, placement);
  }
  return u.toString();
}

/** Build-time link with the site's own attribution; rewritten at click time by `installAttributionLinks`. */
export function withUtm(
  url: string,
  content: string,
  { source, medium, campaign }: { source?: string; medium?: string; campaign?: string } = {},
): string {
  return decorate(url, content, {
    source: source ?? DEFAULT_ATTRIBUTION.source,
    medium: medium ?? DEFAULT_ATTRIBUTION.medium,
    campaign: campaign ?? DEFAULT_ATTRIBUTION.campaign,
  });
}

/** Android install CTA, routed through OneLink so AppsFlyer attributes the install. */
export function androidLink(content: string): string {
  return withUtm(ONELINK_URL, content);
}

/**
 * Prerendered HTML bakes in `utm_source=website`. Rewrite app / store links at click time so the
 * visitor's real source (e.g. instagram) is what the app receives.
 */
export function installAttributionLinks(): void {
  if (typeof document === "undefined") return;
  const rewrite = (e: Event) => {
    const attr = getLandingAttribution();
    if (!attr) return;
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    let u: URL;
    try {
      u = new URL(a.href);
    } catch {
      return;
    }
    if (!kindOf(u)) return;
    a.dataset.placement ??= u.searchParams.get("af_sub1") ?? u.searchParams.get("utm_content") ?? "link";
    const placement = a.dataset.placement;
    a.href = decorate(a.href, placement, attr);
  };
  document.addEventListener("click", rewrite, true);
  document.addEventListener("auxclick", rewrite, true);
}
