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
