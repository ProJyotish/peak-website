import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SeoHead } from "@/components/site/SeoHead";
import { fetchPoojaDetailsLink } from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";

/** Shopify thank-you handoff: exchange order id → signed details URL, then redirect. */
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
      <SeoHead title="Peak" description="" keywords={[]} path={ROUTES.poojaContinue(orderId)} noindex />
      <div className="flex min-h-dvh items-center justify-center bg-parchment px-6">
        {error ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
        )}
      </div>
    </>
  );
};

export default PoojaContinue;
