import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  INDEXNOW_KEY,
  INDEXNOW_HOST,
  chunkUrls,
  collectIndexNowUrls,
  indexNowKeyLocation,
  submitIndexNow,
  urlsFromSitemapXml,
} from "../../scripts/indexnow.mjs";
import { buildSitemapXml } from "../../scripts/sitemap.mjs";

const root = resolve(__dirname, "../..");
const keyFile = resolve(root, "public", `${INDEXNOW_KEY}.txt`);

describe("IndexNow key file", () => {
  it("is published at the site root with the key as its only content", () => {
    expect(existsSync(keyFile), `missing ${keyFile}`).toBe(true);
    expect(readFileSync(keyFile, "utf8").trim()).toBe(INDEXNOW_KEY);
  });

  it("points keyLocation at the root key URL", () => {
    expect(indexNowKeyLocation()).toBe(
      `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    );
  });
});

describe("IndexNow URL collection", () => {
  it("parses every <loc> from sitemap XML", () => {
    const xml = buildSitemapXml([]);
    const urls = urlsFromSitemapXml(xml);
    expect(urls.length).toBeGreaterThan(10);
    expect(urls.every((u) => u.startsWith(`https://${INDEXNOW_HOST}/`))).toBe(true);
    expect(urls).toContain(`https://${INDEXNOW_HOST}/`);
  });

  it("collects the live sitemap set (dist or generated)", () => {
    const urls = collectIndexNowUrls();
    expect(urls.length).toBeGreaterThan(10);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("chunks under the IndexNow 10k limit", () => {
    const urls = Array.from({ length: 10_005 }, (_, i) => `https://peaklife.me/p/${i}/`);
    const chunks = chunkUrls(urls);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(10_000);
    expect(chunks[1]).toHaveLength(5);
  });
});

describe("IndexNow submit payload", () => {
  it("POSTs host, key, keyLocation, and urlList", async () => {
    /** @type {RequestInit | undefined} */
    let init;
    const fetchImpl = async (_url: string, options?: RequestInit) => {
      init = options;
      return {
        status: 200,
        text: async () => "",
      };
    };

    const result = await submitIndexNow([`https://${INDEXNOW_HOST}/blog/`], {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    const body = JSON.parse(String(init?.body));
    expect(body).toEqual({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: indexNowKeyLocation(),
      urlList: [`https://${INDEXNOW_HOST}/blog/`],
    });
  });
});
