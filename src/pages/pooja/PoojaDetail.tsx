import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { SeoHead } from "@/components/site/SeoHead";
import { AddonPicker } from "@/components/pooja/AddonPicker";
import { BookingSummary } from "@/components/pooja/BookingSummary";
import { CodeField } from "@/components/pooja/CodeField";
import { SlotPicker } from "@/components/pooja/SlotPicker";
import {
  fetchPooja,
  formatMoney,
  poojaJsonLd,
  poojaKeys,
  poojaSeoDescription,
  poojaSeoTitle,
  trackPooja,
  type PoojaSchedule,
  type SelectedAddon,
} from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";
import { usePoojaCode } from "./usePoojaCode";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{String(n).padStart(2, "0")}</p>
      <h2 className="mt-2 mb-6 font-display text-2xl text-ink">{title}</h2>
      {children}
    </section>
  );
}

const PoojaDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: poojaKeys.detail(slug),
    queryFn: () => fetchPooja(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  });
  const [schedule, setSchedule] = useState<PoojaSchedule | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  useEffect(() => {
    if (data?.puja) trackPooja("pooja_view", { slug, title: data.puja.title, price: data.puja.price });
  }, [data?.puja, slug]);

  const puja = data?.puja;
  const panditCode = usePoojaCode(slug, selectedAddons, Boolean(puja));
  const appliedCode = panditCode.applied?.code ?? null;

  // A pandit code switches to that pandit's calendar, so a slot picked before no longer applies.
  useEffect(() => setSchedule(null), [appliedCode]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SeoHead
        title={puja ? poojaSeoTitle(puja) : "Book a Pooja · Peak"}
        description={puja ? poojaSeoDescription(puja) : "Book a Vedic pooja online."}
        keywords={["book pooja online", ...(puja ? [puja.title, ...(puja.titleHi ? [puja.titleHi] : [])] : [])]}
        path={ROUTES.poojaPage(slug)}
        image={puja?.images[0]?.url}
        type="product"
        noindex={!isLoading && !puja}
        jsonLd={puja ? poojaJsonLd(puja) : undefined}
      />
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={ROUTES.pooja}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All poojas
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-16">
        <div className="container-peak">
          {isLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : isError || !puja || !data ? (
            <div className="max-w-xl">
              <h1 className="font-display text-3xl text-ink">Pooja not found</h1>
              <p className="mt-4 text-muted-foreground">
                It may no longer be available.{" "}
                <Link to={ROUTES.pooja} className="underline hover:text-ink">
                  See all poojas
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="space-y-10 lg:col-span-7">
                <div>
                  <p className="eyebrow mb-4">
                    Pooja{puja.brahmins ? ` · ${puja.brahmins} Brahmin${puja.brahmins > 1 ? "s" : ""}` : ""}
                  </p>
                  <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">{puja.title}</h1>
                  {puja.titleHi ? <p className="mt-3 text-lg text-clay">{puja.titleHi}</p> : null}
                  <p className="mt-4 font-mono text-lg text-ink">{formatMoney(puja.price, puja.currency)}</p>
                </div>

                {puja.images[0] ? (
                  <img
                    src={puja.images[0].url}
                    alt={puja.images[0].altText ?? puja.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : null}

                {puja.descriptionHtml ? (
                  <div
                    className="blog-prose"
                    // Product copy authored by the team in Shopify admin.
                    dangerouslySetInnerHTML={{ __html: puja.descriptionHtml }}
                  />
                ) : null}

                <Step n={1} title="Choose date & time">
                  <div className="mb-6">
                    <CodeField
                      code={panditCode.code}
                      result={panditCode.applied ?? undefined}
                      checking={panditCode.checking}
                      error={panditCode.error}
                      onApply={panditCode.apply}
                      onRemove={panditCode.remove}
                    />
                  </div>
                  <SlotPicker
                    slug={puja.slug}
                    code={appliedCode}
                    panditName={panditCode.applied?.panditName}
                    value={schedule}
                    onChange={setSchedule}
                  />
                </Step>

                {data.addons.length ? (
                  <Step n={2} title="Add offerings">
                    <AddonPicker
                      addons={data.addons}
                      brahmins={puja.brahmins}
                      slug={puja.slug}
                      value={selectedAddons}
                      onChange={setSelectedAddons}
                    />
                  </Step>
                ) : null}
              </div>

              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-8">
                  <BookingSummary
                    puja={puja}
                    addons={data.addons}
                    selectedAddons={selectedAddons}
                    schedule={schedule}
                    code={panditCode.applied}
                  />
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    After payment you'll get a WhatsApp message to share the devotee's name, gotra, place and
                    purpose (sankalp). The video link and instructions follow before your pooja.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PoojaDetail;
