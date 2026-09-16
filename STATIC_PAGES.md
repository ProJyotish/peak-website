# Static HTML for S3 + CloudFront

S3 cannot run a Node server. Peak still deploys a static `dist/` to S3; CloudFront
serves it. **SSR here means build-time prerender (SSG)** of the React app, then
client hydration. There is no Lambda origin.

## Build

`npm run build` does three things:

1. **Vite client build** — JS/CSS bundles and an SPA shell (`dist/index.html`)
2. **`scripts/prerender.mjs`** — `renderToString` every React route into
   `dist/<path>/index.html` with that page’s title, meta, and body HTML
3. **`scripts/postbuild.mjs`** — `/careers` (Apps Script form, no React route)
   and `sitemap.xml`

CloudFront’s viewer-request function maps `/blog/` → `/blog/index.html` (S3 REST
origins do not). Direct URL hits therefore get the prerendered React HTML, not an
empty `<div id="root">`.

## Generated files

| Route | Output |
|-------|--------|
| `/` | `dist/index.html` (homepage markup + hydrate) |
| `/product`, `/product/<slug>/` | prerendered product pages |
| `/blog`, `/blog/<slug>/` | prerendered from `posts/*.md` |
| `/<folder>/<slug>/` | prerendered from `site-pages/**/*.md` |
| `/terms`, `/privacy-policy`, `/contact`, … | prerendered React legal pages |
| `/checkout`, `/tools/astrocartography` | prerendered shells (interactive bits hydrate) |
| `/careers` | zero-JS form page from `scripts/careers.mjs` |
| `404.html` | prerendered not-found page |
| `/sitemap.xml` | regenerated every build |

## Careers

`/careers` is still a standalone HTML form (Google Apps Script). There is no
React route — link with `<a href="/careers/">`. Preview:

```bash
npm run build && npm run preview:pages
```

## Blog / CMS

Markdown under `posts/` and `site-pages/` is compiled into the Vite graph
(`import.meta.glob`). Prerender walks those files so a new `.md` becomes a
static HTML file on the next `npm run build`.

Reserved app routes (`/`, `/blog`, `/product`, `/checkout`, legal pages,
`/tools/astrocartography`, …) are skipped so CMS files cannot overwrite them.

## Development

`npm run dev` is client-only (empty root, `createRoot`). Prerender runs only
on production builds.
