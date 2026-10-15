import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { STORE_CATEGORIES, tagLabel } from "@/lib/store";

type StoreToolbarProps = {
  category?: string;
  query: string;
  onQueryChange: (q: string) => void;
  tags: string[];
  tag: string | null;
  onTagChange: (tag: string | null) => void;
};

const pill = "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors";

/** Search, category tabs and tag chips; sticks under the top edge while the grid scrolls. */
export function StoreToolbar({ category, query, onQueryChange, tags, tag, onTagChange }: StoreToolbarProps) {
  const tabs: { href: string; label: string; active: boolean }[] = [
    { href: ROUTES.store, label: "All", active: !category },
    ...STORE_CATEGORIES.map((c) => ({ href: ROUTES.storeCategory(c.slug), label: c.label, active: c.slug === category })),
  ];

  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-3 pt-3 backdrop-blur sm:-mx-6 sm:px-6 md:-mx-10 md:px-10">
      <label className="relative block">
        <span className="sr-only">Search the store</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search poojas, occasions…"
          enterKeyHint="search"
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm text-ink placeholder:text-muted-foreground focus:border-gold focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>

      <nav aria-label="Categories" className="mt-3 flex gap-5 border-b border-border text-sm">
        {tabs.map((t) => (
          <Link
            key={t.href}
            to={{ pathname: t.href, search: query ? `?q=${encodeURIComponent(query)}` : "" }}
            replace
            className={cn(
              "-mb-px border-b-2 pb-2 font-medium transition-colors",
              t.active ? "border-gold text-ink" : "border-transparent text-muted-foreground hover:text-ink",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tags.length > 1 ? (
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            aria-pressed={!tag}
            onClick={() => onTagChange(null)}
            className={cn(pill, !tag ? "border-ink bg-ink text-parchment" : "border-border bg-card text-ink")}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tag === t}
              onClick={() => onTagChange(tag === t ? null : t)}
              className={cn(pill, tag === t ? "border-ink bg-ink text-parchment" : "border-border bg-card text-ink")}
            >
              {tagLabel(t)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
