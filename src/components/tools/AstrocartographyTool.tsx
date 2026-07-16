import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import {
  CityRankings,
  LineMeanings,
  PlaceComparison,
  SoftSection,
  type ComparedPlace,
} from "@/components/tools/AstrocartographyInsights";
import { AstrocartographyMap, PLANET_COLORS } from "@/components/tools/AstrocartographyMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PLACE_KINDS,
  orbKmForKind,
  type PlaceKind,
  type TravelPurpose,
} from "@/lib/astrocartography-guide";
import { rankCities, scorePlace } from "@/lib/astrocartography-score";
import {
  fetchAstrocartography,
  fetchCityInfluence,
  parseBirthDateTime,
  type AcAngle,
  type AstrocartographyData,
} from "@/lib/astro-api";

const DEFAULT_PLANETS = ["Sun", "Moon", "Venus", "Mars", "Jupiter", "Saturn"] as const;
const ANGLES: AcAngle[] = ["MC", "IC", "ASC", "DSC"];

type LocationDraft = {
  id: string;
  query: string;
  kind: PlaceKind;
};

function newLocation(kind: PlaceKind = "city"): LocationDraft {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, query: "", kind };
}

export function AstrocartographyTool() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");
  const [locations, setLocations] = useState<LocationDraft[]>([newLocation("city")]);
  const [purpose, setPurpose] = useState<TravelPurpose>("travel");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AstrocartographyData | null>(null);
  const [compared, setCompared] = useState<ComparedPlace[]>([]);

  const [visiblePlanets, setVisiblePlanets] = useState<Set<string>>(
    () => new Set(DEFAULT_PLANETS),
  );
  const [visibleAngles, setVisibleAngles] = useState<Set<AcAngle>>(
    () => new Set<AcAngle>(["MC", "ASC"]),
  );

  const rankings = result ? rankCities(result.lines, purpose, result.birthPlace) : null;

  const rankedMarkers =
    result && compared.length
      ? [...compared]
          .map((p) => ({
            place: p.influence.targetPlace,
            score: scorePlace(
              result.lines,
              p.influence.targetPlace,
              purpose,
              p.influence.orbKm,
            ).score,
          }))
          .sort((a, b) => b.score - a.score)
          .map((m, i) => ({ place: m.place, rank: i + 1 }))
      : [];

  function updateLocation(id: string, patch: Partial<LocationDraft>) {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function removeLocation(id: string) {
    setLocations((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  }

  function togglePlanet(planet: string) {
    setVisiblePlanets((prev) => {
      const next = new Set(prev);
      if (next.has(planet)) next.delete(planet);
      else next.add(planet);
      return next;
    });
  }

  function toggleAngle(angle: AcAngle) {
    setVisibleAngles((prev) => {
      const next = new Set(prev);
      if (next.has(angle)) next.delete(angle);
      else next.add(angle);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCompared([]);
    setLoading(true);
    try {
      const filled = locations
        .map((l) => ({ ...l, query: l.query.trim() }))
        .filter((l) => l.query.length > 0);
      if (filled.length === 0) {
        throw new Error("Add at least one place to compare (city, state, country, or continent).");
      }

      const dt = parseBirthDateTime(dob, tob);
      const birth = {
        ...dt,
        cityName: place.trim(),
        planets: [...DEFAULT_PLANETS, "Mercury"],
      };
      const data = await fetchAstrocartography(birth);
      setResult(data);

      const settled = await Promise.all(
        filled.map(async (loc) => {
          try {
            const influence = await fetchCityInfluence({
              ...birth,
              targetCityName: loc.query,
              orbKm: orbKmForKind(loc.kind),
            });
            return {
              ok: true as const,
              value: {
                query: loc.query,
                kind: loc.kind,
                influence,
                score: 0,
              } satisfies ComparedPlace,
            };
          } catch (err) {
            return {
              ok: false as const,
              query: loc.query,
              message: err instanceof Error ? err.message : "Could not resolve place",
            };
          }
        }),
      );

      const ok = settled.filter((s) => s.ok).map((s) => (s as { ok: true; value: ComparedPlace }).value);
      const failed = settled.filter((s) => !s.ok) as {
        ok: false;
        query: string;
        message: string;
      }[];

      if (ok.length === 0) {
        throw new Error(
          failed[0]?.message || "Could not analyse any of the places you entered.",
        );
      }
      setCompared(ok);
      if (failed.length) {
        setError(
          `Analysed ${ok.length} place(s). Skipped: ${failed
            .map((f) => `${f.query} (${f.message})`)
            .join("; ")}`,
        );
      }
    } catch (err) {
      setResult(null);
      setCompared([]);
      setError(err instanceof Error ? err.message : "Could not calculate map lines.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-sm border-2 border-gold/35 bg-gradient-to-br from-gold/10 to-transparent p-6 md:p-8"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold mb-2">
            Your question
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight">
            Where should I {purpose === "travel" ? "travel" : "live"}?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Add one or more places - cities, states, countries, or continents - and we rank them
            for your purpose.
          </p>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink">Purpose</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "travel", label: "Travel" },
                { id: "live", label: "Live / relocate" },
              ] as const
            ).map((opt) => {
              const on = purpose === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPurpose(opt.id)}
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border transition-colors ${
                    on
                      ? "border-gold/50 bg-gold/15 text-ink"
                      : "border-border text-clay bg-background/60"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label>Places to compare</Label>
            <button
              type="button"
              onClick={() => setLocations((prev) => [...prev, newLocation()])}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold hover:text-ink transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add place
            </button>
          </div>

          <div className="space-y-3">
            {locations.map((loc, index) => (
              <div
                key={loc.id}
                className="grid gap-3 sm:grid-cols-[8rem_1fr_auto] rounded-sm border border-border bg-background/70 p-3"
              >
                <div className="space-y-1.5">
                  <Label htmlFor={`kind-${loc.id}`} className="sr-only">
                    Place type {index + 1}
                  </Label>
                  <select
                    id={`kind-${loc.id}`}
                    value={loc.kind}
                    onChange={(e) =>
                      updateLocation(loc.id, { kind: e.target.value as PlaceKind })
                    }
                    className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-ink"
                  >
                    {PLACE_KINDS.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`q-${loc.id}`} className="sr-only">
                    Place name {index + 1}
                  </Label>
                  <Input
                    id={`q-${loc.id}`}
                    value={loc.query}
                    onChange={(e) => updateLocation(loc.id, { query: e.target.value })}
                    placeholder={PLACE_KINDS.find((k) => k.id === loc.kind)?.hint}
                    required={index === 0}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={locations.length <= 1}
                  onClick={() => removeLocation(loc.id)}
                  aria-label="Remove place"
                  className="text-clay hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 border-t border-border/70 pt-6">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ac-name">Full name</Label>
            <Input
              id="ac-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ac-dob">Date of birth</Label>
            <Input
              id="ac-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ac-tob">Time of birth</Label>
            <Input
              id="ac-tob"
              type="time"
              value={tob}
              onChange={(e) => setTob(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ac-place">Place of birth</Label>
            <Input
              id="ac-place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="City, country"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-ink text-parchment hover:bg-ink/90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Ranking places…
            </>
          ) : (
            "Rank my places"
          )}
        </Button>
      </form>

      {result && compared.length > 0 && (
        <section className="space-y-6" aria-live="polite">
          <PlaceComparison
            purpose={purpose}
            places={compared}
            lines={result.lines}
            userName={name}
          />

          <SoftSection title="Map & planetary lines">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Birth: {result.birthPlace.cityName}
                {result.birthPlace.country ? `, ${result.birthPlace.country}` : ""} · numbered gold
                markers = your ranked places
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PLANET_COLORS).map((planet) => {
                  const on = visiblePlanets.has(planet);
                  return (
                    <button
                      key={planet}
                      type="button"
                      onClick={() => togglePlanet(planet)}
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border transition-colors ${
                        on
                          ? "border-ink/30 bg-parchment-deep/60 text-ink"
                          : "border-border text-clay"
                      }`}
                    >
                      <span
                        className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                        style={{ background: PLANET_COLORS[planet] }}
                      />
                      {planet}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                {ANGLES.map((angle) => {
                  const on = visibleAngles.has(angle);
                  return (
                    <button
                      key={angle}
                      type="button"
                      onClick={() => toggleAngle(angle)}
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border transition-colors ${
                        on
                          ? "border-gold/50 bg-gold/10 text-ink"
                          : "border-border text-clay"
                      }`}
                    >
                      {angle}
                    </button>
                  );
                })}
              </div>
              <AstrocartographyMap
                lines={result.lines}
                birthPlace={result.birthPlace}
                targetPlaces={rankedMarkers}
                visiblePlanets={visiblePlanets}
                visibleAngles={visibleAngles}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-clay leading-relaxed">
                Solid = MC · dashed = IC · dotted = ASC · dash-dot = DSC
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.zodiacNote}</p>
            </div>
          </SoftSection>

          <SoftSection title="What the lines mean">
            <LineMeanings purpose={purpose} />
          </SoftSection>

          {rankings && (
            <SoftSection title="Inspiration shortlist (world cities)">
              <CityRankings purpose={purpose} top={rankings.top} bottom={rankings.bottom} />
            </SoftSection>
          )}
        </section>
      )}
    </div>
  );
}
