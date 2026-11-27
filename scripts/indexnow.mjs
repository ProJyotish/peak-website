/**
 * Submit sitemap URLs to IndexNow (Bing, Yandex, Naver, Seznam, Yep, Amazon).
 * Key file must be live at https://{host}/{key}.txt before engines accept submissions.
 *
 * Usage:
 *   node scripts/indexnow.mjs              # all sitemap URLs
 *   node scripts/indexnow.mjs --dry-run    # print URLs, no POST
 *   INDEXNOW_SKIP=1 …                      # no-op (e.g. local/preview)
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { blogSitemapEntries } from "./blog-posts.mjs";
import { buildSitemapXml } from "./sitemap.mjs";

const root = resolve(import.meta.dirname, "..");

export const INDEXNOW_KEY = "7cab862026f94235a475cec5a4a18367";
export const INDEXNOW_HOST = "peaklife.me";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_BATCH_SIZE = 10_000;

const KEY_FILE_NAME = `${INDEXNOW_KEY}.txt`;

export function indexNowKeyLocation(host = INDEXNOW_HOST) {
  return `https://${host}/${KEY_FILE_NAME}`;
}

/** Parse <loc> values from sitemap XML. */
export function urlsFromSitemapXml(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter(Boolean);
}

/**
 * Prefer freshly built dist/sitemap.xml; fall back to generating from source.
 * @param {{ domain?: string, sitemapPath?: string }} [opts]
 */
export function collectIndexNowUrls(opts = {}) {
  const domain = opts.domain || INDEXNOW_HOST;
  const sitemapPath = opts.sitemapPath || resolve(root, "dist", "sitemap.xml");

  if (existsSync(sitemapPath)) {
    return urlsFromSitemapXml(readFileSync(sitemapPath, "utf8"));
  }

  return urlsFromSitemapXml(
    buildSitemapXml(blogSitemapEntries(), { domain }),
  );
}

/**
 * @param {string[]} urls
 * @param {number} [size]
 */
export function chunkUrls(urls, size = INDEXNOW_BATCH_SIZE) {
  const chunks = [];
  for (let i = 0; i < urls.length; i += size) {
    chunks.push(urls.slice(i, i + size));
  }
  return chunks;
}

/**
 * @param {string[]} urlList
 * @param {{ host?: string, key?: string, endpoint?: string, fetchImpl?: typeof fetch }} [opts]
 */
export async function submitIndexNow(urlList, opts = {}) {
  const host = opts.host || INDEXNOW_HOST;
  const key = opts.key || INDEXNOW_KEY;
  const endpoint = opts.endpoint || INDEXNOW_ENDPOINT;
  const fetchImpl = opts.fetchImpl || globalThis.fetch;

  if (!urlList.length) {
    return { status: 0, skipped: true, reason: "empty urlList" };
  }

  const body = {
    host,
    key,
    keyLocation: indexNowKeyLocation(host),
    urlList,
  };

  const res = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  return {
    status: res.status,
    ok: res.status === 200 || res.status === 202,
    body: text.slice(0, 500),
    count: urlList.length,
  };
}

/**
 * Poll until the key file is publicly readable (needed right after CloudFront sync).
 * @param {{ host?: string, attempts?: number, delayMs?: number, fetchImpl?: typeof fetch }} [opts]
 */
export async function waitForIndexNowKey(opts = {}) {
  const host = opts.host || INDEXNOW_HOST;
  const attempts = opts.attempts ?? 12;
  const delayMs = opts.delayMs ?? 5_000;
  const fetchImpl = opts.fetchImpl || globalThis.fetch;
  const keyUrl = indexNowKeyLocation(host);

  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetchImpl(keyUrl, { method: "GET", redirect: "follow" });
      const text = (await res.text()).trim();
      if (res.ok && text === (opts.key || INDEXNOW_KEY)) {
        console.log(`✓ IndexNow key live at ${keyUrl}`);
        return true;
      }
      console.log(
        `IndexNow key check ${i}/${attempts}: HTTP ${res.status}, body mismatch or empty`,
      );
    } catch (err) {
      console.log(`IndexNow key check ${i}/${attempts}: ${err.message || err}`);
    }
    if (i < attempts) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error(`IndexNow key not reachable at ${keyUrl} after ${attempts} attempts`);
}

/**
 * Submit every URL in batches. Throws if any batch fails (not 200/202).
 * @param {{ dryRun?: boolean, waitKey?: boolean, urls?: string[], host?: string }} [opts]
 */
export async function submitAllIndexNow(opts = {}) {
  if (process.env.INDEXNOW_SKIP === "1") {
    console.log("IndexNow skipped (INDEXNOW_SKIP=1)");
    return { skipped: true, submitted: 0 };
  }

  const urls = opts.urls ?? collectIndexNowUrls({ domain: opts.host || INDEXNOW_HOST });
  const unique = [...new Set(urls)];
  console.log(`IndexNow: ${unique.length} URL(s) for ${opts.host || INDEXNOW_HOST}`);

  if (opts.dryRun) {
    for (const u of unique) console.log(`  ${u}`);
    return { dryRun: true, submitted: 0, urls: unique };
  }

  if (opts.waitKey) {
    await waitForIndexNowKey({ host: opts.host });
  }

  const results = [];
  for (const batch of chunkUrls(unique)) {
    const result = await submitIndexNow(batch, { host: opts.host });
    results.push(result);
    if (!result.ok) {
      const err = new Error(
        `IndexNow failed HTTP ${result.status}: ${result.body || "(empty body)"}`,
      );
      err.result = result;
      throw err;
    }
    console.log(
      `✓ IndexNow accepted ${result.count} URL(s) (HTTP ${result.status})`,
    );
  }

  return { submitted: unique.length, results };
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  const dryRun = process.argv.includes("--dry-run");
  const waitKey = process.argv.includes("--wait-key");
  try {
    const out = await submitAllIndexNow({ dryRun, waitKey });
    if (out.dryRun) {
      console.log(`(dry-run) ${out.urls.length} URL(s)`);
    } else if (!out.skipped) {
      console.log(`✓ Submitted ${out.submitted} URL(s) to IndexNow`);
    }
  } catch (err) {
    console.error(err.message || err);
    process.exitCode = 1;
  }
}
