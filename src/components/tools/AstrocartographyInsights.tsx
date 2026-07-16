import { ChevronDown } from "lucide-react";
import { PLANET_COLORS } from "@/components/tools/AstrocartographyMap";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ANGLE_MEANINGS,
  PLANET_MEANINGS,
  buildLocationNarrative,
  interpretHits,
  placeKindNote,
  purposeIntro,
  type PlaceKind,
  type TravelPurpose,
} from "@/lib/astrocartography-guide";
import type { AcAngle, AcLine, CityInfluenceData } from "@/lib/astro-api";
import {
  formatPlaceLabel,
  rankCitiesWithinPlace,
  scorePlace,
  type CityRecommendation,
} from "@/lib/astrocartography-score";

const ANGLES: AcAngle[] = ["MC", "IC", "ASC", "DSC"];

export type ComparedPlace = {
  query: string;
  kind: PlaceKind;
  influence: CityInfluenceData;
  score: number;
};

type PlaceComparisonProps = {
  purpose: TravelPurpose;
  places: ComparedPlace[];
  lines: AcLine[];
  userName?: string;
};

export function PlaceComparison({ purpose, places, lines, userName }: PlaceComparisonProps) {
  const ranked = [...places]
    .map((p) => {
      const orbKm = p.influence.orbKm;
      const { score } = scorePlace(lines, p.influence.targetPlace, purpose, orbKm);
      const interpreted = interpretHits(p.influence.all, purpose, orbKm);
      const label = formatPlaceLabel(p.query, p.kind, p.influence.targetPlace);
      const narrative = buildLocationNarrative(label, purpose, interpreted, score);
      const cityPicks =
        p.kind === "city"
          ? []
          : rankCitiesWithinPlace(
              lines,
              purpose,
              p.query,
              p.kind,
              p.influence.targetPlace,
              3,
            );
      return { ...p, score, interpreted, label, narrative, cityPicks };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const purposeLabel = purpose === "travel" ? "travel" : "living / relocating";

  return (
    <section className="space-y-8">
      <div className="rounded-sm border-2 border-gold/40 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-6 md:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold mb-3">
          Your answer
        </p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight text-ink max-w-3xl">
          {ranked.length === 1
            ? best.narrative.headline
            : best.score >= ranked[ranked.length - 1].score
              ? `${best.label} ranks best of your ${ranked.length} places for ${purposeLabel}`
              : `Comparing ${ranked.length} places for ${purposeLabel}`}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
          {userName?.trim() ? `${userName.trim()}, h` : "H"}ere’s how your selections stack for{" "}
          <span className="text-ink">{purposeLabel}</span> — ranked by planetary-line fit. Switch
          purpose above to re-weight the same places.
        </p>
      </div>

      <ol className="space-y-4">
        {ranked.map((place, index) => (
          <li
            key={`${place.query}-${place.kind}-${place.influence.targetPlace.lat}`}
            className={`rounded-sm border p-5 md:p-6 ${
              index === 0 ? "border-gold/50 bg-gold/5" : "border-border"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay mb-1">
                  Rank {index + 1}
                  {index === 0 ? " · best fit" : ""}
                  {index === ranked.length - 1 && ranked.length > 1 ? " · lowest of set" : ""}
                </p>
                <h3 className="font-display text-2xl text-ink">{place.label}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
                  {place.kind} · you asked “{place.query}”
                </p>
              </div>
              <p className="font-mono text-sm text-ink tabular-nums">
                {place.score >= 0 ? "+" : ""}
                {place.score.toFixed(2)}
              </p>
            </div>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {place.narrative.summary}
            </p>
            <p className="mt-2 text-xs text-clay leading-relaxed">{placeKindNote(place.kind)}</p>

            {place.cityPicks.length > 0 && (
              <div className="mt-5 rounded-sm border border-gold/30 bg-gold/5 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold mb-3">
                  Best cities in {place.label}
                </p>
                <ol className="space-y-3">
                  {place.cityPicks.map((city, i) => (
                    <li key={city.label} className="text-sm">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-ink">
                          <span className="text-clay mr-2 font-mono text-xs">{i + 1}.</span>
                          {city.city.name}
                        </p>
                        <span className="font-mono text-xs text-clay tabular-nums shrink-0">
                          {city.score >= 0 ? "+" : ""}
                          {city.score.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground pl-5 leading-relaxed">
                        {city.why}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {place.kind !== "city" && place.cityPicks.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                No curated cities mapped inside this {place.kind} yet — use the score as a
                directional read, then check specific cities.
              </p>
            )}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold mb-2">
                  How to use this place
                </p>
                <ul className="space-y-2">
                  {place.narrative.recommendations.map((r) => (
                    <li
                      key={r}
                      className="text-sm text-ink leading-relaxed border-l-2 border-gold/40 pl-3"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              {place.narrative.cautions.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay mb-2">
                    Watch-outs
                  </p>
                  <ul className="space-y-2">
                    {place.narrative.cautions.map((c) => (
                      <li
                        key={c}
                        className="text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-3"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {place.interpreted.length > 0 && (
              <details className="mt-5 group">
                <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] text-clay hover:text-ink list-none flex items-center gap-2">
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                  Line detail
                </summary>
                <ul className="mt-3 space-y-3">
                  {place.interpreted.slice(0, 5).map((hit) => (
                    <li key={`${hit.planet}-${hit.angle}`} className="text-sm leading-relaxed">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-ink">
                          <span
                            className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                            style={{
                              background: PLANET_COLORS[hit.planet] ?? "currentColor",
                            }}
                          />
                          {hit.planet} {hit.angle}
                        </span>
                        <span className="font-mono text-xs text-clay tabular-nums shrink-0">
                          {hit.distanceKm.toLocaleString()} km
                        </span>
                      </div>
                      <p className="mt-1 text-muted-foreground pl-4">{hit.blurb}</p>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

type LineMeaningsProps = {
  purpose: TravelPurpose;
};

export function LineMeanings({ purpose }: LineMeaningsProps) {
  return (
    <div className="space-y-5 pt-2">
      <p className="text-sm text-muted-foreground leading-relaxed">{purposeIntro(purpose)}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {ANGLES.map((angle) => {
          const m = ANGLE_MEANINGS[angle];
          return (
            <div key={angle} className="border-l-2 border-gold/40 pl-4">
              <h3 className="font-display text-lg text-ink">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{m.summary}</p>
              <p className="mt-2 text-sm text-ink leading-relaxed">
                {purpose === "travel" ? m.travel : m.live}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay mb-3">
          Planet themes
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {Object.entries(PLANET_MEANINGS).map(([planet, p]) => (
            <li key={planet} className="text-sm leading-relaxed">
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                style={{ background: PLANET_COLORS[planet] ?? "currentColor" }}
              />
              <span className="text-ink font-medium">{planet}</span>
              <span className="text-muted-foreground">
                {" "}
                — {p.gift}. Watch: {p.caution.toLowerCase()}.
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type CityRankingsProps = {
  purpose: TravelPurpose;
  top: CityRecommendation[];
  bottom: CityRecommendation[];
};

export function CityRankings({ purpose, top, bottom }: CityRankingsProps) {
  return (
    <div className="space-y-6 pt-2">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Extra shortlist from major cities worldwide (not your custom list), weighted for{" "}
        {purpose}.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <RankColumn title="Top 3" tone="good" items={top} />
        <RankColumn title="Bottom 3" tone="hard" items={bottom} />
      </div>
    </div>
  );
}

function RankColumn({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "good" | "hard";
  items: CityRecommendation[];
}) {
  return (
    <div
      className={`rounded-sm border p-5 ${
        tone === "good" ? "border-gold/40 bg-gold/5" : "border-border bg-parchment-deep/30"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay mb-4">{title}</p>
      <ol className="space-y-4">
        {items.map((item, i) => (
          <li key={item.label}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-lg text-ink">
                <span className="text-clay mr-2">{i + 1}.</span>
                {item.label}
              </p>
              <span className="font-mono text-xs text-clay tabular-nums shrink-0">
                {item.score >= 0 ? "+" : ""}
                {item.score.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.why}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

type SoftSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SoftSection({ title, defaultOpen = false, children }: SoftSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group rounded-sm border border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-clay hover:text-ink transition-colors">
        {title}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-5 pb-5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
