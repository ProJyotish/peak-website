import type { AcLine, GeoPoint } from "@/lib/astroApi";
import { meridianToSvgPath, polylineToSvgPath, project } from "@/lib/astroGeo";
import { PLANET_COLORS } from "@/lib/astroMeaning";
import { WORLD_LAND_PATHS } from "@/lib/worldLandPaths";

const W = 1000;
const H = 500;

type AstroWorldMapProps = {
  lines: AcLine[];
  current?: GeoPoint | null;
  birth?: GeoPoint | null;
  suggestions?: Array<{ lat: number; lon: number; label: string }>;
};

function Graticule() {
  const meridians = [];
  for (let lon = -150; lon <= 150; lon += 30) {
    const { x } = project(lon, 0, W, H);
    meridians.push(
      <line
        key={`m${lon}`}
        x1={x}
        y1={0}
        x2={x}
        y2={H}
        stroke="#D9CDB8"
        strokeWidth={0.6}
        opacity={0.7}
      />,
    );
  }
  const parallels = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const { y } = project(0, lat, W, H);
    parallels.push(
      <line
        key={`p${lat}`}
        x1={0}
        y1={y}
        x2={W}
        y2={y}
        stroke="#D9CDB8"
        strokeWidth={0.6}
        opacity={0.7}
      />,
    );
  }
  return (
    <g aria-hidden>
      {meridians}
      {parallels}
    </g>
  );
}

function Landmasses() {
  return (
    <g aria-hidden>
      {WORLD_LAND_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="#E8DFD0"
          stroke="#D0C3AB"
          strokeWidth={0.4}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

export function AstroWorldMap({ lines, current, birth, suggestions = [] }: AstroWorldMapProps) {
  return (
    <div className="w-full overflow-hidden border border-border bg-[#EFE6D8]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Astrocartography world map with planetary lines"
      >
        <rect width={W} height={H} fill="#F4EFE5" />
        <Landmasses />
        <Graticule />

        {lines.map((line) => {
          const color = PLANET_COLORS[line.planet] ?? "#1A1614";
          const d =
            line.meridianLon != null
              ? meridianToSvgPath(line.meridianLon, W, H)
              : polylineToSvgPath(line.points, W, H);
          if (!d) return null;
          return (
            <path
              key={`${line.planet}-${line.angle}`}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={line.angle === "MC" || line.angle === "IC" ? 1.6 : 1.25}
              strokeOpacity={0.9}
              strokeDasharray={line.angle === "IC" || line.angle === "DSC" ? "4 3" : undefined}
            />
          );
        })}

        {birth ? <BirthMarker point={birth} /> : null}
        {current ? <CurrentMarker point={current} /> : null}
        {suggestions.map((s) => {
          const { x, y } = project(s.lon, s.lat, W, H);
          return (
            <g key={`${s.label}-${s.lat}-${s.lon}`} transform={`translate(${x}, ${y})`}>
              <circle r={5} fill="#1A1614" opacity={0.85} />
              <text
                y={-10}
                textAnchor="middle"
                style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", fill: "#1A1614" }}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CurrentMarker({ point }: { point: GeoPoint }) {
  const { x, y } = project(point.lon, point.lat, W, H);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={10} fill="#C28D2A" opacity={0.25} />
      <circle r={5} fill="#C28D2A" stroke="#1A1614" strokeWidth={1.2} />
      <text
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", fill: "#8A7360" }}
      >
        You are here
      </text>
    </g>
  );
}

function BirthMarker({ point }: { point: GeoPoint }) {
  const { x, y } = project(point.lon, point.lat, W, H);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={3.5} fill="#1A1614" />
    </g>
  );
}

export function MapLegend({ planets }: { planets: string[] }) {
  const unique = [...new Set(planets)];
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {unique.map((p) => (
        <li key={p} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: PLANET_COLORS[p] ?? "#1A1614" }}
          />
          {p}
        </li>
      ))}
      <li className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
        <span className="inline-block h-2 w-2 rounded-full bg-gold" />
        Current
      </li>
    </ul>
  );
}
