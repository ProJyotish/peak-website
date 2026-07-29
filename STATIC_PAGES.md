# Static Page Generation for GitHub Pages

## Overview

This project generates **true static HTML pages** with actual content for GitHub Pages deployment. These pages work without JavaScript and are fully SEO-friendly.

This is **SSG (static site generation)** at build time — not Node SSR. GitHub Pages serves the prebuilt HTML files directly.

## How It Works

### Build Process

When you run `npm run build`, two things happen:

1. **Vite builds the React SPA** — Creates the main React bundle (`dist/index.html` + assets)
2. **`scripts/postbuild.mjs` runs** — Generates standalone HTML files with actual content

### Generated Static Pages

The following routes are served as **pure HTML** with no JavaScript required:

| Route | Output |
|-------|--------|
| `/terms` | `dist/terms/index.html` |
| `/privacy-policy` | `dist/privacy-policy/index.html` |
| `/delete-my-account` | `dist/delete-my-account/index.html` |
| `/contact` | `dist/contact/index.html` |
| `/blog` | `dist/blog/index.html` (post listing) |
| `/blog/<slug>/` | `dist/blog/<slug>/index.html` (from `posts/*.md`) |

Also copied:

- `dist/404.html` — SPA fallback for client-side routes (e.g. `/checkout`)

### Blog workflow

1. Add a Markdown file under `posts/` with frontmatter:

```markdown
---
title: Your Title
date: 2026-07-29
category: Saturn
excerpt: One-line summary for the listing and meta description.
---

Your markdown body…
```

2. Build / push:

```bash
npm run build
# or: git add posts/… && git commit && git push
```

3. Postbuild reads every `posts/*.md` via `gray-matter` + `marked` and writes static HTML under `dist/blog/`.

The React app still has `/blog` and `/blog/:slug` for in-app navigation; direct URL hits on GitHub Pages get the static HTML first.

### Key Features

- **Zero JavaScript** on static content pages — HTML renders immediately
- **Full content in HTML** — searchable / indexable
- **Peak theme** — parchment background, Fraunces / Inter / JetBrains Mono, gold accents
- **GitHub Pages ready** — standard `dist/` deploy

### How GitHub Pages Serves Them

- **Direct URL** (e.g. `peaklife.me/blog/mars-in-7th-house/`) → serves `blog/mars-in-7th-house/index.html`
- **Home** → Vite SPA shell (`index.html`)
- **Unknown SPA routes** (e.g. checkout) → `404.html` fallback

## Out of scope (SPA only)

- `/` homepage — interactive marketing page
- `/checkout` — Razorpay + query params

## Development

Use `npm run dev` for the React app. Static generation runs only on production builds (`npm run build`).
