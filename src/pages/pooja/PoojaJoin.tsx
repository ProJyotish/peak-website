import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Video } from "lucide-react";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { fetchPoojaJoin, formatIstDateTime, type PoojaJoinView } from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";

const PRIMARY =
  "inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-parchment transition-colors hover:bg-gold hover:text-ink";

function countdown(ms: number): string {
  const mins = Math.max(0, Math.ceil(ms / 60_000));
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const rest = mins % 60;
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${rest}m`;
  return `${rest}m`;
}

/** Re-poll while the call may still open or close, so the page updates without a reload. */
const pollInterval = (data?: PoojaJoinView) =>
  data && (data.state === "early" || data.state === "open" || data.state === "unscheduled") ? 30_000 : false;

const PoojaJoin = () => {
  const { token = "" } = useParams<{ token: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pooja-join", token],
    queryFn: () => fetchPoojaJoin(token),
    enabled: Boolean(token),
    retry: false,
    refetchInterval: (query) => pollInterval(query.state.data),
  });

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const opensIn = data?.opensAt ? Date.parse(data.opensAt) - now : 0;

  return (
    <>
      <SeoHead
        title="Join pooja · Peak"
        description="Join your pooja video call."
        keywords={[]}
        path={ROUTES.poojaJoin(token)}
        noindex
      />
      <SitePageLayout
        eyebrow={data ? `Order ${data.orderName}` : "Pooja"}
        title={data ? data.pujaTitle : "Join pooja"}
        description={data?.startsAt ? formatIstDateTime(data.startsAt) : undefined}
      >
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : isError || !data ? (
          <p className="text-muted-foreground">{(error as Error)?.message || "This link is invalid or has expired."}</p>
        ) : data.state === "open" && data.url ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {data.role === "pandit"
                ? "The devotee can join now. Please start the pooja on time."
                : "Your pooja call is open. Join from this phone or computer; no app needed."}
            </p>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className={PRIMARY}>
              <Video className="h-4 w-4" /> Join video call
            </a>
          </div>
        ) : data.state === "early" ? (
          <div className="space-y-2">
            <p className="text-ink">The call opens in {countdown(opensIn)}.</p>
            <p className="text-sm text-muted-foreground">
              Keep this page open or come back from the WhatsApp link 15 minutes before the start.
            </p>
          </div>
        ) : data.state === "unscheduled" ? (
          <p className="text-muted-foreground">
            The time for this pooja hasn't been confirmed yet. You'll get a WhatsApp message once it is.
          </p>
        ) : data.state === "cancelled" ? (
          <p className="text-muted-foreground">This pooja has been cancelled.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">This pooja call has ended.</p>
            {data.recordingUrl ? (
              <a href={data.recordingUrl} target="_blank" rel="noopener noreferrer" className={PRIMARY}>
                Watch recording
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">If a recording is available, we'll share it on WhatsApp.</p>
            )}
          </div>
        )}
      </SitePageLayout>
    </>
  );
};

export default PoojaJoin;
