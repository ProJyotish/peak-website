/** Client-side geometry helpers mirroring the Nest astrocartography util. */

import type { AcLine, GeoPoint } from "@/lib/astroApi";

export function normalizeLon(lon: number): number {
  let x = lon % 360;
  if (x > 180) x -= 360;
  if (x <= -180) x += 360;
  return x;
}

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
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

function distanceToMeridianKm(cityLat: number, cityLon: number, meridianLon: number): number {
  const dLon = Math.abs(normalizeLon(cityLon - meridianLon));
  const kmPerDeg = 111.32 * Math.cos((cityLat * Math.PI) / 180);
  return dLon * Math.max(kmPerDeg, 0.01);
}

function distanceToPolylineKm(city: GeoPoint, points: GeoPoint[]): number {
  if (points.length === 0) return Number.POSITIVE_INFINITY;
  let best = Number.POSITIVE_INFINITY;
  for (const p of points) {
    best = Math.min(best, haversineKm(city, p));
  }
  return best;
}

export function lineDistanceKm(city: GeoPoint, line: AcLine): number {
  if (line.meridianLon != null) {
    return distanceToMeridianKm(city.lat, city.lon, line.meridianLon);
  }
  return distanceToPolylineKm(city, line.points);
}

/** Equirectangular projection into viewBox 0..W × 0..H. */
export function project(
  lon: number,
  lat: number,
  width = 1000,
  height = 500,
): { x: number; y: number } {
  const x = ((normalizeLon(lon) + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

/** Split polyline at antimeridian jumps so SVG paths don't streak. */
export function polylineToSvgPath(
  points: GeoPoint[],
  width = 1000,
  height = 500,
): string {
  if (points.length === 0) return "";
  const parts: string[] = [];
  let d = "";
  let prevLon: number | null = null;

  for (const p of points) {
    const lon = normalizeLon(p.lon);
    const { x, y } = project(lon, p.lat, width, height);
    if (prevLon != null && Math.abs(lon - prevLon) > 180) {
      parts.push(d);
      d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else if (!d) {
      d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    prevLon = lon;
  }
  if (d) parts.push(d);
  return parts.join(" ");
}

export function meridianToSvgPath(
  meridianLon: number,
  width = 1000,
  height = 500,
): string {
  const { x } = project(meridianLon, 0, width, height);
  return `M ${x.toFixed(1)} 0 L ${x.toFixed(1)} ${height}`;
}
