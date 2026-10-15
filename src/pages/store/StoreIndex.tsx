import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SeoHead } from "@/components/site/SeoHead";
import { ProductTile, ProductTileSkeleton } from "@/components/store/ProductTile";
import { StoreShell } from "@/components/store/StoreShell";
import { StoreToolbar } from "@/components/store/StoreToolbar";
import { normalizePoojaCode, rememberPoojaCode } from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";
import { filterStoreItems, storeCategory, storeTags } from "@/lib/store";
import CmsPage from "../CmsPage";
import { useStoreItems } from "./useStoreItems";

const grid = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4";

/** `/store` (every category) and `/store/:category`; search and tag live in `?q=` / `?tag=`. */
const StoreIndex = () => {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const category = storeCategory(categorySlug);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag");

  const urlCode = normalizePoojaCode(searchParams.get("code"));
  // Affiliate links can land here; the product page picks the code up and validates it.
  useEffect(() => {
    if (urlCode) rememberPoojaCode(urlCode);
  }, [urlCode]);

  const { items, isLoading, isError, refetch } = useStoreItems();
  const inCategory = useMemo(
    () => (category ? items.filter((i) => i.category === category.slug) : items),
    [items, category],
  );
  const tags = useMemo(() => storeTags(inCategory), [inCategory]);
  const shown = filterStoreItems(inCategory, { q: query, tag });

  const setParam = (key: "q" | "tag", value: string | null) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  if (categorySlug && !category) return <CmsPage />;

  const path = category ? ROUTES.storeCategory(category.slug) : ROUTES.store;
  return (
    <>
      <SeoHead
        title={category ? `${category.title} Online · Peak Store` : "Peak Store · Poojas & more"}
        description={
          category?.description ??
          "Book Vedic poojas performed by experienced Brahmins, live on video, and more from Peak."
        }
        keywords={["book pooja online", "online puja booking", "vedic pooja", "peak store"]}
        path={path}
      />
      <StoreShell backTo={category ? { href: ROUTES.store, label: "Store" } : { href: ROUTES.home, label: "Home" }}>
        <div className="container-peak px-4 sm:px-6 md:px-10">
          <div className={`pb-1 pt-6 md:pt-10 ${category ? "" : "app:hidden"}`}>
            <p className="eyebrow mb-2">{category ? "Store" : "Peak"}</p>
            <h1 className="font-display text-3xl leading-tight text-ink md:text-4xl app:text-2xl">
              {category?.title ?? "Store"}
            </h1>
            {category ? <p className="mt-2 text-sm text-muted-foreground">{category.description}</p> : null}
          </div>

          <StoreToolbar
            category={category?.slug}
            query={query}
            onQueryChange={(q) => setParam("q", q || null)}
            tags={tags}
            tag={tag}
            onTagChange={(t) => setParam("tag", t)}
          />

          <div className="py-5 md:py-8">
            {isLoading ? (
              <div className={grid}>
                {Array.from({ length: 6 }, (_, i) => (
                  <ProductTileSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Couldn't load the store.{" "}
                <button type="button" className="underline hover:text-ink" onClick={() => refetch()}>
                  Try again
                </button>
              </p>
            ) : shown.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {query || tag ? "Nothing matches that." : "Nothing here right now."}
                </p>
                {query || tag ? (
                  <button
                    type="button"
                    onClick={() => setSearchParams({}, { replace: true })}
                    className="mt-3 rounded-full border border-ink px-4 py-2 text-xs font-medium text-ink"
                  >
                    Clear search
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <p className="mb-3 text-xs text-muted-foreground">
                  {shown.length} {shown.length === 1 ? "item" : "items"}
                </p>
                <div className={grid}>
                  {shown.map((item) => (
                    <ProductTile key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </StoreShell>
    </>
  );
};

export default StoreIndex;
