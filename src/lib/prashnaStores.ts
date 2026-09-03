import { SITE } from "@/lib/site";

function envUrl(key: string): string | null {
  const raw = import.meta.env[key] as string | undefined;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
}

/** Store URLs for the Prashna app — override via VITE_PRASHNA_* in env files. */
export function getPrashnaStoreUrls() {
  const android =
    envUrl("VITE_PRASHNA_ANDROID_URL") ?? SITE.prashna.stores.android;
  const ios = envUrl("VITE_PRASHNA_IOS_URL") ?? SITE.prashna.stores.ios;

  return {
    android,
    ios,
    hasAndroid: Boolean(android),
    hasIos: Boolean(ios),
  };
}
