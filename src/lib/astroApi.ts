/** Typed client for Peak AstroCarto (lay advise + Chalit internals). */

import { PUBLIC_ASTRO_API_URL } from "@/lib/api";

export type GeoPoint = { lat: number; lon: number };

/** @deprecated Legacy Jim-Lewis line types — kept for leftover helpers. */
export type AcAngle = "MC" | "IC" | "ASC" | "DSC";
export type AcLine = {
  planet: string;
  angle: AcAngle;
  meridianLon: number | null;
  points: GeoPoint[];
};

export type BirthPayload = {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  cityName?: string;
  lat?: number;
  lon?: number;
  tzone?: number;
};

export type PlaceVerdict = "good" | "mixed" | "challenging" | "quiet";

export type AssessedPlace = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  score: number;
  deltaVsHome: number;
  verdict: PlaceVerdict;
  summary: string;
};

export type ScoreGrid = {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  step: number;
  values: number[];
  ncols: number;
  nrows: number;
};

/** Kept so leftover map components still typecheck; advise UI does not render these. */
export type BoundaryCurve = {
  kind: string;
  label: string;
  planet?: string;
  bhava?: number;
  meridianLon?: number;
  points: GeoPoint[];
  role?: string;
};

export type RankedPlace = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  score: number;
  deltaVsHome: number;
  reason?: string;
};

export type PeriodFocus = {
  major: string;
  secondary: string;
  tertiary: string;
  nextChange: string | null;
  label: string;
};

export type LayAdviseData = {
  birthUtc: string;
  birthPlace: { cityName: string; country: string; lat: number; lon: number };
  purposeLabel: string;
  travelWindow: { start: string; end: string };
  periodFocus: PeriodFocus;
  preferred: AssessedPlace[];
  alternatives: AssessedPlace[];
  scoreGrid: ScoreGrid;
  periodWarning: string | null;
  homeBest: boolean;
  summary: string;
};

type ApiEnvelope<T> = { success: boolean; data?: T; error?: string };

async function postAstro<T>(path: string, body: unknown): Promise<T> {
  if (!PUBLIC_ASTRO_API_URL) {
    throw new Error("VITE_API_BASE_URL is not set.");
  }
  const res = await fetch(`${PUBLIC_ASTRO_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Astro API HTTP ${res.status}`);
  }
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!json.success || !json.data) {
    throw new Error(json.error || "Astro API request failed.");
  }
  return json.data;
}

export type LocationPrediction = {
  placeId: string;
  description: string;
};

export async function fetchLocationAutocomplete(
  query: string,
): Promise<LocationPrediction[]> {
  if (!PUBLIC_ASTRO_API_URL) {
    throw new Error("VITE_API_BASE_URL is not set.");
  }
  const q = query.trim();
  if (q.length < 2) return [];
  const url = `${PUBLIC_ASTRO_API_URL}/location/autocomplete?q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Location autocomplete HTTP ${res.status}`);
  }
  const json = (await res.json()) as ApiEnvelope<{ predictions: LocationPrediction[] }>;
  if (!json.success || !json.data) {
    throw new Error(json.error || "Location autocomplete failed.");
  }
  return json.data.predictions ?? [];
}

export function fetchAstroAdvise(
  birth: BirthPayload,
  opts: {
    activityId?: string;
    purposeText?: string;
    travelStart?: string;
    travelEnd?: string;
    preferredPlaces?: string[];
    countries?: string[];
  },
) {
  return postAstro<LayAdviseData>("/astrocarto/advise", { ...birth, ...opts });
}
