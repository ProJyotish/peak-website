import { Link } from "react-router-dom";
import type { StoreItem } from "@/lib/store";

export function ProductTile({ item }: { item: StoreItem }) {
  return (
    <Link
      to={item.href}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-gold active:opacity-80"
    >
      <div className="aspect-square w-full overflow-hidden bg-parchment-deep/60">
        {item.image ? (
          <img
            src={item.image.url}
            alt={item.image.altText ?? item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink sm:text-base">{item.title}</h3>
        {item.subtitle ? <p className="mt-0.5 line-clamp-1 text-xs text-clay">{item.subtitle}</p> : null}
        <div className="mt-auto pt-2">
          <p className="text-sm font-semibold text-ink">{item.price}</p>
          {item.meta ? <p className="mt-0.5 text-[11px] text-muted-foreground">{item.meta}</p> : null}
        </div>
      </div>
    </Link>
  );
}

export function ProductTileSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-square w-full animate-pulse bg-parchment-deep/60" />
      <div className="space-y-2 p-3 sm:p-4">
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-parchment-deep" />
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-parchment-deep" />
      </div>
    </div>
  );
}
