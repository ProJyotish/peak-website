type IphoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Minimal iPhone-style bezel around an app screenshot. */
export function IphoneFrame({ src, alt, className = "" }: IphoneFrameProps) {
  return (
    <div className={`mx-auto w-[240px] sm:w-[260px] md:w-[280px] ${className}`}>
      <div className="relative rounded-[2.6rem] border-[10px] border-ink bg-ink p-1 shadow-[0_24px_60px_-20px_rgba(26,22,20,0.45)]">
        {/* Dynamic Island */}
        <div
          className="pointer-events-none absolute left-1/2 top-3 z-10 h-6 w-[88px] -translate-x-1/2 rounded-full bg-ink"
          aria-hidden
        />
        <div className="overflow-hidden rounded-[2rem] bg-parchment">
          <img
            src={src}
            alt={alt}
            className="block h-auto w-full"
            loading="eager"
            decoding="async"
          />
        </div>
        {/* Home indicator */}
        <div
          className="pointer-events-none absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-parchment/35"
          aria-hidden
        />
      </div>
    </div>
  );
}
