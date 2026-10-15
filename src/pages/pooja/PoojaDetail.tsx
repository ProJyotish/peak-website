import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageCircle, Users, Video } from "lucide-react";
import { SeoHead } from "@/components/site/SeoHead";
import { useAppTitle } from "@/components/site/AppBridge";
import { AddonPicker } from "@/components/pooja/AddonPicker";
import { BookingSummary } from "@/components/pooja/BookingSummary";
import { CodeField } from "@/components/pooja/CodeField";
import { SlotPicker } from "@/components/pooja/SlotPicker";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductSection } from "@/components/store/ProductSection";
import { StickyBuyBar } from "@/components/store/StickyBuyBar";
import { StoreShell } from "@/components/store/StoreShell";
import {
  fetchPooja,
  formatMoney,
  occasionTags,
  poojaJsonLd,
  poojaKeys,
  poojaSeoDescription,
  poojaSeoTitle,
  trackPooja,
  type PoojaSchedule,
  type SelectedAddon,
} from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";
import { tagLabel } from "@/lib/store";
import { usePoojaCode } from "./usePoojaCode";

const BOOKING_ID = "book";
const SCHEDULE_ID = "schedule";

function Step({ id, n, title, children }: { id?: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4 rounded-lg border border-border bg-card p-4 sm:p-5">
      <h2 className="mb-4 flex items-baseline gap-2 text-base font-semibold text-ink">
        <span className="text-xs font-medium text-gold">Step {n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Highlight({ icon: Icon, children }: { icon: typeof Users; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-ink">
      <Icon className="h-3.5 w-3.5 text-gold" />
      {children}
    </li>
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
  useAppTitle(puja?.title);
  const panditCode = usePoojaCode(slug, selectedAddons, Boolean(puja));
  const appliedCode = panditCode.applied?.code ?? null;

  // A pandit code switches to that pandit's calendar, so a slot picked before no longer applies.
  useEffect(() => setSchedule(null), [appliedCode]);

  return (
    <>
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
      <StoreShell backTo={{ href: ROUTES.pooja, label: "All poojas" }} bottomBarSpace={Boolean(puja)}>
        <div className="container-peak px-4 pb-12 sm:px-6 sm:pt-6 md:px-10 lg:pt-10">
          <nav className="mb-4 hidden gap-2 text-xs text-muted-foreground sm:flex app:hidden" aria-label="Breadcrumb">
            <Link to={ROUTES.store} className="hover:text-ink">
              Store
            </Link>
            <span>/</span>
            <Link to={ROUTES.pooja} className="hover:text-ink">
              Pooja
            </Link>
          </nav>

          {isLoading ? (
            <p className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : isError || !puja || !data ? (
            <div className="max-w-xl py-10">
              <h1 className="font-display text-3xl text-ink">Pooja not found</h1>
              <p className="mt-4 text-muted-foreground">
                It may no longer be available.{" "}
                <Link to={ROUTES.pooja} className="underline hover:text-ink">
                  See all poojas
                </Link>
              </p>
            </div>
          ) : (
            // Phones stack gallery → buy box → details; desktop puts details under the gallery.
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
              <div className="contents lg:col-span-7 lg:block lg:space-y-8">
                <div className="order-1 pt-4 sm:pt-0">
                  <ProductGallery images={puja.images} title={puja.title} subtitle={puja.titleHi} />
                </div>
                {puja.descriptionHtml ? (
                  <div className="order-3 border-t border-border lg:border-t-0">
                    <ProductSection title="About this pooja" defaultOpen>
                      <div
                        className="blog-prose"
                        // Product copy authored by the team in Shopify admin.
                        dangerouslySetInnerHTML={{ __html: puja.descriptionHtml }}
                      />
                    </ProductSection>
                    <ProductSection title="After you book">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        You'll get a WhatsApp message to share the devotee's name, gotra, place and purpose
                        (sankalp). The video link and instructions follow before your pooja, and you can watch it
                        live.
                      </p>
                    </ProductSection>
                  </div>
                ) : null}
              </div>

              <div className="order-2 space-y-5 lg:col-span-5">
                <div>
                  <p className="text-xl font-semibold text-ink">{formatMoney(puja.price, puja.currency)}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {puja.brahmins ? (
                      <Highlight icon={Users}>
                        {puja.brahmins} Brahmin{puja.brahmins > 1 ? "s" : ""}
                      </Highlight>
                    ) : null}
                    <Highlight icon={Video}>Live on video</Highlight>
                    <Highlight icon={MessageCircle}>WhatsApp updates</Highlight>
                  </ul>
                  {occasionTags(puja).length ? (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      {occasionTags(puja).map((t) => (
                        <Link
                          key={t}
                          to={`${ROUTES.pooja}?tag=${encodeURIComponent(t)}`}
                          className="capitalize text-gold underline-offset-2 hover:underline"
                        >
                          #{tagLabel(t)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                <Step id={SCHEDULE_ID} n={1} title="Choose date & time">
                  <div className="mb-5">
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

                <div id={BOOKING_ID} className="scroll-mt-4">
                  <BookingSummary
                    puja={puja}
                    addons={data.addons}
                    selectedAddons={selectedAddons}
                    schedule={schedule}
                    code={panditCode.applied}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </StoreShell>
      {puja ? (
        <StickyBuyBar
          price={formatMoney(puja.price, puja.currency)}
          label={schedule ? "Book now" : "Choose date & time"}
          targetId={schedule ? BOOKING_ID : SCHEDULE_ID}
        />
      ) : null}
    </>
  );
};

export default PoojaDetail;
