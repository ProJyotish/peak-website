/** Which marketing site this build targets. Set via `VITE_SITE=peak|horary`. */
export type SiteId = "peak" | "horary";

const raw = (import.meta.env.VITE_SITE as string | undefined)?.trim().toLowerCase();

export const SITE_ID: SiteId = raw === "horary" ? "horary" : "peak";

export const isHorarySite = SITE_ID === "horary";
export const isPeakSite = SITE_ID === "peak";
