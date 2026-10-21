import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Image = { url: string; altText: string | null };

type ProductGalleryProps = {
  images: Image[];
  /** Overlaid on the image as the page's heading. */
  title: string;
  subtitle?: string | null;
};

const scrollTrackTo = (el: HTMLDivElement | null, i: number, behavior: ScrollBehavior = "smooth") =>
  el?.scrollTo({ left: i * el.clientWidth, behavior });

const indexOf = (el: HTMLDivElement) => Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));

/**
 * Compact swipeable image with the product name over it. Previews sit below on phones and in a
 * column on the left from `lg`; tapping the image opens it full size.
 */
export function ProductGallery({ images, title, subtitle }: ProductGalleryProps) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2 lg:flex-row-reverse lg:gap-3">
      <div className="relative min-w-0 overflow-hidden rounded-lg bg-parchment-deep/60 lg:flex-1">
        {images.length ? (
          <div
            ref={track}
            onScroll={(e) => setIndex(indexOf(e.currentTarget))}
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                aria-label="View full size"
                onClick={() => setZoomed(i)}
                className="w-full shrink-0 snap-center cursor-zoom-in"
              >
                <img
                  src={img.url}
                  alt={img.altText ?? title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="aspect-[16/10] w-full object-cover lg:aspect-[4/3]"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="aspect-[16/10] w-full lg:aspect-[4/3]" />
        )}

        {images.length > 1 ? (
          <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white">
            {index + 1}/{images.length}
          </span>
        ) : null}

        {/* Fixed black, not a theme colour: it sits on a photo in light and dark mode alike. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
          <h1 className="font-display text-lg leading-tight text-white sm:text-2xl">{title}</h1>
          {subtitle ? <p className="mt-0.5 text-xs text-white/80 sm:text-sm">{subtitle}</p> : null}
        </div>
      </div>

      {images.length > 1 ? (
        // From `lg` the column is absolutely filled so it scrolls within the image's height instead of stretching it.
        <div className="relative lg:w-16 lg:shrink-0">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:absolute lg:inset-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden">
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                aria-label={`Image ${i + 1}`}
                aria-current={i === index}
                onClick={() => scrollTrackTo(track.current, i)}
                className={cn(
                  "h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition lg:aspect-square lg:h-auto lg:w-full",
                  i === index ? "border-gold" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ImageLightbox
        images={images}
        title={title}
        start={zoomed}
        onClose={(last) => {
          setZoomed(null);
          scrollTrackTo(track.current, last, "auto");
        }}
      />
    </div>
  );
}

/** Full-size, swipeable view; closes on X, Escape or a tap outside, leaving the gallery on the last image seen. */
function ImageLightbox({
  images,
  title,
  start,
  onClose,
}: {
  images: Image[];
  title: string;
  start: number | null;
  onClose: (lastIndex: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (start === null) return;
    setIndex(start);
    // After the dialog has mounted and laid out its track.
    requestAnimationFrame(() => scrollTrackTo(track.current, start, "auto"));
  }, [start]);

  return (
    <Dialog open={start !== null} onOpenChange={(open) => !open && onClose(index)}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-hidden border-0 bg-black p-0 sm:rounded-lg [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div
          ref={track}
          onScroll={(e) => setIndex(indexOf(e.currentTarget))}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img) => (
            <img
              key={img.url}
              src={img.url}
              alt={img.altText ?? title}
              className="max-h-[80vh] w-full shrink-0 snap-center object-contain"
            />
          ))}
        </div>
        {images.length > 1 ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white">
            {index + 1}/{images.length}
          </span>
        ) : null}
        <DialogClose
          aria-label="Close"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
        >
          <X className="h-5 w-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
