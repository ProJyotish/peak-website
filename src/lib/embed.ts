/**
 * Embedded in the Peak app's Store tab (a WebView). The app loads pages with `?embed=app`; the inline
 * script at the top of `index.html` turns that into `<html data-embed="app">` before first paint.
 * Style for it with the Tailwind `app:` variant (e.g. `app:hidden`) rather than branching in React,
 * so prerendered markup and hydration stay identical.
 *
 * Keep the param in sync with `storeEmbedParam` / `storeEmbedValue` in PeakFlutter
 * (`lib/features/store/store_provider.dart`).
 */
export function isAppEmbed(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.embed === "app";
}

export type AppContact = { name: string; phone: string };

/**
 * The signed-in app user's name and phone, for prefilling checkout. The app sends them in the url
 * fragment; the inline script in `index.html` stores them here and strips them from the url.
 * Browser-only — read it after mount so prerendered markup still hydrates.
 */
export function appContact(): AppContact | null {
  try {
    const raw = sessionStorage.getItem("peak_contact");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AppContact>;
    return { name: String(parsed.name ?? "").trim(), phone: String(parsed.phone ?? "").trim() };
  } catch {
    return null;
  }
}
