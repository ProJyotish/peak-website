/** Purpose weights + short interpretations for planet/angle pairs. */

import type { AcAngle, AcLine, GeoPoint } from "@/lib/astroApi";
import type { CatalogCity } from "@/lib/astroCities";
import { CATALOG_CITIES } from "@/lib/astroCities";
import { haversineKm, lineDistanceKm } from "@/lib/astroGeo";

export type TravelPurpose =
  | "travel_leisure"
  | "travel_business"
  | "settlement";

export const PURPOSES: Array<{ id: TravelPurpose; label: string; blurb: string }> = [
  {
    id: "travel_leisure",
    label: "Travel · leisure",
    blurb: "Ease, pleasure, restoration. Venus and Jupiter angles lead.",
  },
  {
    id: "travel_business",
    label: "Travel · business",
    blurb: "Visibility and drive. Sun, Mercury, and Mars on the MC.",
  },
  {
    id: "settlement",
    label: "Settlement",
    blurb: "Roots and belonging. Moon, Venus, and Jupiter on the IC.",
  },
];

type WeightKey = `${string}:${AcAngle}`;

const PURPOSE_WEIGHTS: Record<TravelPurpose, Partial<Record<WeightKey, number>>> = {
  travel_leisure: {
    "Venus:ASC": 1.4,
    "Venus:DSC": 1.3,
    "Jupiter:ASC": 1.3,
    "Jupiter:DSC": 1.2,
    "Moon:ASC": 1.0,
    "Sun:ASC": 0.7,
    "Saturn:ASC": -0.6,
    "Saturn:MC": -0.5,
    "Mars:ASC": -0.4,
  },
  travel_business: {
    "Sun:MC": 1.5,
    "Mercury:MC": 1.3,
    "Mars:MC": 1.2,
    "Jupiter:MC": 1.2,
    "Sun:ASC": 0.9,
    "Mercury:ASC": 0.8,
    "Saturn:MC": 0.4,
    "Moon:IC": -0.3,
    "Venus:IC": -0.2,
  },
  settlement: {
    "Moon:IC": 1.5,
    "Venus:IC": 1.3,
    "Jupiter:IC": 1.2,
    "Sun:IC": 0.9,
    "Moon:ASC": 0.8,
    "Venus:ASC": 0.7,
    "Saturn:IC": 0.3,
    "Mars:ASC": -0.5,
    "Mars:MC": -0.3,
  },
};

const LINE_BLURBS: Partial<Record<WeightKey, string>> = {
  "Sun:MC": "Career visibility and authority peak here.",
  "Sun:ASC": "Identity feels brighter; you show up more fully.",
  "Moon:IC": "Emotional home and belonging run deep.",
  "Moon:ASC": "Mood and instincts sit close to the surface.",
  "Mercury:MC": "Ideas, deals, and writing find an audience.",
  "Venus:ASC": "Pleasure, art, and ease of relating.",
  "Venus:DSC": "Partnerships and romance draw close.",
  "Venus:IC": "Home life softens; beauty in the everyday.",
  "Mars:MC": "Drive and ambition get sharp edge.",
  "Mars:ASC": "Energy is high: channel it deliberately.",
  "Jupiter:ASC": "Expansion, luck, and open doors.",
  "Jupiter:MC": "Professional growth and recognition.",
  "Jupiter:IC": "A place that can hold a larger life.",
  "Jupiter:DSC": "Beneficial alliances find you.",
  "Saturn:MC": "Serious work, structure, and long games.",
  "Saturn:ASC": "Discipline that rewards if you meet it.",
  "Saturn:IC": "Building foundations that last.",
};

export function describeLine(planet: string, angle: AcAngle): string {
  return (
    LINE_BLURBS[`${planet}:${angle}`] ??
    `${planet} on the ${angle}: a notable angular emphasis in this place.`
  );
}

export type PlaceLineHit = {
  planet: string;
  angle: AcAngle;
  distanceKm: number;
  blurb: string;
  weight: number;
};

export type PlaceAnalysis = {
  label: "City" | "State" | "Country";
  query: string;
  place: ResolvedPlaceLike;
  score: number;
  tone: "supportive" | "mixed" | "challenging" | "quiet";
  summary: string;
  hits: PlaceLineHit[];
};

type ResolvedPlaceLike = {
  cityName: string;
  country: string;
  lat: number;
  lon: number;
};

type InfluenceLike = {
  targetPlace: ResolvedPlaceLike;
  nearby: Array<{ planet: string; angle: AcAngle; distanceKm: number }>;
  all: Array<{ planet: string; angle: AcAngle; distanceKm: number }>;
};

export function analyzePreferredPlace(
  label: PlaceAnalysis["label"],
  query: string,
  influence: InfluenceLike,
  purpose: TravelPurpose,
): PlaceAnalysis {
  const weights = PURPOSE_WEIGHTS[purpose];
  const pool = influence.nearby.length > 0 ? influence.nearby : influence.all.slice(0, 8);
  let score = 0;
  const hits: PlaceLineHit[] = [];

  for (const h of pool) {
    const key = `${h.planet}:${h.angle}` as WeightKey;
    const weight = weights[key] ?? 0;
    const proximity = 1 / (1 + h.distanceKm / 500);
    score += weight * proximity;
    if (h.distanceKm <= 900) {
      hits.push({
        planet: h.planet,
        angle: h.angle,
        distanceKm: Math.round(h.distanceKm),
        blurb: describeLine(h.planet, h.angle),
        weight,
      });
    }
  }

  hits.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.distanceKm - b.distanceKm;
  });

  const top = hits.slice(0, 4);
  let tone: PlaceAnalysis["tone"] = "quiet";
  if (top.length === 0) tone = "quiet";
  else if (score >= 0.55) tone = "supportive";
  else if (score <= -0.25) tone = "challenging";
  else tone = "mixed";

  const purposeLabel = PURPOSES.find((p) => p.id === purpose)?.label.toLowerCase() ?? "your purpose";
  const placeName =
    influence.targetPlace.cityName ||
    [influence.targetPlace.cityName, influence.targetPlace.country].filter(Boolean).join(", ") ||
    query;

  let summary: string;
  if (tone === "quiet") {
    summary = `${placeName} sits away from strong lines for ${purposeLabel}. Expect a quieter field with less planetary charge than places on an angle.`;
  } else if (tone === "supportive") {
    summary = `${placeName} leans supportive for ${purposeLabel}. The closest weighted lines favor ease or visibility for that intent.`;
  } else if (tone === "challenging") {
    summary = `${placeName} carries more friction for ${purposeLabel}. Nearby hard lines suggest structure and effort more than flow.`;
  } else {
    summary = `${placeName} is mixed for ${purposeLabel}: helpful and harder lines land nearby, so timing and how you use the stay matter.`;
  }

  return {
    label,
    query,
    place: influence.targetPlace,
    score,
    tone,
    summary,
    hits: top,
  };
}

export type ScoredSuggestion = {
  city: CatalogCity;
  score: number;
  nearest: Array<{ planet: string; angle: AcAngle; distanceKm: number; blurb: string }>;
};

export function scoreCitiesForPurpose(
  lines: AcLine[],
  purpose: TravelPurpose,
  excludeNear: GeoPoint[],
  excludeRadiusKm = 400,
): ScoredSuggestion[] {
  const weights = PURPOSE_WEIGHTS[purpose];
  const scored: ScoredSuggestion[] = [];

  for (const city of CATALOG_CITIES) {
    const here = { lat: city.lat, lon: city.lon };
    if (excludeNear.some((p) => haversineKm(here, p) < excludeRadiusKm)) {
      continue;
    }

    let score = 0;
    const nearest: ScoredSuggestion["nearest"] = [];

    for (const line of lines) {
      const key = `${line.planet}:${line.angle}` as WeightKey;
      const weight = weights[key];
      if (weight == null) continue;
      const dist = lineDistanceKm(here, line);
      if (!Number.isFinite(dist)) continue;
      // Soft falloff ~500 km orb; positive weights add, negative penalize when close.
      const proximity = 1 / (1 + dist / 500);
      score += weight * proximity;
      if (dist < 900 && weight > 0) {
        nearest.push({
          planet: line.planet,
          angle: line.angle,
          distanceKm: Math.round(dist),
          blurb: describeLine(line.planet, line.angle),
        });
      }
    }

    nearest.sort((a, b) => a.distanceKm - b.distanceKm);
    scored.push({ city, score, nearest: nearest.slice(0, 3) });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

export const PLANET_COLORS: Record<string, string> = {
  Sun: "#C28D2A",
  Moon: "#8A7360",
  Mercury: "#6B7C5E",
  Venus: "#B56B6B",
  Mars: "#A3533A",
  Jupiter: "#5C6B8A",
  Saturn: "#4A4A4A",
};
