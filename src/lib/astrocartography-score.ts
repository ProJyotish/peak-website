import type { AcAngle, AcLine, CityInfluenceHit, GeoPoint, ResolvedPlace } from "@/lib/astro-api";
import {
  LINE_WEIGHTS,
  interpretHits,
  type PlaceKind,
  type TravelPurpose,
} from "@/lib/astrocartography-guide";

export type CandidateCity = {
  name: string;
  country: string;
  continent: string;
  /** State / province / area for region matching */
  region?: string;
  aliases?: string[];
  lat: number;
  lon: number;
};

/** Curated cities with region metadata for in-region recommendations. */
export const CANDIDATE_CITIES: CandidateCity[] = [
  // India
  { name: "New Delhi", country: "India", continent: "Asia", region: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", country: "India", continent: "Asia", region: "Maharashtra", lat: 19.076, lon: 72.8777 },
  { name: "Bengaluru", country: "India", continent: "Asia", region: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai", country: "India", continent: "Asia", region: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", country: "India", continent: "Asia", region: "West Bengal", lat: 22.5726, lon: 88.3639 },
  { name: "Hyderabad", country: "India", continent: "Asia", region: "Telangana", lat: 17.385, lon: 78.4867 },
  { name: "Goa", country: "India", continent: "Asia", region: "Goa", lat: 15.4909, lon: 73.8278 },
  { name: "Jaipur", country: "India", continent: "Asia", region: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  { name: "Pune", country: "India", continent: "Asia", region: "Maharashtra", lat: 18.5204, lon: 73.8567 },
  { name: "Ahmedabad", country: "India", continent: "Asia", region: "Gujarat", lat: 23.0225, lon: 72.5714 },
  // Middle East / SE Asia
  { name: "Dubai", country: "United Arab Emirates", continent: "Asia", aliases: ["uae"], lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", country: "Singapore", continent: "Asia", lat: 1.3521, lon: 103.8198 },
  { name: "Bangkok", country: "Thailand", continent: "Asia", lat: 13.7563, lon: 100.5018 },
  { name: "Bali", country: "Indonesia", continent: "Asia", region: "Bali", lat: -8.4095, lon: 115.1889 },
  { name: "Jakarta", country: "Indonesia", continent: "Asia", lat: -6.2088, lon: 106.8456 },
  { name: "Tokyo", country: "Japan", continent: "Asia", lat: 35.6762, lon: 139.6503 },
  { name: "Osaka", country: "Japan", continent: "Asia", lat: 34.6937, lon: 135.5023 },
  { name: "Kyoto", country: "Japan", continent: "Asia", lat: 35.0116, lon: 135.7681 },
  { name: "Seoul", country: "South Korea", continent: "Asia", aliases: ["korea"], lat: 37.5665, lon: 126.978 },
  { name: "Hong Kong", country: "China", continent: "Asia", lat: 22.3193, lon: 114.1694 },
  { name: "Shanghai", country: "China", continent: "Asia", lat: 31.2304, lon: 121.4737 },
  { name: "Beijing", country: "China", continent: "Asia", lat: 39.9042, lon: 116.4074 },
  // Oceania
  { name: "Sydney", country: "Australia", continent: "Oceania", region: "New South Wales", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", country: "Australia", continent: "Oceania", region: "Victoria", lat: -37.8136, lon: 144.9631 },
  { name: "Brisbane", country: "Australia", continent: "Oceania", region: "Queensland", lat: -27.4698, lon: 153.0251 },
  { name: "Auckland", country: "New Zealand", continent: "Oceania", lat: -36.8509, lon: 174.7645 },
  // Europe
  { name: "London", country: "United Kingdom", continent: "Europe", aliases: ["uk", "britain", "england"], region: "England", lat: 51.5074, lon: -0.1278 },
  { name: "Edinburgh", country: "United Kingdom", continent: "Europe", aliases: ["uk", "scotland"], region: "Scotland", lat: 55.9533, lon: -3.1883 },
  { name: "Paris", country: "France", continent: "Europe", region: "Île-de-France", lat: 48.8566, lon: 2.3522 },
  { name: "Lyon", country: "France", continent: "Europe", region: "Auvergne-Rhône-Alpes", lat: 45.764, lon: 4.8357 },
  { name: "Marseille", country: "France", continent: "Europe", region: "Provence-Alpes-Côte d'Azur", lat: 43.2965, lon: 5.3698 },
  { name: "Nice", country: "France", continent: "Europe", region: "Provence-Alpes-Côte d'Azur", lat: 43.7102, lon: 7.262 },
  { name: "Bordeaux", country: "France", continent: "Europe", region: "Nouvelle-Aquitaine", lat: 44.8378, lon: -0.5792 },
  { name: "Berlin", country: "Germany", continent: "Europe", lat: 52.52, lon: 13.405 },
  { name: "Munich", country: "Germany", continent: "Europe", region: "Bavaria", lat: 48.1351, lon: 11.582 },
  { name: "Hamburg", country: "Germany", continent: "Europe", lat: 53.5511, lon: 9.9937 },
  { name: "Amsterdam", country: "Netherlands", continent: "Europe", lat: 52.3676, lon: 4.9041 },
  { name: "Barcelona", country: "Spain", continent: "Europe", region: "Catalonia", lat: 41.3874, lon: 2.1686 },
  { name: "Madrid", country: "Spain", continent: "Europe", lat: 40.4168, lon: -3.7038 },
  { name: "Rome", country: "Italy", continent: "Europe", lat: 41.9028, lon: 12.4964 },
  { name: "Milan", country: "Italy", continent: "Europe", region: "Lombardy", lat: 45.4642, lon: 9.19 },
  { name: "Florence", country: "Italy", continent: "Europe", region: "Tuscany", lat: 43.7696, lon: 11.2558 },
  { name: "Lisbon", country: "Portugal", continent: "Europe", lat: 38.7223, lon: -9.1393 },
  { name: "Porto", country: "Portugal", continent: "Europe", lat: 41.1579, lon: -8.6291 },
  { name: "Istanbul", country: "Turkey", continent: "Europe", lat: 41.0082, lon: 28.9784 },
  { name: "Vienna", country: "Austria", continent: "Europe", lat: 48.2082, lon: 16.3738 },
  { name: "Prague", country: "Czechia", continent: "Europe", aliases: ["czech republic"], lat: 50.0755, lon: 14.4378 },
  { name: "Athens", country: "Greece", continent: "Europe", lat: 37.9838, lon: 23.7275 },
  { name: "Stockholm", country: "Sweden", continent: "Europe", lat: 59.3293, lon: 18.0686 },
  { name: "Dublin", country: "Ireland", continent: "Europe", lat: 53.3498, lon: -6.2603 },
  { name: "Zurich", country: "Switzerland", continent: "Europe", lat: 47.3769, lon: 8.5417 },
  // Africa
  { name: "Cairo", country: "Egypt", continent: "Africa", lat: 30.0444, lon: 31.2357 },
  { name: "Cape Town", country: "South Africa", continent: "Africa", lat: -33.9249, lon: 18.4241 },
  { name: "Johannesburg", country: "South Africa", continent: "Africa", lat: -26.2041, lon: 28.0473 },
  { name: "Nairobi", country: "Kenya", continent: "Africa", lat: -1.2921, lon: 36.8219 },
  { name: "Marrakech", country: "Morocco", continent: "Africa", lat: 31.6295, lon: -7.9811 },
  // North America
  { name: "New York", country: "United States", continent: "North America", aliases: ["usa", "us", "america"], region: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Los Angeles", country: "United States", continent: "North America", aliases: ["usa", "us"], region: "California", lat: 34.0522, lon: -118.2437 },
  { name: "San Francisco", country: "United States", continent: "North America", aliases: ["usa", "us"], region: "California", lat: 37.7749, lon: -122.4194 },
  { name: "San Diego", country: "United States", continent: "North America", aliases: ["usa", "us"], region: "California", lat: 32.7157, lon: -117.1611 },
  { name: "Chicago", country: "United States", continent: "North America", aliases: ["usa", "us"], region: "Illinois", lat: 41.8781, lon: -87.6298 },
  { name: "Miami", country: "United States", continent: "North America", aliases: ["usa", "us"], region: "Florida", lat: 25.7617, lon: -80.1918 },
  { name: "Austin", country: "United States", continent: "North America", aliases: ["usa", "us"], region: "Texas", lat: 30.2672, lon: -97.7431 },
  { name: "Seattle", country: "United States", continent: "North America", aliases: ["usa", "us"], region: "Washington", lat: 47.6062, lon: -122.3321 },
  { name: "Toronto", country: "Canada", continent: "North America", region: "Ontario", lat: 43.6532, lon: -79.3832 },
  { name: "Vancouver", country: "Canada", continent: "North America", region: "British Columbia", lat: 49.2827, lon: -123.1207 },
  { name: "Montreal", country: "Canada", continent: "North America", region: "Quebec", lat: 45.5017, lon: -73.5673 },
  { name: "Mexico City", country: "Mexico", continent: "North America", lat: 19.4326, lon: -99.1332 },
  // South America
  { name: "São Paulo", country: "Brazil", continent: "South America", lat: -23.5505, lon: -46.6333 },
  { name: "Rio de Janeiro", country: "Brazil", continent: "South America", lat: -22.9068, lon: -43.1729 },
  { name: "Buenos Aires", country: "Argentina", continent: "South America", lat: -34.6037, lon: -58.3816 },
  { name: "Santiago", country: "Chile", continent: "South America", lat: -33.4489, lon: -70.6693 },
  { name: "Lima", country: "Peru", continent: "South America", lat: -12.0464, lon: -77.0428 },
  { name: "Bogotá", country: "Colombia", continent: "South America", lat: 4.711, lon: -74.0721 },
];

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sameName(a: string, b: string): boolean {
  const na = norm(a);
  const nb = norm(b);
  return Boolean(na && nb && na === nb);
}

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

/** Clean display label - avoids "France, France" when geocoder repeats the country. */
export function formatPlaceLabel(
  query: string,
  kind: PlaceKind,
  place: ResolvedPlace,
): string {
  const q = query.trim();
  const city = (place.cityName || "").trim();
  const country = (place.country || "").trim();

  if (kind === "country" || kind === "continent") {
    if (q) return titleCase(q);
    if (city && (!country || sameName(city, country))) return city;
    if (country) return country;
    return city || "Place";
  }

  if (kind === "state") {
    const region = q ? titleCase(q) : city;
    if (country && !sameName(region, country)) return `${region}, ${country}`;
    return region || country || "Region";
  }

  // city
  if (city && country && !sameName(city, country)) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return q ? titleCase(q) : "Place";
}

function countryMatches(city: CandidateCity, token: string): boolean {
  const t = norm(token);
  if (!t) return false;
  if (norm(city.country) === t) return true;
  if (city.aliases?.some((a) => norm(a) === t)) return true;
  // allow "united states" vs "usa" via aliases on city; also partial for "korea"
  if (norm(city.country).includes(t) && t.length >= 4) return true;
  return false;
}

function continentMatches(city: CandidateCity, token: string): boolean {
  const t = norm(token);
  if (!t) return false;
  const c = norm(city.continent);
  if (c === t) return true;
  if (t === "america" && (c === "north america" || c === "south america")) return true;
  if (t === "australia" && c === "oceania") return true;
  return false;
}

function regionMatches(city: CandidateCity, token: string): boolean {
  const t = norm(token);
  if (!t || !city.region) return false;
  return norm(city.region) === t || norm(city.region).includes(t) || t.includes(norm(city.region));
}

export function citiesInPlace(
  query: string,
  kind: PlaceKind,
  resolved: ResolvedPlace,
): CandidateCity[] {
  if (kind === "city") return [];

  const tokens = [query, resolved.cityName, resolved.country].filter(Boolean) as string[];

  if (kind === "country") {
    return CANDIDATE_CITIES.filter((c) => tokens.some((t) => countryMatches(c, t)));
  }

  if (kind === "continent") {
    return CANDIDATE_CITIES.filter((c) => tokens.some((t) => continentMatches(c, t)));
  }

  // state / region: prefer explicit region tag, else nearby cities in same country
  const byRegion = CANDIDATE_CITIES.filter((c) => tokens.some((t) => regionMatches(c, t)));
  if (byRegion.length >= 2) return byRegion;

  const countryToken = resolved.country || query;
  const inCountry = CANDIDATE_CITIES.filter((c) => countryMatches(c, countryToken));
  const nearby = inCountry.filter(
    (c) => haversineKm(c, { lat: resolved.lat, lon: resolved.lon }) <= 500,
  );
  return nearby.length ? nearby : byRegion;
}

function normalizeLon(lon: number): number {
  let x = lon % 360;
  if (x > 180) x -= 360;
  if (x <= -180) x += 360;
  return x;
}

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

function distanceToLineKm(city: GeoPoint, line: AcLine): number {
  if (line.meridianLon != null) {
    const dLon = Math.abs(normalizeLon(city.lon - line.meridianLon));
    const kmPerDeg = 111.32 * Math.cos((city.lat * Math.PI) / 180);
    return dLon * Math.max(kmPerDeg, 0.01);
  }
  let best = Number.POSITIVE_INFINITY;
  for (const p of line.points) {
    best = Math.min(best, haversineKm(city, p));
  }
  return best;
}

export function hitsForPlace(lines: AcLine[], place: GeoPoint): CityInfluenceHit[] {
  return lines.map((line) => {
    const distanceKm = distanceToLineKm(place, line);
    return {
      planet: line.planet,
      angle: line.angle as AcAngle,
      distanceKm: Math.round(distanceKm * 10) / 10,
      nearestPoint:
        line.meridianLon != null
          ? { lat: place.lat, lon: line.meridianLon }
          : line.points[0] ?? null,
      meridianLon: line.meridianLon,
    };
  });
}

export function scorePlace(
  lines: AcLine[],
  place: GeoPoint,
  purpose: TravelPurpose,
  orbKm = 800,
): { score: number; hits: CityInfluenceHit[] } {
  const hits = hitsForPlace(lines, place);
  const interpreted = interpretHits(hits, purpose, orbKm);
  const score = interpreted.reduce((sum, h) => sum + h.contribution, 0);
  return { score, hits };
}

export type CityRecommendation = {
  city: CandidateCity;
  label: string;
  score: number;
  topLines: CityInfluenceHit[];
  why: string;
};

function toRecommendation(
  city: CandidateCity,
  lines: AcLine[],
  purpose: TravelPurpose,
): CityRecommendation {
  const { score, hits } = scorePlace(lines, city, purpose);
  const interpreted = interpretHits(hits, purpose, 800);
  const topLines = interpreted.slice(0, 3);
  const positive = topLines.filter((h) => (LINE_WEIGHTS[purpose][h.planet]?.[h.angle] ?? 0) > 0);
  const negative = topLines.filter((h) => (LINE_WEIGHTS[purpose][h.planet]?.[h.angle] ?? 0) < 0);
  const why =
    score >= 0
      ? positive.length
        ? `Lift from ${positive.map((h) => `${h.planet} ${h.angle}`).join(", ")}`
        : "Mild supportive orb overall"
      : negative.length
        ? `Pressure from ${negative.map((h) => `${h.planet} ${h.angle}`).join(", ")}`
        : "Weaker supportive lines nearby";

  return {
    city,
    label: `${city.name}, ${city.country}`,
    score: Math.round(score * 100) / 100,
    topLines: topLines.map(({ planet, angle, distanceKm, nearestPoint, meridianLon }) => ({
      planet,
      angle,
      distanceKm,
      nearestPoint,
      meridianLon,
    })),
    why,
  };
}

export function rankCities(
  lines: AcLine[],
  purpose: TravelPurpose,
  exclude?: { lat: number; lon: number },
): { top: CityRecommendation[]; bottom: CityRecommendation[] } {
  const ranked = CANDIDATE_CITIES.filter((c) => {
    if (!exclude) return true;
    return haversineKm(c, exclude) > 150;
  }).map((city) => toRecommendation(city, lines, purpose));

  ranked.sort((a, b) => b.score - a.score);
  return {
    top: ranked.slice(0, 3),
    bottom: [...ranked].reverse().slice(0, 3),
  };
}

/** Top cities inside a state / country / continent selection. */
export function rankCitiesWithinPlace(
  lines: AcLine[],
  purpose: TravelPurpose,
  query: string,
  kind: PlaceKind,
  resolved: ResolvedPlace,
  limit = 3,
): CityRecommendation[] {
  const pool = citiesInPlace(query, kind, resolved);
  if (!pool.length) return [];
  return pool
    .map((city) => toRecommendation(city, lines, purpose))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
