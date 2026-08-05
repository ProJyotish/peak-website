/** Typed client for Peak AstroCarto Chalit + legacy public astro helpers. */

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

export type BirthTimeConfidence = "exact" | "pm15" | "pm60" | "unknown";
export type LeverMode = "all" | "structure" | "tuning";

export type ActivityDef = {
  activity_id: string;
  display_name: string;
  target_bhavas: Array<{ bhava: number; weight: number }>;
  support_bhavas: Array<{ bhava: number; weight: number }>;
  adverse_bhavas: Array<{ bhava: number; weight: number }>;
  karakas: string[];
  fortune_bhava: 5 | 9 | 11;
  experience_weight: number;
  notes: string;
};

export type DasaLords = {
  md: string;
  ad: string;
  pd: string;
  weights: { md: number; ad: number; pd: number };
  start: string;
  end: string;
  nextChange: string | null;
};

export type AmplifyMuteSets = {
  amplify: string[];
  mute: string[];
  muteConflicts: string[];
  muteWarnings: string[];
};

export type HonestyFlags = {
  sandhiDisabled: boolean;
  dasaDeclined: boolean;
  homeBest: boolean;
  lowExperienceWeight: boolean;
  birthTimeUnknown: boolean;
  blurDegreesLon: number;
  experienceWeight: number;
  messages: string[];
};

export type RankedPlace = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  score: number;
  deltaVsHome: number;
  asc: number;
  mc: number;
  occupancy: Record<string, number>;
  lords: Record<number, string>;
  structureNotes: string[];
  amplified: Array<{ planet: string; expr: number; bhava: number }>;
  muted: Array<{ planet: string; expr: number; bhava: number; cost: string | null }>;
  reason: string;
  sacrifices: string[];
};

export type BoundaryCurve = {
  kind: string;
  label: string;
  planet?: string;
  bhava?: number;
  meridianLon?: number;
  points: GeoPoint[];
  role?: "amplify" | "mute" | "structure" | "digbala";
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

export type ChalitPreviewData = {
  birthUtc: string;
  birthPlace: { cityName: string; country: string; lat: number; lon: number };
  activity: ActivityDef;
  dasa: DasaLords;
  amplifyMute: AmplifyMuteSets;
  targetBhavas: number[];
  supportBhavas: number[];
  adverseBhavas: number[];
  experienceWeight: number;
  honesty: HonestyFlags;
  confirmationNotes: string[];
};

export type ChalitComputeData = {
  birthUtc: string;
  birthPlace: { cityName: string; country: string; lat: number; lon: number };
  activity: ActivityDef;
  dasa: DasaLords;
  amplifyMute: AmplifyMuteSets;
  home: {
    lat: number;
    lon: number;
    angles: { asc: number; mc: number; desc: number; ic: number };
    breakdown: { total: number; ownership: number; digbala: number; sandhi: number; dasa: number };
    assignment: { structureNotes: string[] };
  };
  shortlist: RankedPlace[];
  scoreGrid: ScoreGrid;
  boundaries: BoundaryCurve[];
  explanation: {
    dasa: string;
    structure: string;
    ownership: string;
    digbala: string;
    amplifyMute: string;
    tradeoff: string;
    birthTime: string;
  };
  honesty: HonestyFlags;
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

async function getAstro<T>(path: string): Promise<T> {
  if (!PUBLIC_ASTRO_API_URL) {
    throw new Error("VITE_API_BASE_URL is not set.");
  }
  const res = await fetch(`${PUBLIC_ASTRO_API_URL}${path}`);
  if (!res.ok) throw new Error(`Astro API HTTP ${res.status}`);
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!json.success || !json.data) {
    throw new Error(json.error || "Astro API request failed.");
  }
  return json.data;
}

export function fetchChalitActivities(q?: string) {
  const qs = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  return getAstro<{
    all: ActivityDef[];
    matched?: ActivityDef;
    confidence?: number;
    candidates?: Array<{ activity_id: string; display_name: string; score: number }>;
  }>(`/astrocarto/activities${qs}`);
}

export function fetchChalitPreview(
  birth: BirthPayload,
  opts: {
    activityId?: string;
    activityText?: string;
    activityDate?: string;
    birthTimeConfidence?: BirthTimeConfidence;
    leverMode?: LeverMode;
  },
) {
  return postAstro<ChalitPreviewData>("/astrocarto/preview", { ...birth, ...opts });
}

export function fetchChalitCompute(
  birth: BirthPayload,
  opts: {
    activityId?: string;
    activityText?: string;
    activityDate?: string;
    birthTimeConfidence?: BirthTimeConfidence;
    leverMode?: LeverMode;
    confirmedAmplify?: string[];
    confirmedMute?: string[];
    geoConstraint?: {
      countries?: string[];
      reachableLat?: number;
      reachableLon?: number;
      reachableMaxKm?: number;
    };
    gridStep?: number;
  },
) {
  return postAstro<ChalitComputeData>("/astrocarto/compute", { ...birth, ...opts });
}
