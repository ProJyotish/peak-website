import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import {
  ChalitMapLegend,
  ChalitWorldMap,
} from "@/components/astrocartography/ChalitWorldMap";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  fetchChalitActivities,
  fetchChalitCompute,
  fetchChalitPreview,
  type ActivityDef,
  type BirthPayload,
  type BirthTimeConfidence,
  type ChalitComputeData,
  type ChalitPreviewData,
  type LeverMode,
} from "@/lib/astroApi";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const BIRTH_FROM_YEAR = 1900;
const BIRTH_TO_YEAR = new Date().getFullYear();

type FormState = {
  birthDate: string;
  birthTime: string;
  birthCity: string;
  activityId: string;
  activityText: string;
  activityDate: string;
  birthTimeConfidence: BirthTimeConfidence;
  leverMode: LeverMode;
  geoCountries: string;
};

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const initialForm: FormState = {
  birthDate: "",
  birthTime: "12:00",
  birthCity: "",
  activityId: "solo_retreat",
  activityText: "",
  activityDate: todayIso(),
  birthTimeConfidence: "exact",
  leverMode: "all",
  geoCountries: "",
};

function parseLocalDate(iso: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return undefined;
  }
  return d;
}

function toLocalDateIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseBirthTime(value: string): { hour: number; min: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const min = Number(m[2]);
  if (hour > 23 || min > 59) return null;
  return { hour, min };
}

function toBirthPayload(form: FormState): BirthPayload | null {
  const date = parseLocalDate(form.birthDate);
  const time = parseBirthTime(form.birthTime);
  if (!date || !time || !form.birthCity.trim()) return null;
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hour: time.hour,
    min: time.min,
    cityName: form.birthCity.trim(),
  };
}

type Step = "form" | "confirm" | "results";

export default function Astrocartography() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [activities, setActivities] = useState<ActivityDef[]>([]);
  const [step, setStep] = useState<Step>("form");
  const [preview, setPreview] = useState<ChalitPreviewData | null>(null);
  const [result, setResult] = useState<ChalitComputeData | null>(null);
  const [amplify, setAmplify] = useState<string[]>([]);
  const [mute, setMute] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverBoundary, setHoverBoundary] = useState<string | null>(null);

  useEffect(() => {
    fetchChalitActivities()
      .then((d) => setActivities(d.all))
      .catch(() => {
        /* taxonomy may load with preview */
      });
  }, []);

  const birthDateObj = useMemo(
    () => (form.birthDate ? parseLocalDate(form.birthDate) : undefined),
    [form.birthDate],
  );

  async function onPreview(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const birth = toBirthPayload(form);
    if (!birth) {
      setError("Enter birth date, time, and place.");
      return;
    }
    if (form.birthTimeConfidence === "unknown") {
      setError(
        "Unknown birth time cannot produce a map. Tighten the time or seek rectification.",
      );
      return;
    }
    setLoading(true);
    try {
      const data = await fetchChalitPreview(birth, {
        activityId: form.activityText.trim() ? undefined : form.activityId,
        activityText: form.activityText.trim() || undefined,
        activityDate: form.activityDate || todayIso(),
        birthTimeConfidence: form.birthTimeConfidence,
        leverMode: form.leverMode,
      });
      setPreview(data);
      setAmplify([...data.amplifyMute.amplify]);
      setMute([...data.amplifyMute.mute]);
      if (!activities.length) setActivities([data.activity]);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onCompute() {
    setError(null);
    const birth = toBirthPayload(form);
    if (!birth || !preview) return;
    setLoading(true);
    try {
      const countries = form.geoCountries
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const data = await fetchChalitCompute(birth, {
        activityId: preview.activity.activity_id,
        activityDate: form.activityDate || todayIso(),
        birthTimeConfidence: form.birthTimeConfidence,
        leverMode: form.leverMode,
        confirmedAmplify: amplify,
        confirmedMute: mute,
        geoConstraint: countries.length ? { countries } : undefined,
        gridStep: 2,
      });
      setResult(data);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compute failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <header className="border-b border-border/60 bg-parchment/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to={ROUTES.home} className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Wordmark />
          <span className="font-mono text-xs text-ink/50">AstroCarto</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Instrument</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink md:text-5xl">
            Peak AstroCarto
          </h1>
          <p className="mt-4 text-lg text-ink/75">
            Where your chart&apos;s bhāva structure sits differently — and how that changes
            what a period is likely to feel like from the inside.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-ink">
            {error}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={onPreview} className="space-y-10">
            <Section n="1" title="Birth">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date of birth">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between border border-border bg-card px-3 py-2 text-left text-sm",
                          !birthDateObj && "text-ink/40",
                        )}
                      >
                        {birthDateObj ? format(birthDateObj, "PPP") : "Pick a date"}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={BIRTH_FROM_YEAR}
                        toYear={BIRTH_TO_YEAR}
                        selected={birthDateObj}
                        onSelect={(d) =>
                          d && setForm((f) => ({ ...f, birthDate: toLocalDateIso(d) }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field label="Time of birth">
                  <input
                    type="time"
                    value={form.birthTime}
                    onChange={(e) => setForm((f) => ({ ...f, birthTime: e.target.value }))}
                    className="w-full border border-border bg-card px-3 py-2 text-sm"
                    required
                  />
                </Field>
                <Field label="Place of birth" className="sm:col-span-2">
                  <input
                    type="text"
                    value={form.birthCity}
                    onChange={(e) => setForm((f) => ({ ...f, birthCity: e.target.value }))}
                    placeholder="City (historical timezone resolved on the birth date)"
                    className="w-full border border-border bg-card px-3 py-2 text-sm"
                    required
                  />
                </Field>
                <Field label="Birth time confidence" className="sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["exact", "Exact"],
                        ["pm15", "±15 min"],
                        ["pm60", "±1 hour"],
                        ["unknown", "Unknown"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, birthTimeConfidence: id }))}
                        className={cn(
                          "border px-3 py-1.5 text-sm",
                          form.birthTimeConfidence === id
                            ? "border-gold bg-gold/15 text-ink"
                            : "border-border bg-card text-ink/70",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink/55">
                    Four minutes of birth-time error equals one degree of longitude on the map.
                    Worse than ±15 min disables the sandhi lever.
                  </p>
                </Field>
              </div>
            </Section>

            <Section n="2" title="Activity">
              <Field label="What do you intend to do?">
                <select
                  value={form.activityId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, activityId: e.target.value, activityText: "" }))
                  }
                  className="w-full border border-border bg-card px-3 py-2 text-sm"
                >
                  {(activities.length
                    ? activities
                    : [
                        {
                          activity_id: "solo_retreat",
                          display_name: "Solo retreat, me-time",
                        },
                        {
                          activity_id: "long_journey",
                          display_name: "Long journey, pilgrimage",
                        },
                        {
                          activity_id: "career_push",
                          display_name: "Career push, job",
                        },
                      ]
                  ).map((a) => (
                    <option key={a.activity_id} value={a.activity_id}>
                      {a.display_name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Or describe in your own words">
                <input
                  type="text"
                  value={form.activityText}
                  onChange={(e) => setForm((f) => ({ ...f, activityText: e.target.value }))}
                  placeholder="e.g. sabbatical pilgrimage — confirmed before the map runs"
                  className="w-full border border-border bg-card px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Activity date">
                <input
                  type="date"
                  value={form.activityDate}
                  onChange={(e) => setForm((f) => ({ ...f, activityDate: e.target.value }))}
                  className="w-full border border-border bg-card px-3 py-2 text-sm"
                />
                <p className="mt-2 text-xs text-ink/55">
                  Defaults to today. The running daśā lords decide which structure to aim for —
                  change this if the trip is in the future.
                </p>
              </Field>
            </Section>

            <Section n="3" title="Levers & filters">
              <Field label="Lever mode">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "All three"],
                      ["structure", "Structure only"],
                      ["tuning", "Tuning only"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, leverMode: id }))}
                      className={cn(
                        "border px-3 py-1.5 text-sm",
                        form.leverMode === id
                          ? "border-gold bg-gold/15"
                          : "border-border bg-card text-ink/70",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Country filter (optional)">
                <input
                  type="text"
                  value={form.geoCountries}
                  onChange={(e) => setForm((f) => ({ ...f, geoCountries: e.target.value }))}
                  placeholder="India, Portugal, Japan — comma-separated"
                  className="w-full border border-border bg-card px-3 py-2 text-sm"
                />
              </Field>
            </Section>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-parchment hover:bg-ink/90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Preview amplify &amp; mute
            </button>
          </form>
        )}

        {step === "confirm" && preview && (
          <div className="space-y-8 animate-fade-up">
            <Section n="✓" title="Confirm before the map">
              <p className="text-sm text-ink/75">{preview.activity.notes}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Info label="Activity" value={preview.activity.display_name} />
                <Info
                  label="Daśā"
                  value={`${preview.dasa.md} / ${preview.dasa.ad} / ${preview.dasa.pd} (${preview.dasa.start} → ${preview.dasa.end})`}
                />
                <Info label="Target bhāvas" value={preview.targetBhavas.join(", ")} />
                <Info label="Support" value={preview.supportBhavas.join(", ") || "—"} />
                <Info label="Adverse" value={preview.adverseBhavas.join(", ") || "—"} />
                <Info
                  label="Experience weight"
                  value={String(preview.experienceWeight)}
                />
              </dl>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ChipEditor
                  title="Amplify"
                  values={amplify}
                  onChange={setAmplify}
                  hint="Wanted planets parked toward madhyas"
                />
                <ChipEditor
                  title="Mute"
                  values={mute}
                  onChange={setMute}
                  hint="Unwanted planets parked toward sandhis"
                />
              </div>

              {preview.amplifyMute.muteWarnings.map((w) => (
                <p key={w} className="mt-2 text-xs text-clay">
                  {w}
                </p>
              ))}
              {preview.honesty.messages.map((m) => (
                <p key={m} className="mt-1 text-xs text-ink/55">
                  {m}
                </p>
              ))}
            </Section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="border border-border px-4 py-2 text-sm"
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={onCompute}
                className="inline-flex items-center gap-2 bg-gold px-6 py-2.5 text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Compute map
              </button>
            </div>
          </div>
        )}

        {step === "results" && result && (
          <div className="space-y-10 animate-fade-up">
            {result.honesty.dasaDeclined && (
              <div className="border border-clay/50 bg-clay/10 px-4 py-3 text-sm">
                This is not a good period for this activity anywhere. Showing the least-bad
                options; daśā next changes around {result.dasa.nextChange}.
              </div>
            )}
            {result.honesty.homeBest && (
              <div className="border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
                Staying home is your best option — nothing on the shortlist improves the felt
                structure enough.
              </div>
            )}

            <section>
              <h2 className="font-display text-2xl">Map</h2>
              <p className="mt-1 text-sm text-ink/60">
                Cells shaded by score. Edges are blurred to your birth-time confidence (
                {result.honesty.blurDegreesLon.toFixed(1)}° lon).
                {hoverBoundary ? ` — ${hoverBoundary}` : ""}
              </p>
              <div className="mt-4">
                <ChalitWorldMap
                  scoreGrid={result.scoreGrid}
                  boundaries={result.boundaries}
                  blurDegreesLon={result.honesty.blurDegreesLon}
                  birth={{ lat: result.birthPlace.lat, lon: result.birthPlace.lon }}
                  shortlist={result.shortlist}
                  onBoundaryHover={setHoverBoundary}
                />
              </div>
              <div className="mt-3">
                <ChalitMapLegend />
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl">Shortlist</h2>
              <p className="mt-1 text-sm text-ink/60">
                Home score {result.home.breakdown.total.toFixed(2)}. Ranked by felt-structure
                fit for {result.activity.display_name.toLowerCase()}.
              </p>
              <ul className="mt-4 space-y-4">
                {result.shortlist.slice(0, 8).map((p, i) => (
                  <li key={p.name} className="border border-border bg-card/60 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl">
                        <span className="font-mono text-sm text-gold">{i + 1}.</span> {p.name}
                        <span className="text-base text-ink/50"> · {p.country}</span>
                      </h3>
                      <p className="font-mono text-xs text-ink/60">
                        score {p.score.toFixed(2)} · Δ home{" "}
                        {p.deltaVsHome >= 0 ? "+" : ""}
                        {p.deltaVsHome.toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-ink/80">{p.reason}</p>
                    {p.muted.some((m) => m.cost) && (
                      <p className="mt-1 text-xs text-clay">
                        Mute costs:{" "}
                        {p.muted
                          .filter((m) => m.cost)
                          .map((m) => m.cost)
                          .join("; ")}
                      </p>
                    )}
                    {p.structureNotes[0] && (
                      <p className="mt-1 text-xs text-ink/55">{p.structureNotes[0]}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl">Explanation</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ink/80">
                <li>{result.explanation.dasa}</li>
                <li>{result.explanation.structure}</li>
                <li>{result.explanation.ownership}</li>
                <li>{result.explanation.digbala}</li>
                <li>{result.explanation.amplifyMute}</li>
                <li>{result.explanation.tradeoff}</li>
                <li>{result.explanation.birthTime}</li>
              </ol>
            </section>

            <button
              type="button"
              onClick={() => {
                setStep("form");
                setResult(null);
                setPreview(null);
              }}
              className="border border-border px-4 py-2 text-sm"
            >
              Start over
            </button>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-baseline gap-3 font-display text-2xl">
        <span className="font-mono text-sm text-gold">{n}</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/55">
        {label}
      </span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/45">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}

function ChipEditor({
  title,
  values,
  onChange,
  hint,
}: {
  title: string;
  values: string[];
  onChange: (v: string[]) => void;
  hint: string;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="border border-border bg-card/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink/45">{title}</p>
      <p className="mt-0.5 text-xs text-ink/50">{hint}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(values.filter((x) => x !== v))}
            className="border border-gold/40 bg-gold/10 px-2 py-0.5 text-xs"
            title="Remove"
          >
            {v} ×
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add planet"
          className="flex-1 border border-border bg-card px-2 py-1 text-xs"
        />
        <button
          type="button"
          className="border border-border px-2 text-xs"
          onClick={() => {
            const t = draft.trim();
            if (!t || values.includes(t)) return;
            onChange([...values, t]);
            setDraft("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
