/**
 * Shared Peak API base (Nest global prefix included).
 *
 * Examples:
 *   local:  http://localhost:3100/development
 *   prod:   https://api.peaklife.me/production
 *
 * Set via VITE_API_BASE_URL. Paths below are appended with a single `/`.
 */
const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";

export const API_BASE_URL = rawBase.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not set.");
  }
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${suffix}`;
}

/** Razorpay subscription create. Used by /checkout. */
export const SUBSCRIPTION_API_URL = API_BASE_URL
  ? apiUrl("/payments/razorpay/subscription")
  : "";

/** Unauthenticated public astro tools (travel-fit advise + legacy helpers). */
export const PUBLIC_ASTRO_API_URL = API_BASE_URL ? apiUrl("/public/astro") : "";
