# Peak homepage

Static build of the peaklife.me homepage. No framework, no build step. Open
`index.html` and it runs.

Source of truth for the design is the **Peak Design System** on claude.ai/design,
project *Peak Design System*. The page is authored there at
`ui_kits/peak-web/Home.html`. This folder is the deployable copy.

## Structure

```
index.html                  the whole page
assets/css/peak.css         design-system tokens, copied verbatim
assets/img/screen-*.jpg     real app screenshots, status bars cropped
assets/img/nav-arrow.svg    the navigator mark, used as a CSS mask
assets/img/favicon.svg      the navigator mark, gold
assets/img/og.png           1200x630 social share card
robots.txt, sitemap.xml
.nojekyll                   so GitHub Pages serves the folder as-is
```

## Before this goes live

1. **Google Play asset, read this before launch.** The Android button currently uses the
   **Google Play logo** (`assets/img/google-play-logo.png`), the official asset, unaltered,
   placed inside our own button next to the words "Get the app on Google Play".
   That is a defensible use: the logo identifies the service.

   It is **not** the badge Google's guidelines ask for on a store link. That is the
   "Get it on Google Play" badge, the whole button in one asset, from
   `play.google.com/intl/en_us/badges/`. Before this goes to production, download it and
   replace the entire first `.store-btn` anchor with the badge image alone, at Google's
   minimum size and with their required clear space. Do not redraw it, do not recolour it,
   do not put it on a coloured chip.

2. **Abhimanyu's headshot.** Nishant's is in (`founder-nishant.jpg`). Abhimanyu is still a
   lettered circle. Drop a square photo into `assets/img/` as `founder-abhimanyu.jpg` and
   swap his `.founder__portrait` div for the same `<img class="founder__portrait
   founder__portrait--photo">` markup Nishant uses.
3. **Two dead links.** "read his jyotisha journey" and "view his linkedin" are `#`.
4. **Testimonials** are attributed "Verified user". Confirm that, or use first name and
   city.
5. **Footer links** (Product, Contact, Privacy, Terms) are `#`. Point them at the real
   pages when they exist.

## Deploying as a test site

Push this folder to a repo and turn on GitHub Pages.

Two things to change first, or the test site will fight the live one:

- **Do not add a `CNAME` file.** The existing `peak-website` repo has one for
  `peaklife.me`. Two repos claiming the same domain will break the live site.
- **Fix the absolute URLs.** `index.html` has `og:url`, `og:image` and `<link rel=canonical>`
  pointing at `https://peaklife.me/`, plus `sitemap.xml` and `robots.txt`. For a test
  deploy at `username.github.io/repo`, either update them or accept that previews and
  canonical will point at production. If the test site is public, also add
  `<meta name="robots" content="noindex">` to the head so it does not get indexed
  alongside the real site.

Serving locally: `python3 -m http.server` in this folder. Use a server, not
`file://` — the CSS mask on the step arrows will not load over `file://`.

## Notes on the build

- **No raw colours in the page.** Every colour, radius, shadow and gradient is a token
  from `peak.css`. Do not hand-edit values there; it is a copy of the design system.
  Change a colour in Claude Design and re-copy, or the site and the app drift.
- **Fonts** load from Google Fonts (Fraunces, Lato). The design system ships local
  Fraunces TTFs instead. That is the only intentional difference between this build and
  the design-system version.
- **The Today frame parallaxes.** It holds a full scrolling capture, taller than the
  phone frame, eased through as the section passes. Disabled under
  `prefers-reduced-motion`.
- **Structured data.** `FAQPage` covering all 21 questions, and `SoftwareApplication`,
  both generated from the page content and inlined at the bottom of `index.html`.
  Regenerate them if the FAQ changes.
- **The header wordmark is the real artwork**, not type. `peak-wordmark-ink.svg` and
  `peak-wordmark-on-ink.svg` are the design system's `assets/peak-wordmark-ink.svg` and
  `peak-wordmark-bone.svg`, with the viewBox tightened to the ink so the logo sits
  correctly in a nav bar (the originals carry ~88 units of empty space on the left).
  Colours and paths are untouched. The two cross-fade: cream over the dark hero, ink once
  the nav goes solid.
- **Nishant's portrait is the supplied photo, cropped only.** Square crop, head and
  shoulders, resized to 560px. I tried a white-balance correction and reverted it: the
  brightest thing in frame is a yellow wall, not a neutral reference, so auto-balancing
  pushed his skin green. The warm cast is the room, not an error. Nothing else about the
  photo was altered.

- **Icons come from the real app icon.** `app-icon.png` is the store icon as supplied.
  `favicon.svg` reproduces its composition as vector: cream `#F4EFE5` ground with the
  navigator at the same size and the same slight upward nudge the designer used (the mark
  sits 6px above true centre on a 480 canvas, which is the right optical correction for an
  upward-pointing form). The PNG sizes are downscales of the supplied file.

- **Gold, resolved.** The app icon uses `#C28D2A`, the design-system token. The wordmark
  and mark SVGs use `#bc9143`. Since the icon, the token and the whole site agree on
  `#C28D2A`, the `#bc9143` in those two SVG files is almost certainly a slip from an old
  export, not an optical correction. Fix it in the design system so every surface inherits
  it. Not changed here, because brand artwork should not be edited downstream.

- **The footer lockup is a derived asset.** `peak-lockup-on-ink.png` was made by
  recolouring the dark letterforms of `Brand Identity/peak-lockup-tagline-transparent.png`
  to on-ink cream `#F1E7D0`, since the black wordmark is invisible on the navy footer.
  The gold A is untouched. Replace it with a proper on-ink export when a designer makes
  one, and consider adding that export to the design system, which currently has no
  on-ink lockup.
- **The navigator mark's SVG was normalised** to `viewBox="0 0 90.778 79.611"`. The
  original from the design system carries an offset viewBox with the artwork placed by a
  transform, which breaks `<use>` references and makes the mark impossible to centre
  reliably. The ink is unchanged, only the coordinate origin.
- Copy and section rationale live in `Peak/Website/homepage-copy.md` and
  `homepage-build-spec.md`.
