import { useCallback, useEffect, useState } from "react";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { ProductScreenshotSlide } from "@/lib/product";
import { cn } from "@/lib/utils";

type ProductScreenshotProps = {
  label: string;
  caption?: string;
  src?: string;
};

/**
 * App screenshot frame. Uses a real image when `src` is set; otherwise a dashed placeholder.
 */
export function ProductScreenshot({ label, caption, src }: ProductScreenshotProps) {
  return (
    <figure className="w-full">
      {src ? (
        <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[2rem] border border-border bg-parchment-deep shadow-[0_18px_50px_-28px_rgba(26,36,63,0.45)] md:max-w-[300px]">
          <img
            src={src}
            alt={label}
            className="block h-auto w-full"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <div
          className="relative mx-auto flex aspect-[9/19] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-border bg-parchment-deep/50 md:max-w-[300px]"
          role="img"
          aria-label={`App screenshot placeholder: ${label}`}
        >
          <div className="absolute inset-x-8 top-6 h-px bg-border/80" />
          <div className="px-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">Screenshot</p>
            <p className="mt-3 font-display text-xl leading-tight text-ink">{label}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              App screen preview coming soon
            </p>
          </div>
          <div className="absolute inset-x-8 bottom-6 h-px bg-border/80" />
        </div>
      )}
      {caption ? (
        <figcaption className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type ProductScreenshotCarouselProps = {
  slides: ProductScreenshotSlide[];
};

export function ProductScreenshotCarousel({ slides }: ProductScreenshotCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback((embla: CarouselApi) => {
    if (!embla) return;
    setCurrent(embla.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <ProductScreenshot
        label={slides[0].label}
        caption={slides[0].caption}
        src={slides[0].src}
      />
    );
  }

  return (
    <div className="w-full max-w-[340px]">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        className="w-full"
        aria-label="App screenshots"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.label}>
              <ProductScreenshot
                label={slide.label}
                caption={slide.caption}
                src={slide.src}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="-left-3 border-border bg-background/90 text-ink hover:bg-gold hover:text-ink disabled:opacity-30 md:-left-10"
        />
        <CarouselNext
          className="-right-3 border-border bg-background/90 text-ink hover:bg-gold hover:text-ink disabled:opacity-30 md:-right-10"
        />
      </Carousel>

      <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Screenshot slides">
        {slides.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            role="tab"
            aria-selected={index === current}
            aria-label={`Show ${slide.label}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === current ? "w-6 bg-gold" : "w-1.5 bg-border hover:bg-clay",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Video demo slot — keep commented until a demo URL exists.
 *
 * Example when ready:
 *
 * ```tsx
 * <ProductVideoDemo
 *   title="See daily guidance in 60 seconds"
 *   src="https://www.youtube.com/embed/VIDEO_ID"
 * />
 * ```
 */
export function ProductVideoDemo({ title, src }: { title: string; src: string }) {
  return (
    <div className="border border-border bg-card/40 p-4 md:p-6">
      <p className="eyebrow mb-4">{title}</p>
      <div className="relative aspect-video w-full overflow-hidden bg-parchment-deep">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/** Visible placeholder that documents where a video will go; the real embed stays commented in page JSX. */
export function ProductVideoPlaceholder({ title }: { title: string }) {
  return (
    <div className="border border-dashed border-border bg-parchment-deep/30 p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">Video demo</p>
      <p className="mt-3 font-display text-2xl text-ink">{title}</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Short walkthrough coming soon. Uncomment the embed in this page when the recording is ready.
      </p>
    </div>
  );
}
