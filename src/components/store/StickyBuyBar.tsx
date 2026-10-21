import { useEffect, useState } from "react";

type StickyBuyBarProps = {
  price: string;
  label: string;
  /** Element the button scrolls to; the bar hides while it is on screen. */
  targetId: string;
};

/** Phone-only bottom bar keeping the price and the call to action in reach. */
export function StickyBuyBar({ price, label, targetId }: StickyBuyBarProps) {
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setTargetVisible(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-200 lg:hidden ${
        targetVisible ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">From</p>
          <p className="text-lg font-semibold leading-tight text-ink">{price}</p>
        </div>
        <button
          type="button"
          onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="ml-auto h-12 flex-1 rounded-full bg-ink px-6 text-sm font-semibold text-parchment active:opacity-80 app:bg-gold"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
