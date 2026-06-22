import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// GitHub Pages serves 404.html for unknown paths while keeping the URL.
// Copying the built SPA shell lets React Router handle /privacy, /terms, etc.
const dist = resolve(import.meta.dirname, "..", "dist");
copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
