# Static Page Generation for GitHub Pages

## Overview

This project generates **true static HTML pages** with actual content for GitHub Pages deployment. These pages work without JavaScript and are fully SEO-friendly.

## How It Works

### Build Process

When you run `pnpm run build`, two things happen:

1. **Vite builds the React SPA** - Creates the main React bundle
2. **postbuild.mjs script runs** - Generates standalone HTML files with actual content

### Generated Static Pages

The following routes are served as **pure HTML** with no JavaScript required:

- `/terms` → `dist/terms/index.html` (full Terms & Conditions content)
- `/privacy-policy` → `dist/privacy-policy/index.html` (full Privacy Policy content)
- `/delete-my-account` → `dist/delete-my-account/index.html` (account deletion info)
- `/contact` → `dist/contact/index.html` (contact information)

### Key Features

✅ **Zero JavaScript** - Pages render instantly without any JS execution  
✅ **Full content in HTML** - All text is in the HTML file, not loaded by React  
✅ **SEO-optimized** - Search engines can read and index all content  
✅ **Fast load times** - Static HTML loads in milliseconds  
✅ **Tailwind CSS** - Styled via CDN, no build required  
✅ **GitHub Pages ready** - Works perfectly with standard GH Pages hosting  

### How GitHub Pages Serves Them

- **Direct URL access** (e.g., `peaklife.me/terms`) → GitHub Pages serves the static `terms/index.html` file
- **Content is immediately visible** - No loading spinner, no JavaScript execution
- **React app still available** - Navigate to home page for the full React experience
- **404 fallback** - Unknown routes fall back to `404.html` (copy of main `index.html`)

## Benefits

1. **SEO-friendly** - Search engines see complete HTML with proper titles and content
2. **Instant load** - Static HTML renders immediately, no JavaScript parsing needed
3. **Works everywhere** - Even works with JavaScript disabled
4. **Lower bandwidth** - No need to download React bundle for simple pages
5. **Better Core Web Vitals** - Faster FCP, LCP, and TTI metrics

## Adding New Static Routes

To add a new static route:

1. Add the page configuration to the `pages` array in `scripts/postbuild.mjs`:

```javascript
{
  path: "new-page/index.html",
  title: "New Page - Peak",
  heading: "New Page",
  content: `
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Section Title</h2>
      <p class="text-gray-700 dark:text-gray-300">
        Your content here...
      </p>
    </section>
  `
}
```

2. Build: `pnpm run build`
3. The new page will be available at `peaklife.me/new-page`

## Content Management

To update page content:

1. Edit the content in `scripts/postbuild.mjs`
2. Rebuild: `pnpm run build`
3. Deploy the `dist/` folder

**Note:** These pages are separate from the React components. If you want dynamic React pages, use the regular React Router pages in `src/pages/`.

## Deployment

Simply push to your GitHub Pages branch. The `dist/` folder contains everything:

```bash
pnpm run build
# Deploy dist/ folder to GitHub Pages
```

## Development

During development, use `pnpm run dev` for the React app. Static generation only runs during production builds (`pnpm run build`).

## Styling

Static pages use:
- **Tailwind CSS** via CDN for styling
- **Dark mode support** via Tailwind's `dark:` classes
- **Responsive design** with container and prose classes

The styling is lightweight and doesn't require the full React bundle.
