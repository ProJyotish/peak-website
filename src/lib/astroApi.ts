/** Typed client for `POST /public/astro/*`. */

import { PUBLIC_ASTRO_API_URL } from "@/lib/api";

export type AcAngle = "MC" | "IC" | "ASC" | "DSC";

export type GeoPoint = { lat: number; lon: number };

export type AcLine = {
  planet: string;
  angle: AcAngle;
  meridianLon: number | null;
  points: GeoPoint[];
};

export type ResolvedPlace = {
  cityName: string;
  country: string;
  lat: number;
  lon: number;
  tzone: number;
  timezoneName: string | null;
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

export type AstrocartographyData = {
  birthUtc: string;
  birthPlace: ResolvedPlace;
  zodiacNote: string;
  planets: Array<{
    name: string;
    eclipticLongitude: number;
    raDeg: number;
    decDeg: number;
  }>;
  lines: AcLine[];
};

export type CityInfluenceHit = {
  planet: string;
  angle: AcAngle;
  distanceKm: number;
  nearestPoint: GeoPoint | null;
  meridianLon: number | null;
};

export type CityInfluenceData = {
  birthUtc: string;
  birthPlace: ResolvedPlace;
  targetPlace: ResolvedPlace;
  orbKm: number;
  nearby: CityInfluenceHit[];
  all: CityInfluenceHit[];
};

export type TravelTimingLevel = "favorable" | "neutral" | "unfavorable";

export type TravelTimingWindow = {
  start_date: string;
  end_date: string;
  score: number;
  level: TravelTimingLevel;
  dasha: { maha: string; antar: string };
  summary: string;
};

export type TravelTimingData = {
  birthUtc: string;
  birthPlace: ResolvedPlace;
  purpose: string;
  horizon: { start: string; end: string };
  windows: TravelTimingWindow[];
  best: TravelTimingWindow[];
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

export function fetchAstrocartography(birth: BirthPayload, planets?: string[]) {
  return postAstro<AstrocartographyData>("/astrocartography", {
    ...birth,
    planets,
  });
}

export function fetchCityInfluence(
  birth: BirthPayload,
  target: { targetCityName?: string; targetLat?: number; targetLon?: number },
  orbKm = 800,
) {
  return postAstro<CityInfluenceData>("/city-influence", {
    ...birth,
    ...target,
    orbKm,
  });
}

export function fetchTravelTiming(
  birth: BirthPayload,
  range: {
    travelStartMonth: number;
    travelStartYear: number;
    travelEndMonth: number;
    travelEndYear: number;
    purpose?: string;
  },
) {
  return postAstro<TravelTimingData>("/travel-timing", {
    ...birth,
    ...range,
  });
}
