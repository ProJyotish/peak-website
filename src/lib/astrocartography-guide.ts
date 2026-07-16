import type { AcAngle, CityInfluenceHit } from "@/lib/astro-api";

export type TravelPurpose = "travel" | "live";

export type PlaceKind = "city" | "state" | "country" | "continent";

export const PLACE_KINDS: { id: PlaceKind; label: string; hint: string }[] = [
  { id: "city", label: "City", hint: "e.g. Lisbon" },
  { id: "state", label: "State / region", hint: "e.g. California, Goa" },
  { id: "country", label: "Country", hint: "e.g. Japan, Portugal" },
  { id: "continent", label: "Continent", hint: "e.g. Europe, Asia" },
];

export function orbKmForKind(kind: PlaceKind): number {
  switch (kind) {
    case "city":
      return 800;
    case "state":
      return 1200;
    case "country":
      return 1800;
    case "continent":
      return 2500;
  }
}

export function placeKindNote(kind: PlaceKind): string {
  if (kind === "city") return "Scored at the city centre.";
  if (kind === "state")
    return "States/regions are scored at a representative point - treat as a directional read, not a street-level verdict.";
  if (kind === "country")
    return "Countries are scored at a representative point - compare countries directionally, then refine with cities.";
  return "Continents use a broad representative point - useful for shortlisting continents, not for picking a neighbourhood.";
}

export const ANGLE_MEANINGS: Record<
  AcAngle,
  { title: string; summary: string; travel: string; live: string }
> = {
  MC: {
    title: "MC - Midheaven (career & public life)",
    summary:
      "Where a planet culminates overhead. Themes of reputation, vocation, authority, and how the world sees you.",
    travel:
      "Strong for conferences, launches, interviews, and being noticed. Short trips here can amplify ambition.",
    live: "Shapes long-term career climate. Settling near a benefic MC can support status; a hard MC asks for discipline.",
  },
  IC: {
    title: "IC - Nadir (home & roots)",
    summary:
      "The private base of the chart - belonging, family, rest, and emotional foundations.",
    travel:
      "Useful for retreats, family visits, or trips that restore rather than perform. Less ideal for high-visibility work trips.",
    live: "Central for relocation. A supportive IC can feel like home; a tense IC may need intentional nesting and boundaries.",
  },
  ASC: {
    title: "ASC - Ascendant (identity & vitality)",
    summary:
      "Where a planet rises. Colors how you show up - energy, body, first impressions, and personal style.",
    travel:
      "Great for immersive trips, language learning, and reinventing how you present yourself abroad.",
    live: "Daily life feels “more you” (or more challenged) here. Affects health habits, social ease, and how locals meet you.",
  },
  DSC: {
    title: "DSC - Descendant (relationships)",
    summary:
      "Where a planet sets. Themes of partnership, clients, contracts, and who you attract.",
    travel:
      "Favors couple trips, networking, client meetings, and collaborative projects on the road.",
    live: "Relationship weather of a place - dating, marriage, business partners. Choose with care if relocating for love or co-founding.",
  },
};

export const PLANET_MEANINGS: Record<
  string,
  { theme: string; gift: string; caution: string }
> = {
  Sun: {
    theme: "Vitality, confidence, leadership",
    gift: "Visibility, clarity of purpose, creative authority",
    caution: "Ego friction, burnout if you over-identify with performance",
  },
  Moon: {
    theme: "Emotion, habits, belonging",
    gift: "Nurture, intuition, community warmth",
    caution: "Mood swings, clinginess, or restlessness if unsupported",
  },
  Mercury: {
    theme: "Mind, media, commerce",
    gift: "Learning, writing, deals, local navigation",
    caution: "Scattered focus, overthinking, communication noise",
  },
  Venus: {
    theme: "Ease, beauty, affection, money comfort",
    gift: "Pleasure, harmony, aesthetic and social grace",
    caution: "Indulgence, people-pleasing, or soft avoidance of hard choices",
  },
  Mars: {
    theme: "Drive, courage, conflict",
    gift: "Momentum, athleticism, decisive action",
    caution: "Irritation, accidents of haste, competitive heat",
  },
  Jupiter: {
    theme: "Growth, grace, opportunity",
    gift: "Expansion, mentors, optimism, luck windows",
    caution: "Overpromising, excess, or inflated expectations",
  },
  Saturn: {
    theme: "Structure, duty, time",
    gift: "Mastery, maturity, lasting foundations",
    caution: "Delays, loneliness, heavy responsibility - especially for long stays",
  },
};

/** Purpose-weighted scores: positive = supportive, negative = demanding. */
export const LINE_WEIGHTS: Record<
  TravelPurpose,
  Record<string, Partial<Record<AcAngle, number>>>
> = {
  travel: {
    Sun: { MC: 3.2, ASC: 2.4, DSC: 1.4, IC: 0.6 },
    Moon: { ASC: 2.0, IC: 2.2, DSC: 1.5, MC: 0.8 },
    Mercury: { ASC: 2.2, MC: 1.8, DSC: 1.6, IC: 0.7 },
    Venus: { ASC: 3.0, DSC: 2.8, MC: 1.6, IC: 1.8 },
    Mars: { ASC: 1.6, MC: 1.4, DSC: 0.4, IC: -0.4 },
    Jupiter: { MC: 3.5, ASC: 3.2, DSC: 2.6, IC: 2.0 },
    Saturn: { MC: -1.2, ASC: -0.8, DSC: -0.6, IC: -0.4 },
  },
  live: {
    Sun: { MC: 3.0, ASC: 2.6, DSC: 1.5, IC: 1.2 },
    Moon: { IC: 3.4, ASC: 2.8, DSC: 2.0, MC: 1.0 },
    Mercury: { ASC: 2.0, MC: 2.2, DSC: 1.8, IC: 1.0 },
    Venus: { ASC: 3.2, DSC: 3.0, IC: 2.6, MC: 1.8 },
    Mars: { ASC: -0.6, MC: 0.8, DSC: -1.0, IC: -1.2 },
    Jupiter: { MC: 3.6, ASC: 3.4, IC: 2.8, DSC: 2.8 },
    Saturn: { MC: -2.0, ASC: -1.6, DSC: -1.4, IC: -1.0 },
  },
};

export function lineBlurb(planet: string, angle: AcAngle, purpose: TravelPurpose): string {
  const p = PLANET_MEANINGS[planet];
  const a = ANGLE_MEANINGS[angle];
  if (!p || !a) return `${planet} ${angle} activates place-based themes.`;
  const purposeHint = purpose === "travel" ? a.travel : a.live;
  return `${planet} on the ${angle}: ${p.theme.toLowerCase()}. ${purposeHint}`;
}

export function purposeIntro(purpose: TravelPurpose): string {
  return purpose === "travel"
    ? "For travel we favor places that boost visibility, learning, and short-window opportunity - Mars heat can be useful; Saturn weighs less than for relocation."
    : "For living we favor emotional roots (Moon IC), ease (Venus), and long-game growth (Jupiter), while treating Saturn and sharp Mars lines with more caution.";
}

export type InterpretedHit = CityInfluenceHit & {
  weight: number;
  contribution: number;
  blurb: string;
};

export function interpretHits(
  hits: CityInfluenceHit[],
  purpose: TravelPurpose,
  orbKm = 800,
): InterpretedHit[] {
  return hits
    .filter((h) => h.distanceKm <= orbKm)
    .map((h) => {
      const weight = LINE_WEIGHTS[purpose][h.planet]?.[h.angle] ?? 0;
      const strength = Math.exp(-h.distanceKm / 350);
      return {
        ...h,
        weight,
        contribution: weight * strength,
        blurb: lineBlurb(h.planet, h.angle, purpose),
      };
    })
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}

export function buildLocationNarrative(
  cityLabel: string,
  purpose: TravelPurpose,
  interpreted: InterpretedHit[],
  totalScore: number,
): { headline: string; summary: string; recommendations: string[]; cautions: string[] } {
  const supportive = interpreted.filter((h) => h.contribution > 0.15).slice(0, 4);
  const demanding = interpreted.filter((h) => h.contribution < -0.15).slice(0, 3);

  let headline: string;
  if (totalScore >= 2.5) headline = `${cityLabel} looks strongly supportive for ${purpose}`;
  else if (totalScore >= 1) headline = `${cityLabel} leans helpful for ${purpose}`;
  else if (totalScore > -1) headline = `${cityLabel} is mixed for ${purpose}`;
  else if (totalScore > -2.5) headline = `${cityLabel} asks for care if you ${purpose === "live" ? "relocate" : "visit"}`;
  else headline = `${cityLabel} may feel demanding for ${purpose}`;

  const summary =
    supportive.length === 0 && demanding.length === 0
      ? `No major planetary lines fall within a tight orb of ${cityLabel}. Influence is milder - lifestyle fit, visas, and timing still matter more than the map alone.`
      : `Closest activations: ${interpreted
          .slice(0, 3)
          .map((h) => `${h.planet} ${h.angle} (~${Math.round(h.distanceKm)} km)`)
          .join("; ")}.`;

  const recommendations: string[] = [];
  if (purpose === "travel") {
    if (supportive.some((h) => h.planet === "Jupiter"))
      recommendations.push("Time the trip for learning, pitching, or stretching beyond your usual circle.");
    if (supportive.some((h) => h.planet === "Venus"))
      recommendations.push("Lean into art, food, and relationship-centered itineraries.");
    if (supportive.some((h) => h.planet === "Sun" && h.angle === "MC"))
      recommendations.push("Book visible moments - talks, portfolio reviews, or content shoots.");
    if (supportive.some((h) => h.planet === "Mars"))
      recommendations.push("Channel Mars with adventure, workouts, or decisive errands - pace yourself.");
  } else {
    if (supportive.some((h) => h.planet === "Moon" && (h.angle === "IC" || h.angle === "ASC")))
      recommendations.push("Prioritize neighborhood feel, routines, and a calming home base.");
    if (supportive.some((h) => h.planet === "Jupiter"))
      recommendations.push("Look for growth paths - study, mentoring, or expansive work.");
    if (supportive.some((h) => h.planet === "Venus"))
      recommendations.push("Choose beauty and social ease: green space, culture, and kind community.");
    if (supportive.some((h) => h.angle === "MC"))
      recommendations.push("Align career goals with this city’s industries - the MC amplifies public results.");
  }
  if (recommendations.length === 0) {
    recommendations.push(
      purpose === "travel"
        ? "Treat this as a neutral base - design the trip around people and purpose, not planetary promise."
        : "If you settle here, build support systems deliberately; the chart is not loudly steering the place.",
    );
  }

  const cautions: string[] = [];
  for (const h of demanding) {
    if (h.planet === "Saturn")
      cautions.push(
        purpose === "live"
          ? "Saturn nearby: expect slower results and more duty - excellent for mastery, hard for quick comfort."
          : "Saturn nearby: keep the trip structured; avoid overloading the schedule.",
      );
    if (h.planet === "Mars")
      cautions.push("Mars nearby: watch irritability, traffic, and rushing - schedule recovery time.");
  }
  if (cautions.length === 0 && totalScore < 0) {
    cautions.push("Stay honest about stress capacity; pair the place with grounding practices.");
  }

  return { headline, summary, recommendations: [...new Set(recommendations)].slice(0, 4), cautions: [...new Set(cautions)].slice(0, 3) };
}
