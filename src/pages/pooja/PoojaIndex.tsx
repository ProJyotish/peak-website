import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { Chip } from "@/components/pooja/Chip";
import {
  fetchPoojaCatalog,
  formatMoney,
  normalizePoojaCode,
  occasionTags,
  poojaKeys,
  rememberPoojaCode,
} from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";

const PoojaIndex = () => {
  const [searchParams] = useSearchParams();
  const urlCode = normalizePoojaCode(searchParams.get("code"));
  // Affiliate links can land here; the detail page picks the code up and validates it.
  useEffect(() => {
    if (urlCode) rememberPoojaCode(urlCode);
  }, [urlCode]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: poojaKeys.catalog,
    queryFn: fetchPoojaCatalog,
    staleTime: 5 * 60_000,
  });
  const [occasion, setOccasion] = useState<string | null>(null);

  const occasions = useMemo(
    () => [...new Set((data?.pujas ?? []).flatMap(occasionTags))].sort(),
    [data],
  );
  const pujas = (data?.pujas ?? []).filter((p) => !occasion || p.tags.includes(occasion));

  return (
    <>
      <SeoHead
        title="Book a Pooja Online · Peak"
        description="Book Vedic poojas performed by experienced Brahmins, live on video. Choose your muhurat, add Brahman Bhoj, Prasad and Vastra Danam."
        keywords={["book pooja online", "online puja booking", "vedic pooja", "puja with brahmins"]}
        path={ROUTES.pooja}
      />
      <SitePageLayout
        eyebrow="Pooja"
        title="Book a pooja"
        description="Performed by experienced Brahmins and joined live on video. Pick your muhurat and offerings; we take care of the rest."
        wide
      >
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading poojas…
          </p>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">
            Couldn't load poojas.{" "}
            <button type="button" className="underline hover:text-ink" onClick={() => refetch()}>
              Try again
            </button>
          </p>
        ) : (
          <>
            {occasions.length > 1 ? (
              <div className="mb-10 flex flex-wrap gap-2">
                <Chip selected={!occasion} onClick={() => setOccasion(null)}>
                  All
                </Chip>
                {occasions.map((o) => (
                  <Chip key={o} selected={occasion === o} onClick={() => setOccasion(o)}>
                    {o.replace(/-/g, " ")}
                  </Chip>
                ))}
              </div>
            ) : null}

            {pujas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No poojas available right now.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {pujas.map((p) => (
                  <Link
                    key={p.id}
                    to={ROUTES.poojaPage(p.slug)}
                    className="group flex flex-col border border-border transition-colors hover:border-gold"
                  >
                    {p.images[0] ? (
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].altText ?? p.title}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-parchment-deep/60" />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-xl text-ink transition-colors group-hover:text-gold">{p.title}</h2>
                      {p.titleHi ? <p className="mt-1 text-sm text-clay">{p.titleHi}</p> : null}
                      <div className="mt-auto flex items-end justify-between pt-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {p.brahmins ? `${p.brahmins} Brahmin${p.brahmins > 1 ? "s" : ""}` : "Pooja"}
                        </p>
                        <p className="font-mono text-sm text-ink">{formatMoney(p.price, p.currency)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </SitePageLayout>
    </>
  );
};

export default PoojaIndex;
