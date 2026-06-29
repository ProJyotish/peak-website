# Static Page Generation for GitHub Pages

## Overview

This project uses a hybrid approach for GitHub Pages deployment:
- **Client-side routing** via React Router for navigation
- **Static pre-rendered HTML** files for SEO and faster initial loads

## How It Works

### Build Process

When you run `pnpm run build`, two things happen:

1. **Vite builds the SPA** - Creates the main React bundle
2. **postbuild.mjs script runs** - Generates static HTML files for key routes

### Generated Static Pages

The following routes get pre-rendered as static HTML files:

- `/terms` → `dist/terms/index.html`
- `/embed/terms` → `dist/embed/terms/index.html`
- `/privacy-policy` → `dist/privacy-policy/index.html`
- `/embed/privacy` → `dist/embed/privacy/index.html`
- `/delete-my-account` → `dist/delete-my-account/index.html`
- `/contact` → `dist/contact/index.html`

### Benefits

1. **SEO-friendly** - Search engines see proper HTML with correct titles
2. **Fast initial load** - No JavaScript execution needed for first paint
3. **GitHub Pages compatible** - Works with standard GH Pages hosting
4. **Still interactive** - Once JavaScript loads, full React app takes over

### How GitHub Pages Serves It

- Direct URL access (e.g., `peaklife.me/privacy-policy`) → Serves `privacy-policy/index.html`
- Navigation within app → React Router handles it client-side
- 404s → Falls back to `404.html` (copy of main `index.html`) → React Router handles it

## Adding New Static Routes

To add a new static route:

1. Add the route to `src/App.tsx` (React Router)
2. Add it to the `routes` array in `scripts/postbuild.mjs`
3. Build: `pnpm run build`

Example:

```javascript
// In scripts/postbuild.mjs
const routes = [
  // ... existing routes
  { path: "new-page/index.html", title: "New Page - Peak" },
];
```

## Deployment

Simply push to your GitHub Pages branch. The `dist/` folder contains everything needed:

```bash
pnpm run build
# Deploy dist/ folder to GitHub Pages
```

## Development

During development, use `pnpm run dev`. Static generation only runs during production builds.
