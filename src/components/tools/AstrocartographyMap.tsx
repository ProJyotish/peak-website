import { useMemo } from "react";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from "geojson";
import landTopology from "world-atlas/land-110m.json";
import type { AcAngle, AcLine, GeoPoint, ResolvedPlace } from "@/lib/astro-api";

const WIDTH = 960;
const HEIGHT = 480;

const PLANET_STROKE: Record<string, string> = {
  Sun: "hsl(35 75% 42%)",
  Moon: "hsl(210 18% 48%)",
  Mercury: "hsl(160 25% 38%)",
  Venus: "hsl(340 35% 48%)",
  Mars: "hsl(8 55% 42%)",
  Jupiter: "hsl(28 55% 40%)",
  Saturn: "hsl(24 12% 32%)",
};

const ANGLE_DASH: Record<AcAngle, string | undefined> = {
  MC: undefined,
  IC: "6 4",
  ASC: "2 3",
  DSC: "8 3 2 3",
};

function project(lon: number, lat: number): { x: number; y: number } {
  return {
    x: ((lon + 180) / 360) * WIDTH,
    y: ((90 - lat) / 180) * HEIGHT,
  };
}

function ringToPath(ring: number[][]): string {
  if (ring.length < 2) return "";
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const { x, y } = project(lon, lat);
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} Z`;
}

function geometryToPath(geometry: Geometry | null | undefined): string {
  if (!geometry) return "";
  if (geometry.type === "Polygon") {
    return (geometry as Polygon).coordinates.map(ringToPath).filter(Boolean).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return (geometry as MultiPolygon).coordinates
      .flatMap((poly) => poly.map(ringToPath))
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function landPathsFromTopology(): string[] {
  const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>;
  const land = feature(topology, topology.objects.land) as
    | Feature<Geometry>
    | FeatureCollection<Geometry>;

  if (land.type === "FeatureCollection") {
    return land.features.map((f) => geometryToPath(f.geometry)).filter(Boolean);
  }
  const path = geometryToPath(land.geometry);
  return path ? [path] : [];
}

/** Split polylines that cross the antimeridian so SVG paths don't streak across the map. */
function pathFromPoints(points: GeoPoint[]): string {
  if (points.length < 2) return "";
  const parts: string[] = [];
  let d = "";
  let prevLon: number | null = null;

  for (const p of points) {
    const { x, y } = project(p.lon, p.lat);
    if (prevLon != null && Math.abs(p.lon - prevLon) > 180) {
      if (d) parts.push(d);
      d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else if (!d) {
      d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    prevLon = p.lon;
  }
  if (d) parts.push(d);
  return parts.join(" ");
}

export type MapTargetMarker = {
  place: ResolvedPlace;
  rank?: number;
};

type AstrocartographyMapProps = {
  lines: AcLine[];
  birthPlace?: ResolvedPlace | null;
  targetPlace?: ResolvedPlace | null;
  targetPlaces?: MapTargetMarker[];
  visiblePlanets: Set<string>;
  visibleAngles: Set<AcAngle>;
};

export function AstrocartographyMap({
  lines,
  birthPlace,
  targetPlace,
  targetPlaces,
  visiblePlanets,
  visibleAngles,
}: AstrocartographyMapProps) {
  const markers: MapTargetMarker[] =
    targetPlaces?.length
      ? targetPlaces
      : targetPlace
        ? [{ place: targetPlace }]
        : [];
  const filtered = lines.filter(
    (l) => visiblePlanets.has(l.planet) && visibleAngles.has(l.angle),
  );
  const landPaths = useMemo(() => landPathsFromTopology(), []);

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-[hsl(205_28%_82%)]">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Astrocartography planetary lines on a world map"
      >
        <rect width={WIDTH} height={HEIGHT} fill="hsl(205 32% 78%)" />

        <g aria-hidden>
          {landPaths.map((d, i) => (
            <path
              key={`land-${i}`}
              d={d}
              fill="hsl(38 28% 90%)"
              stroke="hsl(30 14% 62%)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Graticule */}
        {Array.from({ length: 12 }, (_, i) => {
          const lon = -180 + i * 30;
          const a = project(lon, -85);
          const b = project(lon, 85);
          return (
            <line
              key={`lon-${lon}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="hsl(30 12% 62%)"
              strokeWidth={0.5}
              opacity={0.45}
            />
          );
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const lat = -60 + i * 20;
          const a = project(-180, lat);
          const b = project(180, lat);
          return (
            <line
              key={`lat-${lat}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="hsl(30 12% 62%)"
              strokeWidth={0.5}
              opacity={0.45}
            />
          );
        })}

        {/* Equator / prime meridian accents */}
        <line
          x1={0}
          y1={project(0, 0).y}
          x2={WIDTH}
          y2={project(0, 0).y}
          stroke="hsl(28 18% 48%)"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.55}
        />
        <line
          x1={project(0, 0).x}
          y1={0}
          x2={project(0, 0).x}
          y2={HEIGHT}
          stroke="hsl(28 18% 48%)"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.55}
        />

        {filtered.map((line) => {
          const stroke = PLANET_STROKE[line.planet] ?? "hsl(24 15% 20%)";
          const d = pathFromPoints(line.points);
          if (!d) return null;
          return (
            <path
              key={`${line.planet}-${line.angle}`}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={line.angle === "MC" || line.angle === "ASC" ? 2.2 : 1.4}
              strokeOpacity={line.angle === "IC" || line.angle === "DSC" ? 0.55 : 0.9}
              strokeDasharray={ANGLE_DASH[line.angle]}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {birthPlace && (
          <g>
            <circle
              cx={project(birthPlace.lon, birthPlace.lat).x}
              cy={project(birthPlace.lon, birthPlace.lat).y}
              r={5}
              fill="hsl(var(--ink))"
            />
            <circle
              cx={project(birthPlace.lon, birthPlace.lat).x}
              cy={project(birthPlace.lon, birthPlace.lat).y}
              r={9}
              fill="none"
              stroke="hsl(var(--ink))"
              strokeWidth={1.2}
              opacity={0.4}
            />
          </g>
        )}

        {markers.map((m, i) => {
          const { x, y } = project(m.place.lon, m.place.lat);
          const label = m.rank ?? i + 1;
          return (
            <g key={`${m.place.lat}-${m.place.lon}-${label}`}>
              <circle
                cx={x}
                cy={y}
                r={7}
                fill="hsl(var(--gold))"
                stroke="hsl(var(--ink))"
                strokeWidth={1}
              />
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fill="hsl(var(--ink))"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export const PLANET_COLORS = PLANET_STROKE;
