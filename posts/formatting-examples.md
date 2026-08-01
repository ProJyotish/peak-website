---
title: Blog formatting examples
date: 2026-08-02T00:00:00.000Z
category: Guide
excerpt: A single reference post covering every markdown format Peak blog posts support — headings, lists, media, embeds, accordions, and more.
---

This post is the formatting crib sheet. Copy any section into a real article; the title above is the page `<h1>`, so body copy usually starts at `##`.

# Heading 1 (body)

Use sparingly inside a post — the page title already fills the top slot.

## Heading 2

Section break. Most posts live here.

### Heading 3

Subsection under an H2.

#### Heading 4

Smaller label when an H3 still feels too big.

## Paragraphs and inline text

Regular paragraphs sit as plain text with a blank line between them.

You can mix **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and `inline code` in the same sentence.

## Links

- Internal: [Peak home](/)
- External: [peaklife.me](https://peaklife.me)
- Autolink (GFM): https://peaklife.me
- YouTube as a normal link (not embedded): [this video](https://www.youtube.com/watch?v=QXGSVFYdJAw)

## Bullets and lists

Unordered:

- Timing over intensity
- Structure before speed
- Review windows before launches
  - Nested item under the parent
  - Another nested item

Ordered:

1. Read the chart context
2. Pick the window
3. Act once, then wait for feedback
   1. Nested ordered step
   2. Another nested step

Task list (GFM):

- [x] Supported checklist item
- [ ] Open checklist item
- [ ] Another open item

## Blockquote

> Saturn asks whether this still matters in five years. Use a blockquote for pulled lines or short asides.

## Horizontal rule

Content above the break.

***

Content below the break.

## Code

Inline: set `MOCK_LLM=true` for local API work.

Fenced block:

```
pnpm install
pnpm dev
```

## Table

| Format | Supported | Notes |
| --- | --- | --- |
| Headings H1–H4 | Yes | Page title is separate H1 |
| Bullets / ordered lists | Yes | Nesting works |
| Task lists | Yes | GFM checkboxes |
| Images | Yes | Tina media or `/public` path |
| YouTube embed | Yes | Bare URL alone on its own line |
| Accordion | Yes | HTML `<details>` / `<summary>` |
| Generic video file | No | Use YouTube or a linked file |

## Image

Upload via Peak CMS into `blog-images/`, or drop a file under `public/`:

![Peak mark — swap for a chart or photo](/placeholder.svg)

CMS path example after upload:

`![Saturn](/blog-images/saturn.jpg)`

## YouTube embed

Paste a bare `youtube.com` / `youtu.be` URL alone on its own line. It becomes an embed.

https://www.youtube.com/watch?v=QXGSVFYdJAw

Linked text stays a normal link (see Links above) — it does **not** embed.

Shorts and `youtu.be` short links work the same way when alone on a line:

https://youtu.be/QXGSVFYdJAw

## Accordion

Use HTML `<details>` / `<summary>`. Stack several for a FAQ-style block.

<details>
<summary>What is an accordion for?</summary>

Short answers, FAQs, and optional detail that should stay collapsed by default. Markdown inside works: **bold**, [links](/), and lists.

- First supporting point
- Second supporting point

</details>

<details>
<summary>How do I add another panel?</summary>

Copy another `<details>` block. Keep a blank line after `</summary>` so paragraphs and lists parse cleanly.

</details>

<details>
<summary>Are Radix/shadcn Accordion components available in posts?</summary>

No — blog posts are markdown. Use `<details>` / `<summary>` as shown here.

</details>

## What is not supported

- Generic MP4 / Vimeo / Loom embeds (YouTube only for in-page video)
- Custom React components inside markdown
- Fancy card grids, pill clusters, or marketing widgets

***

*Peak · Formatting reference*
