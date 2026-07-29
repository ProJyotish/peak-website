/**
 * Serve `dist/` like GitHub Pages:
 * - directory URLs resolve to index.html
 * - missing paths fall back to 404.html (SPA shell)
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const dist = join(import.meta.dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
};

function safeJoin(root, reqPath) {
  const cleaned = decodeURIComponent(reqPath.split("?")[0].split("#")[0]);
  const full = normalize(join(root, cleaned));
  if (!full.startsWith(normalize(root))) return null;
  return full;
}

function resolveFile(urlPath) {
  let path = urlPath === "" ? "/" : urlPath;
  if (!path.startsWith("/")) path = `/${path}`;

  const candidates = [];
  if (path.endsWith("/")) {
    candidates.push(`${path}index.html`);
  } else if (!extname(path)) {
    candidates.push(`${path}/index.html`, `${path}.html`, path);
  } else {
    candidates.push(path);
  }

  for (const candidate of candidates) {
    const full = safeJoin(dist, candidate);
    if (full && existsSync(full) && statSync(full).isFile()) {
      return { file: full, fallback: false };
    }
  }

  return { file: join(dist, "404.html"), fallback: true };
}

createServer((req, res) => {
  const { file, fallback } = resolveFile(req.url || "/");
  try {
    const body = readFileSync(file);
    const type = MIME[extname(file)] || "application/octet-stream";
    // GitHub Pages returns 404 status with 404.html body for unknown paths
    res.writeHead(fallback ? 404 : 200, { "Content-Type": type });
    res.end(body);
  } catch {
    res.writeHead(500).end("Server error");
  }
}).listen(port, () => {
  console.log(`GitHub Pages–style static server`);
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://localhost:${port}/blog/`);
  console.log(`  http://localhost:${port}/blog/mars-in-7th-house/`);
  console.log(`  http://localhost:${port}/terms/`);
});
