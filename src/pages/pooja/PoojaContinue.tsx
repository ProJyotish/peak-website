import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { fetchPoojaDetailsLink } from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";

/**
 * Thank-you / invoice handoff: Shopify only has the order id at payment time.
 * We exchange it for a signed details token, then land on the form.
 */
const PoojaContinue = () => {
  const { orderId = "" } = useParams<{ orderId: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("This link is invalid or has expired");
      return;
    }
    let cancelled = false;
    fetchPoojaDetailsLink(orderId)
      .then((res) => {
        if (!cancelled) setToken(res.token);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "This link is invalid or has expired");
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (token) {
    return <Navigate replace to={ROUTES.poojaDetails(token)} />;
  }

  return (
    <>
      <SeoHead
        title="Pooja details · Peak"
        description="Opening your pooja details form."
        keywords={[]}
        path={ROUTES.poojaContinue(orderId)}
        noindex
      />
      <SitePageLayout
        eyebrow="Pooja"
        title="Pooja details"
        backTo={{ href: ROUTES.pooja, label: "Poojas" }}
      >
        {error ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Opening your booking…
          </p>
        )}
      </SitePageLayout>
    </>
  );
};

export default PoojaContinue;
