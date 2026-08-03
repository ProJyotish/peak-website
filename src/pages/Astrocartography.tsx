import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AstroWorldMap, MapLegend } from "@/components/astrocartography/AstroWorldMap";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import {
  fetchAstrocartography,
  fetchCityInfluence,
  type AcLine,
  type BirthPayload,
  type CityInfluenceData,
  type ResolvedPlace,
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

type FormState = {
  day: string;
  month: string;
  year: string;
  hour: string;
  min: string;
  birthCity: string;
  currentCity: string;
  preferredCity: string;
  preferredState: string;
  preferredCountry: string;
  purpose: TravelPurpose;
};

const initialForm: FormState = {
  day: "",
  month: "",
  year: "",
  hour: "12",
  min: "0",
  birthCity: "",
  currentCity: "",
  preferredCity: "",
  preferredState: "",
  preferredCountry: "",
  purpose: "travel_leisure",
};

type ResultState = {
  lines: AcLine[];
  birthPlace: ResolvedPlace;
  currentPlace: ResolvedPlace;
  currentInfluence: CityInfluenceData;
  suggestions: ScoredSuggestion[];
  preferences: PlaceAnalysis[];
  preferenceErrors: string[];
  zodiacNote: string;
  purpose: TravelPurpose;
  birthUtc: string;
};

function toBirthPayload(form: FormState): BirthPayload {
  return {
    day: Number(form.day),
    month: Number(form.month),
    year: Number(form.year),
    hour: Number(form.hour),
    min: Number(form.min),
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
      const birth = toBirthPayload(form);
      if (
        !birth.day ||
        !birth.month ||
        !birth.year ||
        birth.hour == null ||
        Number.isNaN(birth.hour) ||
        !form.birthCity.trim() ||
        !form.currentCity.trim()
      ) {
        throw new Error("Please fill birth date, time, birth city, and current city.");
      }

      const [mapData, influence] = await Promise.all([
        fetchAstrocartography(birth),
        fetchCityInfluence(birth, { targetCityName: form.currentCity.trim() }, 800),
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
          <p className="eyebrow mb-4">Free tool</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">
            Astrocartography
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            See where your planetary lines fall across the world, how your current
            city sits among them, and readings for the places you already have in mind.
          </p>

          <form onSubmit={onSubmit} className="mt-12 space-y-10">
            <section>
              <p className="eyebrow mb-4">1 · Birth details</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Field label="Day">
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={form.day}
                    onChange={(e) => onChange("day", e.target.value)}
                    className="acg-input"
                    placeholder="15"
                  />
                </Field>
                <Field label="Month">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={form.month}
                    onChange={(e) => onChange("month", e.target.value)}
                    className="acg-input"
                    placeholder="8"
                  />
                </Field>
                <Field label="Year">
                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    required
                    value={form.year}
                    onChange={(e) => onChange("year", e.target.value)}
                    className="acg-input"
                    placeholder="1992"
                  />
                </Field>
                <Field label="Hour (0-23)">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    required
                    value={form.hour}
                    onChange={(e) => onChange("hour", e.target.value)}
                    className="acg-input"
                  />
                </Field>
                <Field label="Minute">
                  <input
                    type="number"
                    min={0}
                    max={59}
                    required
                    value={form.min}
                    onChange={(e) => onChange("min", e.target.value)}
                    className="acg-input"
                  />
                </Field>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Birth city">
                  <input
                    type="text"
                    required
                    value={form.birthCity}
                    onChange={(e) => onChange("birthCity", e.target.value)}
                    className="acg-input"
                    placeholder="Mumbai, India"
                  />
                </Field>
                <Field label="Current city">
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
              <p className="eyebrow mb-4">2 · Purpose</p>
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
              <p className="eyebrow mb-4">3 · Preferences (optional)</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Add any places you are already considering. We score each against your
                lines for the purpose above.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Preferred city">
                  <input
                    type="text"
                    value={form.preferredCity}
                    onChange={(e) => onChange("preferredCity", e.target.value)}
                    className="acg-input"
                    placeholder="Lisbon"
                  />
                </Field>
                <Field label="Preferred state / region">
                  <input
                    type="text"
                    value={form.preferredState}
                    onChange={(e) => onChange("preferredState", e.target.value)}
                    className="acg-input"
                    placeholder="Goa, India"
                  />
                </Field>
                <Field label="Preferred country">
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
                  Mapping…
                </>
              ) : (
                "Draw my map"
              )}
            </button>
          </form>

          {result ? (
            <div id="acg-results" className="mt-16 space-y-14 scroll-mt-8">
              <section>
                <p className="eyebrow mb-4">4 · World map</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Solid lines are MC / ASC; dashed are IC / DSC. Gold marks your
                  current location
                  {result.currentPlace.cityName
                    ? ` (${result.currentPlace.cityName})`
                    : ""}
                  .
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

              {(result.preferences.length > 0 || result.preferenceErrors.length > 0) && (
                <section>
                  <p className="eyebrow mb-4">5 · Your preferences</p>
                  <h2 className="font-display text-2xl text-ink mb-6">
                    Analysis for places you named
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
                  {result.preferences.length > 0 ? "6" : "5"} · Three suggestions
                </p>
                <h2 className="font-display text-2xl text-ink mb-6">
                  Best fits for {PURPOSES.find((p) => p.id === result.purpose)?.label.toLowerCase()}
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {result.suggestions.map((s, i) => (
                    <article
                      key={`${s.city.name}-${s.city.country}`}
                      className="border border-border bg-card/40 p-6 hover:border-gold transition-colors"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">
                        #{i + 1}
                      </p>
                      <h3 className="font-display text-xl text-ink">
                        {s.city.name}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
                        {s.city.country}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {s.nearest.length === 0 ? (
                          <li className="text-sm text-muted-foreground">
                            Broad supportive pattern without a single tight line.
                          </li>
                        ) : (
                          s.nearest.map((n) => (
                            <li key={`${n.planet}-${n.angle}`} className="text-sm text-muted-foreground">
                              <span className="text-ink">
                                {n.planet} {n.angle}
                              </span>
                              {" · "}
                              ~{n.distanceKm} km
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
                  {result.preferences.length > 0 ? "7" : "6"} · Reading
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

function toneLabel(tone: PlaceAnalysis["tone"]): string {
  switch (tone) {
    case "supportive":
      return "Supportive";
    case "challenging":
      return "Challenging";
    case "mixed":
      return "Mixed";
    default:
      return "Quiet";
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
  const purposeLabel = PURPOSES.find((p) => p.id === result.purpose)?.label ?? "your purpose";

  return (
    <div className="space-y-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
      <p>
        Born in{" "}
        <span className="text-ink">{result.birthPlace.cityName}</span>
        {result.birthPlace.country ? `, ${result.birthPlace.country}` : ""}, your map is
        drawn for UTC {new Date(result.birthUtc).toUTCString()}. Your current base (
        <span className="text-ink">{result.currentPlace.cityName}</span>) is marked in gold.
      </p>

      {nearby.length > 0 ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay mb-3">
            Near you now
          </p>
          <ul className="space-y-2">
            {nearby.map((h) => (
              <li key={`${h.planet}-${h.angle}`}>
                <span className="text-ink">
                  {h.planet} {h.angle}
                </span>
                {": "}
                {describeLine(h.planet, h.angle)} (~{Math.round(h.distanceKm)} km)
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>
          No strong planetary line sits inside an 800 km orb of your current city. That
          can feel quieter, with less activation than cities that sit on an angle.
        </p>
      )}

      {result.preferences.length > 0 ? (
        <p>
          Your named preferences are scored above for{" "}
          <span className="text-ink">{purposeLabel.toLowerCase()}</span>
          {" "}using the same line weights as the open suggestions.
        </p>
      ) : null}

      <p>
        The three suggestions score catalog cities for{" "}
        <span className="text-ink">{purposeLabel.toLowerCase()}</span> by closeness to
        supportive lines (and distance from harder ones). Treat them as directional
        leads, not destiny: travel windows, timing, and your full chart still matter.
      </p>

      {result.zodiacNote ? (
        <p className="text-sm border-l-2 border-gold pl-4 text-clay italic">{result.zodiacNote}</p>
      ) : null}
    </div>
  );
}
