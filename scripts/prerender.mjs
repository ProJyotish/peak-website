/**
 * Build-time SSR for S3 + CloudFront.
 *
 * Vite emits a client bundle and an empty SPA shell. This script renders every
 * known React route to HTML (`dist/<path>/index.html`) so CloudFront's
 * directory rewrite (`/blog/` → `/blog/index.html`) serves real markup.
 * There is no Node origin — prerender only.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createServer } from "vite";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const templatePath = resolve(dist, "index.html");
const NOT_FOUND_PATH = "/404";

function applyHead(template, head) {
  let html = template;
  if (!head) return html.replace("<!--app-head-->", "");

  html = html.replace(/<title>[\s\S]*?<\/title>\s*/i, "");
  html = html.replace(/<meta\s+name="description"[^>]*>\s*/i, "");
  html = html.replace(/<meta\s+name="author"[^>]*>\s*/i, "");
  html = html.replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, "");
  html = html.replace(/<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, "");
  return html.replace("<!--app-head-->", head);
}

function distFileForRoute(url) {
  if (url === "/") return resolve(dist, "index.html");
  const trimmed = url.replace(/\/+$/, "");
  return resolve(dist, `${trimmed.slice(1)}/index.html`);
}

const template = readFileSync(templatePath, "utf8");
if (!template.includes("<!--app-head-->")) {
  throw new Error("dist/index.html is missing <!--app-head--> — rebuild the Vite client first.");
}

const vite = await createServer({
  root,
  configFile: resolve(root, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
  mode: "production",
  logLevel: "error",
});

try {
  const { render, collectPrerenderRoutes } = await vite.ssrLoadModule("/src/entry-server.tsx");
  const routes = collectPrerenderRoutes();

  for (const url of routes) {
    const { html, head } = render(url);
    const page = applyHead(template, head).replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`,
    );
    const file = distFileForRoute(url);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, page);
    console.log(`✓ SSR ${url === "/" ? "/" : url} → ${file.slice(dist.length + 1)}`);
  }

  const notFound = render(NOT_FOUND_PATH);
  const notFoundHtml = applyHead(template, notFound.head).replace(
    '<div id="root"></div>',
    `<div id="root">${notFound.html}</div>`,
  );
  writeFileSync(resolve(dist, "404.html"), notFoundHtml);
  console.log("✓ SSR 404.html");
  console.log(`\n✓ Prerendered ${routes.length} routes + 404.html`);
} finally {
  await vite.close();
}
