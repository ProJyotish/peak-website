import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import type { DateRange } from "react-day-picker";
import {
  TravelAdviseMap,
  TravelMapLegend,
} from "@/components/astrocartography/TravelAdviseMap";
import {
  LocationAutocompleteInput,
  PreferredPlacesField,
} from "@/components/astrocartography/LocationAutocomplete";
import { SiteBreadcrumbs } from "@/components/site/SiteBreadcrumbs";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchAstroAdvise,
  type AssessedPlace,
  type BirthPayload,
  type LayAdviseData,
  type PlaceVerdict,
} from "@/lib/astroApi";
import { ROUTES } from "@/lib/routes";
import { breadcrumbsForPath } from "@/lib/pages";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const BIRTH_FROM_YEAR = 1900;
const BIRTH_TO_YEAR = new Date().getFullYear();

/** Lay purpose → Chalit activity_id (hidden from UI jargon). */
const PURPOSES: Array<{ id: string; label: string; blurb: string }> = [
  {
    id: "short_break",
    label: "Holiday / short break",
    blurb: "Rest, leisure, and easy getaways.",
  },
  {
    id: "long_journey",
    label: "Long trip",
    blurb: "Extended travel or sabbatical.",
  },
  {
    id: "solo_retreat",
    label: "Retreat / alone time",
    blurb: "Quiet reset away from routine.",
  },
  {
    id: "career_push",
    label: "Work / business travel",
    blurb: "Meetings, projects, career push.",
  },
  {
    id: "relocation",
    label: "Moving / settling",
    blurb: "Considering a new base.",
  },
  {
    id: "health_recovery",
    label: "Recovery / health rest",
    blurb: "Convalescence and reconstitution.",
  },
];

type FormState = {
  birthDate: string;
  birthTime: string;
  birthCity: string;
  purposeId: string;
  travelStart: string;
  travelEnd: string;
  preferredPlaceList: string[];
  countries: string;
};

function todayIso(): string {
  const d = new Date();
  return toLocalDateIso(d);
}

function plusMonthsIso(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return toLocalDateIso(d);
}

const initialForm: FormState = {
  birthDate: "",
  birthTime: "12:00",
  birthCity: "",
  purposeId: "short_break",
  travelStart: todayIso(),
  travelEnd: plusMonthsIso(1),
  preferredPlaceList: [],
  countries: "",
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

function formatBirthDateTimeLabel(dateIso: string, time: string): string {
  const d = parseLocalDate(dateIso);
  if (!d) return "Pick date & time of birth";
  const t = parseBirthTime(time);
  if (!t) return format(d, "PPP");
  const hh = String(t.hour).padStart(2, "0");
  const mm = String(t.min).padStart(2, "0");
  return `${format(d, "PPP")} · ${hh}:${mm}`;
}

function formatTravelRangeLabel(start: string, end: string): string {
  const from = parseLocalDate(start);
  const to = parseLocalDate(end);
  if (!from) return "Pick travel dates";
  if (!to) return `${format(from, "MMM d, yyyy")} – …`;
  if (from.getTime() === to.getTime()) return format(from, "MMM d, yyyy");
  if (from.getFullYear() === to.getFullYear()) {
    return `${format(from, "MMM d")} – ${format(to, "MMM d, yyyy")}`;
  }
  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
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

function verdictPillClass(v: PlaceVerdict): string {
  switch (v) {
    case "good":
      return "bg-emerald-600 text-white";
    case "challenging":
      return "bg-red-600 text-white";
    case "mixed":
    default:
      return "bg-amber-500 text-white";
  }
}

function verdictLabel(v: PlaceVerdict): string {
  switch (v) {
    case "good":
      return "Favorable";
    case "challenging":
      return "Unfavorable";
    case "mixed":
    default:
      return "Neutral";
  }
}

export default function Astrocartography() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LayAdviseData | null>(null);

  useEffect(() => {
    trackEvent("astro_travel_view", {
      page: "astrocartography",
    });
  }, []);

  const birthDateObj = useMemo(
    () => (form.birthDate ? parseLocalDate(form.birthDate) : undefined),
    [form.birthDate],
  );

  const travelRange: DateRange | undefined = useMemo(() => {
    const from = form.travelStart ? parseLocalDate(form.travelStart) : undefined;
    const to = form.travelEnd ? parseLocalDate(form.travelEnd) : undefined;
    if (!from && !to) return undefined;
    return { from, to };
  }, [form.travelStart, form.travelEnd]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const birth = toBirthPayload(form);
    if (!birth) {
      setError("Enter the person’s birth date, time, and place.");
      return;
    }
    if (!form.travelStart || !form.travelEnd) {
      setError("Enter the travel start and end dates.");
      return;
    }
    const preferredPlaces = form.preferredPlaceList
      .map((s) => s.trim())
      .filter(Boolean);
    const countries = form.countries
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    trackEvent("astro_travel_submit", {
      purpose: form.purposeId,
      preferred_count: preferredPlaces.length,
      has_country_filter: countries.length > 0,
      travel_start: form.travelStart,
      travel_end: form.travelEnd,
    });

    setLoading(true);
    try {
      const data = await fetchAstroAdvise(birth, {
        activityId: form.purposeId,
        travelStart: form.travelStart,
        travelEnd: form.travelEnd,
        preferredPlaces: preferredPlaces.length ? preferredPlaces : undefined,
        countries: countries.length ? countries : undefined,
      });
      setResult(data);
      trackEvent("astro_travel_result", {
        purpose: form.purposeId,
        preferred_count: data.preferred.length,
        alternatives_count: data.alternatives.length,
        home_best: data.homeBest,
        has_period_warning: Boolean(data.periodWarning),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not run the advise.";
      setError(message);
      trackEvent("astro_travel_error", {
        purpose: form.purposeId,
        message: message.slice(0, 120),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <header className="border-b border-border/60 bg-parchment/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Wordmark />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-10 max-w-2xl">
          <SiteBreadcrumbs
            crumbs={breadcrumbsForPath(ROUTES.astrocartography, "Astrocartography")}
          />
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink md:text-5xl">
            Find best places for your trip
          </h1>
          <p className="mt-4 text-lg text-ink/75">
            Enter birth details, the trip purpose, and the dates. Optionally name cities already
            on the shortlist - we&apos;ll say whether they fit that window, and suggest better
            alternatives.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-clay/40 bg-clay/10 px-4 py-3 text-sm">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-10">
          <Section n="1" title="Who is travelling">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date & time of birth" className="sm:col-span-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between border border-border bg-card px-3 py-2 text-left text-sm",
                        !birthDateObj && "text-ink/40",
                      )}
                    >
                      {formatBirthDateTimeLabel(form.birthDate, form.birthTime)}
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
                    <div className="border-t border-border px-3 py-3">
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/55">
                        Time of birth
                      </label>
                      <input
                        type="time"
                        value={form.birthTime}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, birthTime: e.target.value }))
                        }
                        className="w-full border border-border bg-card px-3 py-2 text-sm"
                        required
                      />
                      <p className="mt-1.5 text-xs text-ink/50">
                        Approximate is fine if exact time is unknown.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </Field>
              <Field label="Place of birth" className="sm:col-span-2">
                <LocationAutocompleteInput
                  value={form.birthCity}
                  onChange={(birthCity) => setForm((f) => ({ ...f, birthCity }))}
                  placeholder="City of birth"
                  required
                />
              </Field>
            </div>
          </Section>

          <Section n="2" title="Purpose of the trip">
            <div className="grid gap-2 sm:grid-cols-2">
              {PURPOSES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, purposeId: p.id }))}
                  className={cn(
                    "border px-4 py-3 text-left",
                    form.purposeId === p.id
                      ? "border-gold bg-gold/15"
                      : "border-border bg-card hover:border-gold/40",
                  )}
                >
                  <span className="block text-sm font-medium">{p.label}</span>
                  <span className="mt-0.5 block text-xs text-ink/55">{p.blurb}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section n="3" title="When are they travelling">
            <Field label="Travel dates">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between border border-border bg-card px-3 py-2 text-left text-sm",
                      !form.travelStart && "text-ink/40",
                    )}
                  >
                    {formatTravelRangeLabel(form.travelStart, form.travelEnd)}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={travelRange}
                    defaultMonth={travelRange?.from}
                    onSelect={(range: DateRange | undefined) => {
                      setForm((f) => ({
                        ...f,
                        travelStart: range?.from ? toLocalDateIso(range.from) : "",
                        travelEnd: range?.to
                          ? toLocalDateIso(range.to)
                          : range?.from
                            ? toLocalDateIso(range.from)
                            : "",
                      }));
                    }}
                    disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </Section>

          <Section n="4" title="Places already in mind (optional)">
            <Field label="Cities to check">
              <PreferredPlacesField
                places={form.preferredPlaceList}
                onChange={(preferredPlaceList) =>
                  setForm((f) => ({ ...f, preferredPlaceList }))
                }
              />
            </Field>
            <Field label="Prefer countries (optional filter for alternatives)">
              <input
                type="text"
                value={form.countries}
                onChange={(e) => setForm((f) => ({ ...f, countries: e.target.value }))}
                placeholder="India, Portugal, Thailand"
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
            Check these places
          </button>
        </form>

        {result && (
          <div className="mt-14 space-y-10 animate-fade-up">
            {result.periodWarning && (
              <div className="border border-clay/50 bg-clay/10 px-4 py-3 text-sm">
                {result.periodWarning}
              </div>
            )}
            {result.periodFocus && (
              <div className="border border-border bg-card px-4 py-3 text-sm text-ink/80">
                <p>{result.periodFocus.label}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink/40">
                  Changes with your travel dates — destinations re-rank when this focus shifts
                </p>
              </div>
            )}
            {result.homeBest && (
              <div className="border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
                No place in this list is a clear standout for your dates — treat destinations as
                similar options and lean on timing and itinerary.
              </div>
            )}

            <section>
              <h2 className="font-display text-2xl">Summary</h2>
              <p className="mt-2 text-ink/80">{result.summary}</p>
              <p className="mt-1 font-mono text-xs text-ink/45">
                {result.purposeLabel} · {result.travelWindow.start} → {result.travelWindow.end}
              </p>
            </section>

            {result.preferred.length > 0 && (
              <section>
                <h2 className="font-display text-2xl">Named places</h2>
                <div className="mt-4">
                  <PlacesTable places={result.preferred} />
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display text-2xl">
                {form.countries.trim() ? "Places by country" : "Alternative places"}
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                {form.countries.trim()
                  ? "Up to 4 cities per preferred country, with a verdict for your dates."
                  : "Stronger catalog fits for the same purpose and dates."}
              </p>
              {result.alternatives.length === 0 ? (
                <p className="mt-3 text-sm text-ink/55">No places to show for this window.</p>
              ) : (
                <div className="mt-4">
                  <PlacesTable
                    places={result.alternatives}
                    showRank={!form.countries.trim()}
                  />
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-2xl">Map</h2>
              <p className="mt-1 text-sm text-ink/60">
                Softer gold = better fit for this trip. Markers show named places and numbered
                alternatives - no technical overlays.
              </p>
              <div className="mt-4">
                <TravelAdviseMap
                  scoreGrid={result.scoreGrid}
                  birth={{
                    lat: result.birthPlace.lat,
                    lon: result.birthPlace.lon,
                  }}
                  preferred={result.preferred}
                  alternatives={result.alternatives}
                />
              </div>
              <div className="mt-3">
                <TravelMapLegend />
              </div>
            </section>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function PlacesTable({
  places,
  showRank = false,
}: {
  places: AssessedPlace[];
  showRank?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {showRank ? (
            <TableHead className="w-12 font-mono text-[10px] uppercase tracking-wider text-ink/45">
              #
            </TableHead>
          ) : null}
          <TableHead className="font-mono text-[10px] uppercase tracking-wider text-ink/45">
            City
          </TableHead>
          <TableHead className="font-mono text-[10px] uppercase tracking-wider text-ink/45">
            Country
          </TableHead>
          <TableHead className="font-mono text-[10px] uppercase tracking-wider text-ink/45">
            Verdict
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {places.map((place, i) => (
          <TableRow key={`${place.name}-${place.lat}-${place.lon}-${i}`}>
            {showRank ? (
              <TableCell className="font-mono text-sm text-gold">{i + 1}</TableCell>
            ) : null}
            <TableCell className="font-medium text-ink">{place.name}</TableCell>
            <TableCell className="text-ink/60">{place.country || "—"}</TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                  verdictPillClass(place.verdict),
                )}
              >
                {verdictLabel(place.verdict)}
              </span>
              {place.summary ? (
                <p className="mt-1 max-w-xs text-xs text-ink/50">{place.summary}</p>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
