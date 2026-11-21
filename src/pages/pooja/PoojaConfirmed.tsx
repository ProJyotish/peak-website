import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { SeoHead } from "@/components/site/SeoHead";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { ROUTES } from "@/lib/routes";

/** Post-pay confirmation (same origin as the Store WebView). */
const PoojaConfirmed = () => {
  const [params] = useSearchParams();
  const orderName = params.get("order")?.trim() || null;
  const bookingRef = params.get("ref")?.trim() || null;
  const token = params.get("token")?.trim() || null;

  return (
    <>
      <SeoHead
        title="Booking confirmed · Peak"
        description="Your pooja booking is confirmed."
        keywords={[]}
        path={ROUTES.poojaConfirmed}
        noindex
      />
      <SitePageLayout
        eyebrow="Pooja"
        title="Booking confirmed"
        description="Payment received. We will message you on WhatsApp with next steps."
        backTo={{ href: ROUTES.pooja, label: "Poojas" }}
      >
        <div className="border border-gold bg-parchment-deep/40 p-6 md:p-8">
          <CheckCircle2 className="h-6 w-6 text-gold" aria-hidden />
          <h2 className="mt-4 font-display text-2xl text-ink">Thank you</h2>
          <dl className="mt-5 space-y-2 text-sm">
            {orderName ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Order</dt>
                <dd className="font-mono text-ink">{orderName}</dd>
              </div>
            ) : null}
            {bookingRef ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Booking ref</dt>
                <dd className="font-mono text-ink">{bookingRef}</dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Share the devotee name, gotra, place and purpose so the pandit can take the sankalp.
            You can do that now or later from the WhatsApp link.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {token ? (
              <Link
                to={ROUTES.poojaDetails(token)}
                className="inline-flex items-center justify-center bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-parchment transition-colors hover:bg-gold hover:text-ink"
              >
                Add pooja details
              </Link>
            ) : null}
            <Link
              to={ROUTES.pooja}
              className="inline-flex items-center justify-center border border-border px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-clay transition-colors hover:border-gold hover:text-ink"
            >
              Browse poojas
            </Link>
          </div>
        </div>
      </SitePageLayout>
    </>
  );
};

export default PoojaConfirmed;
