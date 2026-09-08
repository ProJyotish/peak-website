"""Normalize Peak Twitter/OG share image to public/home/og.png (1200×630).

Usage:
  python scripts/generate-og.py [source.png]

If no source is given, re-crops the existing public/home/og.png in place.
Source can be any larger generated card; it will be cover-cropped to 1200×630.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "home" / "og.png"
W, H = 1200, 630


def cover_crop(im: Image.Image, tw: int, th: int) -> Image.Image:
    im = im.convert("RGB")
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else OUT
    if not src.exists():
        raise SystemExit(f"Source not found: {src}")
    out = cover_crop(Image.open(src), W, H)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} ({out.size[0]}x{out.size[1]}, {OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
