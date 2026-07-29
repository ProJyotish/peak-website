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

export type AstrocartographyPlanetMeta = {
  name: string;
  eclipticLongitude: number;
  raDeg: number;
  decDeg: number;
};

export type AstrocartographyData = {
  birthUtc: string;
  birthPlace: ResolvedPlace;
  zodiacNote: string;
  planets: AstrocartographyPlanetMeta[];
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

export type BirthDetailsInput = {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  cityName: string;
  planets?: string[];
};

function apiBase(): string {
  const raw = (import.meta.env.VITE_ASTRO_API_URL as string | undefined)?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  // Local Nest default from peak-website .env subscription URL pattern
  return "http://localhost:3100/development/v1/public/astro";
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  let payload: { success?: boolean; data?: T; error?: string } | T;
  try {
    payload = await res.json();
  } catch {
    throw new Error(`Astro API returned non-JSON (${res.status})`);
  }
  if (!res.ok) {
    const err =
      typeof payload === "object" &&
      payload &&
      "error" in payload &&
      typeof (payload as { error?: string }).error === "string"
        ? (payload as { error: string }).error
        : `Request failed (${res.status})`;
    throw new Error(err);
  }
  if (
    typeof payload === "object" &&
    payload &&
    "success" in payload &&
    (payload as { success: boolean }).success === false
  ) {
    throw new Error((payload as { error?: string }).error || "Calculation failed");
  }
  if (typeof payload === "object" && payload && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function fetchAstrocartography(input: BirthDetailsInput): Promise<AstrocartographyData> {
  return postJson<AstrocartographyData>("/astrocartography", {
    day: input.day,
    month: input.month,
    year: input.year,
    hour: input.hour,
    min: input.min,
    cityName: input.cityName,
    ...(input.planets?.length ? { planets: input.planets } : {}),
  });
}

export function fetchCityInfluence(
  input: BirthDetailsInput & { targetCityName: string; orbKm?: number },
): Promise<CityInfluenceData> {
  return postJson<CityInfluenceData>("/city-influence", {
    day: input.day,
    month: input.month,
    year: input.year,
    hour: input.hour,
    min: input.min,
    cityName: input.cityName,
    targetCityName: input.targetCityName,
    orbKm: input.orbKm ?? 500,
    ...(input.planets?.length ? { planets: input.planets } : {}),
  });
}

export function parseBirthDateTime(dob: string, tob: string): {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
} {
  const [y, m, d] = dob.split("-").map(Number);
  const [hour, min] = tob.split(":").map(Number);
  if (![y, m, d, hour, min].every((n) => Number.isFinite(n))) {
    throw new Error("Enter a valid date and time of birth.");
  }
  return { day: d, month: m, year: y, hour, min };
}
