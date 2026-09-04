import { SITE } from "@/lib/site";

function envUrl(key: string): string | null {
  const raw = import.meta.env[key] as string | undefined;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
}

/** Store URLs for PeakLife Horary — override via VITE_HORARY_* in env files. */
export function getHoraryStoreUrls() {
  const android =
    envUrl("VITE_HORARY_ANDROID_URL") ??
    envUrl("VITE_PRASHNA_ANDROID_URL") ??
    SITE.horary.stores.android;
  const ios =
    envUrl("VITE_HORARY_IOS_URL") ??
    envUrl("VITE_PRASHNA_IOS_URL") ??
    SITE.horary.stores.ios;

  return {
    android,
    ios,
    hasAndroid: Boolean(android),
    hasIos: Boolean(ios),
  };
}
