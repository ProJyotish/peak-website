/**
 * Build-time snapshot of the Shopify pooja catalog (served by the Peak API).
 *
 * prerender.mjs fetches it once and renders `/pooja` + one page per puja from it;
 * postbuild.mjs reads the same snapshot for sitemap entries. The API triggers a
 * redeploy (repository_dispatch `shopify-catalog-changed`) when the catalog changes.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { loadEnv } from "vite";

const root = resolve(import.meta.dirname, "..");
const SNAPSHOT = resolve(root, "node_modules/.cache/peak/pooja-catalog.json");
const EMPTY = { pujas: [], addons: [], generatedAt: null };
const TIMEOUT_MS = 90_000;

function apiBase() {
  const env = { ...loadEnv("production", root, "VITE_"), ...process.env };
  return String(env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
}

function writeSnapshot(catalog) {
  mkdirSync(dirname(SNAPSHOT), { recursive: true });
  writeFileSync(SNAPSHOT, JSON.stringify(catalog));
}

/**
 * With POOJA_CATALOG_REQUIRED=1 (CI) a failed fetch aborts the build: the deploy runs
 * `s3 sync --delete`, so building without the catalog would take every pooja page offline.
 */
export async function fetchPoojaCatalog() {
  const required = process.env.POOJA_CATALOG_REQUIRED === "1";
  try {
    const base = apiBase();
    if (!base) throw new Error("VITE_API_BASE_URL is not set");
    const res = await fetch(`${base}/public/pooja/catalog`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success || !Array.isArray(json.data?.pujas)) {
      throw new Error(`catalog request failed (${res.status})`);
    }
    writeSnapshot(json.data);
    return json.data;
  } catch (error) {
    if (required) throw new Error(`Pooja catalog unavailable: ${error.message}`);
    console.warn(`⚠ Pooja catalog unavailable (${error.message}); building without pooja detail pages.`);
    writeSnapshot(EMPTY);
    return EMPTY;
  }
}

export function readPoojaCatalog() {
  return existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, "utf8")) : EMPTY;
}

/** @returns {{ slug: string, lastmod?: string }[]} */
export function poojaSitemapEntries(catalog = readPoojaCatalog()) {
  return catalog.pujas.map((p) => ({ slug: p.slug, lastmod: p.updatedAt }));
}
