import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import { AstroWorldMap, MapLegend } from "@/components/astrocartography/AstroWorldMap";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  fetchAstrocartography,
  fetchCityInfluence,
  fetchTravelTiming,
  type AcLine,
  type BirthPayload,
  type CityInfluenceData,
  type ResolvedPlace,
  type TravelTimingData,
  type TravelTimingWindow,
} from "@/lib/astroApi";
import {
  PURPOSES,
  analyzePreferredPlace,
  describeLine,
  scoreCitiesForPurpose,
  type PlaceAnalysis,
  type ScoredSuggestion,
  type TravelPurpose,
} from "@/lib/astroMeaning";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const BIRTH_FROM_YEAR = 1900;
const BIRTH_TO_YEAR = new Date().getFullYear();

const MONTHS = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function defaultTravelRange() {
  const now = new Date();
  const startMonth = now.getMonth() + 1;
  const startYear = now.getFullYear();
  const end = new Date(now.getFullYear(), now.getMonth() + 5, 1);
  return {
    travelStartMonth: String(startMonth),
    travelStartYear: String(startYear),
    travelEndMonth: String(end.getMonth() + 1),
    travelEndYear: String(end.getFullYear()),
  };
}

type FormState = {
  /** Local calendar date as YYYY-MM-DD */
  birthDate: string;
  /** 24h clock as HH:mm */
  birthTime: string;
  birthCity: string;
  currentCity: string;
  preferredCity: string;
  preferredState: string;
  preferredCountry: string;
  purpose: TravelPurpose;
  travelStartMonth: string;
  travelStartYear: string;
  travelEndMonth: string;
  travelEndYear: string;
};

const initialForm: FormState = {
  birthDate: "",
  birthTime: "12:00",
  birthCity: "",
  currentCity: "",
  preferredCity: "",
  preferredState: "",
  preferredCountry: "",
  purpose: "travel_leisure",
  ...defaultTravelRange(),
};

function parseLocalDate(iso: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return undefined;
  }
  return d;
}

function toLocalDateIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseBirthTime(value: string): { hour: number; min: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const min = Number(m[2]);
  if (hour < 0 || hour > 23 || min < 0 || min > 59) return null;
  return { hour, min };
}

type ResultState = {
  lines: AcLine[];
  birthPlace: ResolvedPlace;
  currentPlace: ResolvedPlace;
  currentInfluence: CityInfluenceData;
  suggestions: ScoredSuggestion[];
  preferences: PlaceAnalysis[];
  preferenceErrors: string[];
  timing: TravelTimingData | null;
  timingError: string | null;
  zodiacNote: string;
  purpose: TravelPurpose;
  birthUtc: string;
};

function toBirthPayload(form: FormState): BirthPayload {
  const date = parseLocalDate(form.birthDate);
  const time = parseBirthTime(form.birthTime);
  if (!date || !time) {
    throw new Error("Please choose a valid birth date and time.");
  }
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hour: time.hour,
    min: time.min,
    cityName: form.birthCity.trim(),
  };
}

async function influenceOrNull(
  birth: BirthPayload,
  targetCityName: string,
): Promise<{ ok: true; data: CityInfluenceData } | { ok: false; error: string }> {
  try {
    const data = await fetchCityInfluence(birth, { targetCityName }, 1000);
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not resolve place.",
    };
  }
}

function formatMonthDay(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function levelLabel(level: TravelTimingWindow["level"]): string {
  switch (level) {
    case "favorable":
      return "Better stretch";
    case "neutral":
      return "Okay stretch";
    default:
      return "More cautious";
  }
}

export default function Astrocartography() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  const purposeMeta = useMemo(
    () => PURPOSES.find((p) => p.id === (result?.purpose ?? form.purpose)),
    [form.purpose, result?.purpose],
  );

  const onChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      if (!form.birthDate || !form.birthTime || !form.birthCity.trim() || !form.currentCity.trim()) {
        throw new Error("Please enter birth date, time, city of birth, and where they live now.");
      }
      const birth = toBirthPayload(form);

      const startMonth = Number(form.travelStartMonth);
      const startYear = Number(form.travelStartYear);
      const endMonth = Number(form.travelEndMonth);
      const endYear = Number(form.travelEndYear);
      if (!startMonth || !startYear || !endMonth || !endYear) {
        throw new Error("Please choose a travel month range.");
      }
      if (endYear < startYear || (endYear === startYear && endMonth < startMonth)) {
        throw new Error("Travel end month should be on or after the start month.");
      }

      const [mapData, influence, timingOutcome] = await Promise.all([
        fetchAstrocartography(birth),
        fetchCityInfluence(birth, { targetCityName: form.currentCity.trim() }, 800),
        fetchTravelTiming(birth, {
          travelStartMonth: startMonth,
          travelStartYear: startYear,
          travelEndMonth: endMonth,
          travelEndYear: endYear,
          purpose: form.purpose,
        })
          .then((data) => ({ ok: true as const, data }))
          .catch((err: unknown) => ({
            ok: false as const,
            error: err instanceof Error ? err.message : "Could not load travel timing.",
          })),
      ]);

      const preferenceSpecs: Array<{
        label: PlaceAnalysis["label"];
        query: string;
      }> = [
        { label: "City", query: form.preferredCity.trim() },
        { label: "State", query: form.preferredState.trim() },
        { label: "Country", query: form.preferredCountry.trim() },
      ].filter((s) => s.query.length > 0);

      const preferenceResults = await Promise.all(
        preferenceSpecs.map(async (spec) => {
          const r = await influenceOrNull(birth, spec.query);
          if (!r.ok) {
            return { error: `${spec.label} "${spec.query}": ${r.error}` as string, analysis: null };
          }
          return {
            error: null,
            analysis: analyzePreferredPlace(spec.label, spec.query, r.data, form.purpose),
          };
        }),
      );

      const preferences = preferenceResults
        .map((r) => r.analysis)
        .filter((a): a is PlaceAnalysis => a != null);
      const preferenceErrors = preferenceResults
        .map((r) => r.error)
        .filter((e): e is string => e != null);

      const exclude = [
        { lat: mapData.birthPlace.lat, lon: mapData.birthPlace.lon },
        { lat: influence.targetPlace.lat, lon: influence.targetPlace.lon },
        ...preferences.map((p) => ({ lat: p.place.lat, lon: p.place.lon })),
      ];
      const suggestions = scoreCitiesForPurpose(mapData.lines, form.purpose, exclude);

      setResult({
        lines: mapData.lines,
        birthPlace: mapData.birthPlace,
        currentPlace: influence.targetPlace,
        currentInfluence: influence,
        suggestions,
        preferences,
        preferenceErrors,
        timing: timingOutcome.ok ? timingOutcome.data : null,
        timingError: timingOutcome.ok ? null : timingOutcome.error,
        zodiacNote: mapData.zodiacNote,
        purpose: form.purpose,
        birthUtc: mapData.birthUtc,
      });

      requestAnimationFrame(() => {
        document.getElementById("acg-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const sectionOffset = result && result.preferences.length > 0 ? 1 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1 py-14 md:py-20">
        <div className="container-peak max-w-5xl">
          <p className="eyebrow mb-4">Free planning tool</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">
            Where in the world fits best?
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Enter a traveller&apos;s birth details, trip goal, and a tentative month range.
            You get place ideas from astrology map lines, nearby well-known spots, and
            better stretches of time from their dasha cycle - for conversation, not a
            ready-made itinerary.
          </p>
          <aside className="mt-6 max-w-2xl border border-border bg-card/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay mb-2">
              Important note
            </p>
            <p>
              These are astrology-based suggestions and recommendations only. They do
              not guarantee outcomes for travel, business, health, money, relationships,
              or relocating. We do not provide day-by-day travel plans. Always use your
              own judgment, practical research, and professional advice where needed.
            </p>
          </aside>

          <form onSubmit={onSubmit} className="mt-12 space-y-10">
            <section>
              <p className="eyebrow mb-4">1 · Birth details</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Use the best birth time you have. Even a rough time still produces a usable map.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <BirthDateField
                  value={form.birthDate}
                  onChange={(value) => onChange("birthDate", value)}
                />
                <Field label="Birth time">
                  <input
                    type="time"
                    required
                    step={60}
                    value={form.birthTime}
                    onChange={(e) => onChange("birthTime", e.target.value)}
                    className="acg-input"
                  />
                </Field>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="City of birth">
                  <input
                    type="text"
                    required
                    value={form.birthCity}
                    onChange={(e) => onChange("birthCity", e.target.value)}
                    className="acg-input"
                    placeholder="Mumbai, India"
                  />
                </Field>
                <Field label="Where they live now">
                  <input
                    type="text"
                    required
                    value={form.currentCity}
                    onChange={(e) => onChange("currentCity", e.target.value)}
                    className="acg-input"
                    placeholder="Bengaluru, India"
                  />
                </Field>
              </div>
            </section>

            <section>
              <p className="eyebrow mb-4">2 · What is this trip for?</p>
              <div className="flex flex-wrap gap-2">
                {PURPOSES.map((p) => {
                  const active = form.purpose === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onChange("purpose", p.id)}
                      className={`font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 border transition-colors ${
                        active
                          ? "bg-ink text-parchment border-ink"
                          : "border-ink/20 text-clay hover:border-gold hover:text-gold"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{purposeMeta?.blurb}</p>
            </section>

            <section>
              <p className="eyebrow mb-4">3 · Tentative travel months</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Pick the months you are considering. We look at their Vimshottari dasha
                (planetary time periods) and highlight better stretches inside that range.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="From month">
                  <select
                    required
                    value={form.travelStartMonth}
                    onChange={(e) => onChange("travelStartMonth", e.target.value)}
                    className="acg-input"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="From year">
                  <input
                    type="number"
                    min={2020}
                    max={2100}
                    required
                    value={form.travelStartYear}
                    onChange={(e) => onChange("travelStartYear", e.target.value)}
                    className="acg-input"
                  />
                </Field>
                <Field label="To month">
                  <select
                    required
                    value={form.travelEndMonth}
                    onChange={(e) => onChange("travelEndMonth", e.target.value)}
                    className="acg-input"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="To year">
                  <input
                    type="number"
                    min={2020}
                    max={2100}
                    required
                    value={form.travelEndYear}
                    onChange={(e) => onChange("travelEndYear", e.target.value)}
                    className="acg-input"
                  />
                </Field>
              </div>
            </section>

            <section>
              <p className="eyebrow mb-4">4 · Places already in mind (optional)</p>
              <p className="mb-4 text-sm text-muted-foreground">
                If the client already likes a city, region, or country, add it here. We
                check how each one looks for the goal you picked above.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City they are considering">
                  <input
                    type="text"
                    value={form.preferredCity}
                    onChange={(e) => onChange("preferredCity", e.target.value)}
                    className="acg-input"
                    placeholder="Lisbon"
                  />
                </Field>
                <Field label="State or region">
                  <input
                    type="text"
                    value={form.preferredState}
                    onChange={(e) => onChange("preferredState", e.target.value)}
                    className="acg-input"
                    placeholder="Goa, India"
                  />
                </Field>
                <Field label="Country">
                  <input
                    type="text"
                    value={form.preferredCountry}
                    onChange={(e) => onChange("preferredCountry", e.target.value)}
                    className="acg-input"
                    placeholder="Portugal"
                  />
                </Field>
              </div>
            </section>

            {error ? (
              <p className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-10 py-5 bg-ink text-parchment font-mono text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-ink transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing map…
                </>
              ) : (
                "Show map & suggestions"
              )}
            </button>
          </form>

          {result ? (
            <div id="acg-results" className="mt-16 space-y-14 scroll-mt-8">
              <aside className="border border-border bg-card/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                Reminder: places and dates below are astrology-based recommendations for
                conversation. They are not a travel itinerary and do not guarantee how a
                trip, move, or business visit will turn out.
              </aside>

              <section>
                <p className="eyebrow mb-4">5 · World map</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Colored lines show where different planetary themes are emphasized
                  around the world. The gold marker is where they live now
                  {result.currentPlace.cityName
                    ? ` (${result.currentPlace.cityName})`
                    : ""}
                  . Solid and dashed styles are just different line types on the chart.
                </p>
                <AstroWorldMap
                  lines={result.lines}
                  birth={{ lat: result.birthPlace.lat, lon: result.birthPlace.lon }}
                  current={{ lat: result.currentPlace.lat, lon: result.currentPlace.lon }}
                  suggestions={[
                    ...result.preferences.map((p) => ({
                      lat: p.place.lat,
                      lon: p.place.lon,
                      label: p.label[0],
                    })),
                    ...result.suggestions.map((s, i) => ({
                      lat: s.city.lat,
                      lon: s.city.lon,
                      label: `${i + 1}`,
                    })),
                  ]}
                />
                <MapLegend planets={result.lines.map((l) => l.planet)} />
              </section>

              <section>
                <p className="eyebrow mb-4">6 · Better times to travel</p>
                <h2 className="font-display text-2xl text-ink mb-4">
                  Within your tentative months
                </h2>
                <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
                  Based on Vimshottari dasha (the traditional planetary time periods in
                  their chart). Use these as timing hints when shortlisting dates - not as
                  a booking schedule.
                </p>
                {result.timingError ? (
                  <p className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    Timing could not be loaded: {result.timingError}
                  </p>
                ) : result.timing && result.timing.best.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {result.timing.best.map((w) => (
                      <article
                        key={`${w.start_date}-${w.end_date}-${w.dasha.antar}`}
                        className="border border-border bg-card/40 p-6"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">
                          {levelLabel(w.level)}
                        </p>
                        <h3 className="font-display text-xl text-ink">
                          {formatMonthDay(w.start_date)} – {formatMonthDay(w.end_date)}
                        </h3>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
                          {w.dasha.maha} – {w.dasha.antar} dasha
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {w.summary}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No clear standout stretches in that month range. The whole window looks
                    fairly even - practical factors may matter more than chart timing here.
                  </p>
                )}
              </section>

              {(result.preferences.length > 0 || result.preferenceErrors.length > 0) && (
                <section>
                  <p className="eyebrow mb-4">7 · Places they already like</p>
                  <h2 className="font-display text-2xl text-ink mb-6">
                    How their preferred places look
                  </h2>
                  {result.preferenceErrors.length > 0 ? (
                    <ul className="mb-4 space-y-1 text-sm text-destructive">
                      {result.preferenceErrors.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="grid gap-4 md:grid-cols-3">
                    {result.preferences.map((p) => (
                      <PreferenceCard key={`${p.label}-${p.query}`} analysis={p} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <p className="eyebrow mb-4">
                  {7 + sectionOffset} · Three place ideas
                </p>
                <h2 className="font-display text-2xl text-ink mb-6">
                  Destinations that may suit{" "}
                  {PURPOSES.find((p) => p.id === result.purpose)?.label.toLowerCase()}
                </h2>
                <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
                  Ranked from a curated city list, with nearby well-known places listed
                  for context. Not a trip plan - just places worth putting on the shortlist
                  for the client.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {result.suggestions.map((s, i) => (
                    <article
                      key={`${s.city.name}-${s.city.country}`}
                      className="border border-border bg-card/40 p-6 hover:border-gold transition-colors"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">
                        Idea #{i + 1}
                      </p>
                      <h3 className="font-display text-xl text-ink">
                        {s.city.name}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
                        {s.city.country}
                      </p>
                      {s.city.nearby?.length ? (
                        <div className="mt-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-clay mb-2">
                            Nearby popular places
                          </p>
                          <ul className="flex flex-wrap gap-2">
                            {s.city.nearby.map((n) => (
                              <li
                                key={n.name}
                                className="border border-border px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                {n.name}
                                {n.kind ? (
                                  <span className="text-clay"> · {n.kind}</span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <ul className="mt-4 space-y-2">
                        {s.nearest.length === 0 ? (
                          <li className="text-sm text-muted-foreground">
                            A generally friendly pattern without one nearby standout line.
                          </li>
                        ) : (
                          s.nearest.map((n) => (
                            <li key={`${n.planet}-${n.angle}`} className="text-sm text-muted-foreground">
                              <span className="text-ink">
                                {n.planet} {n.angle}
                              </span>
                              {" · "}
                              about {n.distanceKm} km away
                              {n.blurb ? (
                                <span className="block text-clay">{n.blurb}</span>
                              ) : null}
                            </li>
                          ))
                        )}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <p className="eyebrow mb-4">
                  {8 + sectionOffset} · Plain-language summary
                </p>
                <Explanation result={result} />
              </section>
            </div>
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
        {label}
      </span>
      {children}
    </label>
  );
}

function BirthDateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const selected = parseLocalDate(value);
  const [open, setOpen] = useState(false);

  return (
    <div className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
        Birth date
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "acg-input inline-flex items-center justify-between text-left",
              !selected && "text-clay/70",
            )}
          >
            <span>{selected ? format(selected, "d MMM yyyy") : "Pick a date"}</span>
            <CalendarIcon className="h-4 w-4 shrink-0 text-clay" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(toLocalDateIso(date));
              setOpen(false);
            }}
            captionLayout="dropdown-buttons"
            fromYear={BIRTH_FROM_YEAR}
            toYear={BIRTH_TO_YEAR}
            defaultMonth={selected ?? new Date(1990, 0, 1)}
            disabled={{ after: new Date() }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <input
        type="text"
        required
        tabIndex={-1}
        aria-hidden
        value={value}
        onChange={() => undefined}
        className="sr-only"
      />
    </div>
  );
}

function toneLabel(tone: PlaceAnalysis["tone"]): string {
  switch (tone) {
    case "supportive":
      return "Looks supportive";
    case "challenging":
      return "May need more effort";
    case "mixed":
      return "Mixed picture";
    default:
      return "Quieter signal";
  }
}

function PreferenceCard({ analysis }: { analysis: PlaceAnalysis }) {
  return (
    <article className="border border-border bg-card/40 p-6 hover:border-gold transition-colors">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">
        {analysis.label}
      </p>
      <h3 className="font-display text-xl text-ink">
        {analysis.place.cityName || analysis.query}
      </h3>
      {analysis.place.country ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
          {analysis.place.country}
        </p>
      ) : null}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
        {toneLabel(analysis.tone)}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
      {analysis.hits.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {analysis.hits.map((h) => (
            <li key={`${h.planet}-${h.angle}`} className="text-sm text-muted-foreground">
              <span className="text-ink">
                {h.planet} {h.angle}
              </span>
              {" · "}
              ~{h.distanceKm} km
              <span className="block text-clay">{h.blurb}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function Explanation({ result }: { result: ResultState }) {
  const nearby = result.currentInfluence.nearby.slice(0, 4);
  const purposeLabel = PURPOSES.find((p) => p.id === result.purpose)?.label ?? "this purpose";
  const best = result.timing?.best?.[0];

  return (
    <div className="space-y-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
      <p>
        Based on a birth in{" "}
        <span className="text-ink">{result.birthPlace.cityName}</span>
        {result.birthPlace.country ? `, ${result.birthPlace.country}` : ""}, and living now
        in{" "}
        <span className="text-ink">{result.currentPlace.cityName}</span>
        {" "}(gold marker), here is a simple read of place and timing.
      </p>

      {nearby.length > 0 ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay mb-3">
            Near where they live now
          </p>
          <ul className="space-y-2">
            {nearby.map((h) => (
              <li key={`${h.planet}-${h.angle}`}>
                <span className="text-ink">
                  {h.planet} {h.angle}
                </span>
                {": "}
                {describeLine(h.planet, h.angle)} (about {Math.round(h.distanceKm)} km away)
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>
          No strong planetary line sits especially close to their current city. That often
          feels quieter than places that sit right on a line - neither a bad nor a dazzling
          signal on its own.
        </p>
      )}

      {best ? (
        <p>
          Inside the months you named, one of the stronger stretches is roughly{" "}
          <span className="text-ink">
            {formatMonthDay(best.start_date)} – {formatMonthDay(best.end_date)}
          </span>{" "}
          ({best.dasha.maha}–{best.dasha.antar} dasha). Treat that as a timing hint when
          narrowing dates with the client.
        </p>
      ) : null}

      {result.preferences.length > 0 ? (
        <p>
          The places they already named were checked for{" "}
          <span className="text-ink">{purposeLabel.toLowerCase()}</span>
          {" "}using the same approach as the destination ideas above.
        </p>
      ) : null}

      <p>
        The three destination ideas are ranked for{" "}
        <span className="text-ink">{purposeLabel.toLowerCase()}</span> by how close they are
        to supportive map lines. Nearby popular places are listed for orientation only -
        confirm with visas, season, budget, safety, and what the client actually likes.
      </p>

      <p className="text-sm border border-border bg-card/40 px-4 py-3">
        Disclaimer: Peak&apos;s place and timing suggestions are based on astrology and
        carry no guarantees. They are not legal, medical, financial, immigration advice,
        or a travel itinerary.
      </p>

      {result.zodiacNote ? (
        <p className="text-sm border-l-2 border-gold pl-4 text-clay italic">{result.zodiacNote}</p>
      ) : null}
    </div>
  );
}
