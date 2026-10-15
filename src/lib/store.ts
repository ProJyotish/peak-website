import { formatMoney, occasionTags, type Pooja } from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";

/** A store section. Add an entry (and its items in `useStoreItems`) to open a new category. */
export type StoreCategory = {
  slug: string;
  /** Tab and breadcrumb label. */
  label: string;
  title: string;
  description: string;
};

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    slug: "pooja",
    label: "Pooja",
    title: "Book a pooja",
    description: "Performed by experienced Brahmins and joined live on video.",
  },
];

export const storeCategory = (slug: string | undefined) => STORE_CATEGORIES.find((c) => c.slug === slug);

/** One tile in the store grid, whatever category it comes from. */
export type StoreItem = {
  id: string;
  category: string;
  href: string;
  title: string;
  subtitle: string | null;
  image: { url: string; altText: string | null } | null;
  price: string;
  /** Short detail under the title, e.g. "2 Brahmins". */
  meta: string | null;
  tags: string[];
};

export function poojaToItem(p: Pooja): StoreItem {
  return {
    id: p.id,
    category: "pooja",
    href: ROUTES.poojaPage(p.slug),
    title: p.title,
    subtitle: p.titleHi,
    image: p.images[0] ?? null,
    price: formatMoney(p.price, p.currency),
    meta: p.brahmins ? `${p.brahmins} Brahmin${p.brahmins > 1 ? "s" : ""}` : null,
    tags: occasionTags(p),
  };
}

export const tagLabel = (tag: string) => tag.replace(/-/g, " ");

/** Tags across the items, most used first, for the browse chips. */
export function storeTags(items: StoreItem[]): string[] {
  const counts = new Map<string, number>();
  for (const item of items) for (const t of item.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

const normalize = (s: string) => s.toLowerCase().replace(/[-_]+/g, " ").trim();

/** Every query word has to appear in the title, Hindi title or a tag. */
export function filterStoreItems(items: StoreItem[], { q, tag }: { q?: string | null; tag?: string | null }) {
  const words = normalize(q ?? "").split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (tag && !item.tags.includes(tag)) return false;
    if (!words.length) return true;
    const haystack = normalize([item.title, item.subtitle ?? "", ...item.tags].join(" "));
    return words.every((w) => haystack.includes(w));
  });
}
