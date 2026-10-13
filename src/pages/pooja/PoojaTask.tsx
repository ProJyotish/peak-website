import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { SeoHead } from "@/components/site/SeoHead";
import {
  acceptPoojaTask,
  completePoojaTask,
  declinePoojaTask,
  fetchPoojaTask,
  formatIstDateTime,
  type PoojaTaskStatus,
  type PoojaTaskView,
} from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";

const PRIMARY =
  "inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-parchment transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50";
const SECONDARY =
  "inline-flex items-center justify-center gap-2 border border-border px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-clay transition-colors hover:border-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.18em] text-clay";

const STATUS_TEXT: Record<PoojaTaskStatus, string> = {
  "needs-assignment": "Awaiting assignment",
  assigned: "Please confirm this booking",
  scheduled: "Confirmed",
  "awaiting-completion": "Please mark this pooja complete",
  done: "Completed",
  cancelled: "Cancelled",
};

const DETAIL_LABELS: Array<[keyof PoojaTaskView["details"], string]> = [
  ["devoteeName", "Devotee"],
  ["gotra", "Gotra"],
  ["place", "Place"],
  ["purpose", "Purpose"],
];

/** `datetime-local` value (entered as IST) → ISO with an explicit offset. */
const istInputToIso = (value: string) => (value ? `${value}:00+05:30` : "");

const PoojaTask = () => {
  const { token = "" } = useParams<{ token: string }>();
  const queryClient = useQueryClient();
  const queryKey = ["pooja-task", token];
  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => fetchPoojaTask(token),
    enabled: Boolean(token),
    retry: false,
  });

  const [startTime, setStartTime] = useState("");
  const [note, setNote] = useState("");
  const [declining, setDeclining] = useState(false);
  const [declined, setDeclined] = useState(false);

  const onView = (view: PoojaTaskView) => {
    queryClient.setQueryData(queryKey, view);
    setNote("");
  };
  const accept = useMutation({
    mutationFn: () => acceptPoojaTask(token, data?.needsStartTime ? istInputToIso(startTime) : undefined),
    onSuccess: onView,
  });
  const complete = useMutation({
    mutationFn: () => completePoojaTask(token, note.trim()),
    onSuccess: onView,
  });
  const decline = useMutation({
    mutationFn: () => declinePoojaTask(token, note.trim()),
    onSuccess: () => setDeclined(true),
  });
  const failure = [accept, complete, decline].find((m) => m.isError)?.error as Error | undefined;

  return (
    <>
      <SeoHead
        title="Pooja booking · Peak"
        description="Your assigned pooja."
        keywords={[]}
        path={ROUTES.poojaTask(token)}
        noindex
      />
      <SitePageLayout
        eyebrow={data ? `Order ${data.orderName}` : "Pooja"}
        title={data ? data.pujaTitle : "Pooja booking"}
        description={data ? STATUS_TEXT[data.status] : undefined}
      >
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading booking…
          </p>
        ) : declined ? (
          <p className="text-muted-foreground">You have declined this booking. Our team will reassign it.</p>
        ) : isError || !data ? (
          <p className="text-muted-foreground">{(error as Error)?.message || "This link is invalid or has expired."}</p>
        ) : (
          <div className="space-y-8">
            <dl className="grid gap-4 border border-border p-6 sm:grid-cols-2">
              <div>
                <dt className={LABEL}>When</dt>
                <dd className="mt-1 text-ink">
                  {data.slotStart ? formatIstDateTime(data.slotStart) : (data.slotLabel ?? "To be decided")}
                </dd>
              </div>
              <div>
                <dt className={LABEL}>Duration</dt>
                <dd className="mt-1 text-ink">{data.durationMinutes} min</dd>
              </div>
              {data.customerName ? (
                <div>
                  <dt className={LABEL}>Booked by</dt>
                  <dd className="mt-1 text-ink">{data.customerName}</dd>
                </div>
              ) : null}
              {data.detailsStatus === "submitted" ? (
                DETAIL_LABELS.map(([key, label]) =>
                  data.details[key] ? (
                    <div key={key} className={key === "purpose" ? "sm:col-span-2" : undefined}>
                      <dt className={LABEL}>{label}</dt>
                      <dd className="mt-1 whitespace-pre-line text-ink">{data.details[key]}</dd>
                    </div>
                  ) : null,
                )
              ) : (
                <p className="text-sm text-muted-foreground sm:col-span-2">
                  The devotee hasn't shared sankalp details yet. We'll send them to you on WhatsApp.
                </p>
              )}
            </dl>

            {data.joinToken ? (
              <Link to={ROUTES.poojaJoin(data.joinToken)} className={PRIMARY}>
                <Video className="h-4 w-4" /> Video call
              </Link>
            ) : null}

            {data.status === "done" ? (
              <div className="border border-gold bg-parchment-deep/40 p-6">
                <CheckCircle2 className="h-6 w-6 text-gold" />
                <p className="mt-3 text-ink">
                  Marked complete
                  {data.completedAt ? ` on ${formatIstDateTime(data.completedAt)}` : ""}. Thank you.
                </p>
              </div>
            ) : null}

            {data.canAccept && !declining ? (
              <div className="space-y-4">
                {data.needsStartTime ? (
                  <label className="block">
                    <span className={LABEL}>Start time (IST)</span>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-2 rounded-none"
                      required
                    />
                    {data.slotLabel ? (
                      <span className="mt-1 block text-sm text-muted-foreground">
                        Devotee prefers: {data.slotLabel}
                      </span>
                    ) : null}
                  </label>
                ) : null}
                <button
                  type="button"
                  className={PRIMARY}
                  disabled={accept.isPending || (data.needsStartTime && !startTime)}
                  onClick={() => accept.mutate()}
                >
                  {accept.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Accept booking
                </button>
              </div>
            ) : null}

            {data.canComplete || declining ? (
              <label className="block">
                <span className={LABEL}>{declining ? "Reason (optional)" : "Note for our team (optional)"}</span>
                <Textarea
                  value={note}
                  maxLength={500}
                  rows={3}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2 rounded-none"
                />
              </label>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {data.canComplete && !declining ? (
                <button
                  type="button"
                  className={PRIMARY}
                  disabled={complete.isPending}
                  onClick={() => complete.mutate()}
                >
                  {complete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Mark pooja complete
                </button>
              ) : null}
              {data.canDecline ? (
                declining ? (
                  <>
                    <button
                      type="button"
                      className={PRIMARY}
                      disabled={decline.isPending}
                      onClick={() => decline.mutate()}
                    >
                      {decline.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Confirm decline
                    </button>
                    <button type="button" className={SECONDARY} onClick={() => setDeclining(false)}>
                      Back
                    </button>
                  </>
                ) : (
                  <button type="button" className={SECONDARY} onClick={() => setDeclining(true)}>
                    I can't do this
                  </button>
                )
              ) : null}
            </div>

            {failure ? <p className="text-sm text-destructive">{failure.message}</p> : null}
          </div>
        )}
      </SitePageLayout>
    </>
  );
};

export default PoojaTask;
