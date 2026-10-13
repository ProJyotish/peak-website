import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { fetchPoojaDetails, submitPoojaDetails, type PoojaDetailsFields } from "@/lib/pooja";
import { ROUTES } from "@/lib/routes";

const EMPTY: PoojaDetailsFields = { devoteeName: "", gotra: "", place: "", purpose: "" };

const FIELDS: Array<{ key: keyof PoojaDetailsFields; label: string; placeholder: string; max: number }> = [
  { key: "devoteeName", label: "Devotee name", placeholder: "Full name for the sankalp", max: 120 },
  { key: "gotra", label: "Gotra", placeholder: "e.g. Kashyap (write 'Not known' if unsure)", max: 80 },
  { key: "place", label: "Place", placeholder: "City / town of residence", max: 160 },
];

const PoojaDetailsForm = () => {
  const { token = "" } = useParams<{ token: string }>();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pooja-details", token],
    queryFn: () => fetchPoojaDetails(token),
    enabled: Boolean(token),
    retry: false,
  });

  const [fields, setFields] = useState<PoojaDetailsFields>(EMPTY);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!data) return;
    setFields({
      devoteeName: data.details.devoteeName ?? "",
      gotra: data.details.gotra ?? "",
      place: data.details.place ?? "",
      purpose: data.details.purpose ?? "",
    });
  }, [data]);

  const submit = useMutation({
    mutationFn: () => submitPoojaDetails(token, fields),
    onSuccess: (res) => {
      queryClient.setQueryData(["pooja-details", token], res);
      setEditing(false);
    },
  });

  const valid = Object.values(fields).every((v) => v.trim().length > 0);
  const submitted = data?.detailsStatus === "submitted" && !editing;

  return (
    <>
      <SeoHead
        title="Pooja details · Peak"
        description="Share the devotee details for your pooja."
        keywords={[]}
        path={ROUTES.poojaDetails(token)}
        noindex
      />
      <SitePageLayout
        eyebrow={data ? `Order ${data.orderName}` : "Pooja"}
        title={data ? data.pujaTitle : "Pooja details"}
        description={data?.slotLabel ? `Scheduled: ${data.slotLabel}` : undefined}
        backTo={{ href: ROUTES.pooja, label: "Poojas" }}
      >
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your booking…
          </p>
        ) : isError || !data ? (
          <p className="text-muted-foreground">{(error as Error)?.message || "This link is invalid or has expired."}</p>
        ) : submitted ? (
          <div className="border border-gold bg-parchment-deep/40 p-6 md:p-8">
            <CheckCircle2 className="h-6 w-6 text-gold" />
            <h2 className="mt-4 font-display text-2xl text-ink">Thank you, we have your details</h2>
            <p className="mt-3 text-muted-foreground">
              The pandit will take the sankalp for <span className="text-ink">{data.details.devoteeName}</span>
              {data.details.gotra ? ` (${data.details.gotra} gotra)` : ""}. You'll receive the video call link and
              instructions on WhatsApp/email before the pooja
              {data.scheduleMode === "manual" ? ", once our team confirms the exact muhurat" : ""}.
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-6 border-b border-border pb-0.5 font-mono text-xs uppercase tracking-[0.18em] text-clay transition-colors hover:border-gold hover:text-ink"
            >
              Edit details
            </button>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) submit.mutate();
            }}
          >
            <p className="text-muted-foreground">
              These details are read out in the sankalp during your pooja.
            </p>
            {FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">{f.label}</span>
                <Input
                  value={fields[f.key]}
                  maxLength={f.max}
                  placeholder={f.placeholder}
                  onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                  className="mt-2 rounded-none"
                  required
                />
              </label>
            ))}
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">Purpose (sankalp)</span>
              <Textarea
                value={fields.purpose}
                maxLength={1000}
                rows={4}
                placeholder="What would you like the pooja to be performed for?"
                onChange={(e) => setFields({ ...fields, purpose: e.target.value })}
                className="mt-2 rounded-none"
                required
              />
            </label>

            {submit.isError ? <p className="text-sm text-destructive">{(submit.error as Error).message}</p> : null}

            <button
              type="submit"
              disabled={!valid || submit.isPending}
              className="inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-parchment transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit details
            </button>
          </form>
        )}
      </SitePageLayout>
    </>
  );
};

export default PoojaDetailsForm;
