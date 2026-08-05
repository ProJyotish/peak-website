/** Soft score heatmap + place markers — no astro lines or boundary overlays. */

import type { AssessedPlace, GeoPoint, ScoreGrid } from "@/lib/astroApi";
import { project } from "@/lib/astroGeo";
import { WORLD_LAND_PATHS } from "@/lib/worldLandPaths";

const W = 1000;
const H = 500;

function scoreToGold(t: number, min: number, max: number): string {
  if (!Number.isFinite(t)) return "transparent";
  const span = Math.max(max - min, 1e-6);
  const u = Math.max(0, Math.min(1, (t - min) / span));
  const a = 0.06 + u * 0.55;
  return `rgba(194, 141, 42, ${a.toFixed(3)})`;
}

type TravelMapProps = {
  scoreGrid: ScoreGrid;
  birth?: GeoPoint | null;
  preferred?: AssessedPlace[];
  alternatives?: AssessedPlace[];
};

function Landmasses() {
  return (
    <g aria-hidden>
      {WORLD_LAND_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="#E8DFD0"
          stroke="#C9BFA8"
          strokeWidth={0.4}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function ScoreCells({ grid }: { grid: ScoreGrid }) {
  const finite = grid.values.filter((v) => Number.isFinite(v));
  const min = finite.length ? Math.min(...finite) : 0;
  const max = finite.length ? Math.max(...finite) : 1;
  const cellW = (grid.step / 360) * W;
  const cellH = (grid.step / 180) * H;
  const rects = [];
  for (let r = 0; r < grid.nrows; r++) {
    for (let c = 0; c < grid.ncols; c++) {
      const v = grid.values[r * grid.ncols + c];
      if (!Number.isFinite(v)) continue;
      const lat = grid.latMax - r * grid.step;
      const lon = grid.lonMin + c * grid.step;
      const { x, y } = project(lon, lat, W, H);
      rects.push(
        <rect
          key={`${r}-${c}`}
          x={x - cellW / 2}
          y={y - cellH / 2}
          width={cellW + 0.5}
          height={cellH + 0.5}
          fill={scoreToGold(v, min, max)}
          stroke="none"
        />,
      );
    }
  }
  return <g aria-hidden>{rects}</g>;
}

export function TravelAdviseMap({
  scoreGrid,
  birth,
  preferred = [],
  alternatives = [],
}: TravelMapProps) {
  return (
    <div className="w-full overflow-hidden border border-border bg-[#F4EFE5]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Travel fit map with suggested places"
      >
        <rect width={W} height={H} fill="#F7F1E8" />
        <Landmasses />
        <ScoreCells grid={scoreGrid} />

        {birth && Number.isFinite(birth.lat) && (
          <circle
            cx={project(birth.lon, birth.lat, W, H).x}
            cy={project(birth.lon, birth.lat, W, H).y}
            r={4}
            fill="#1A1614"
          >
            <title>Birth place</title>
          </circle>
        )}

        {preferred
          .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon) && (p.lat !== 0 || p.lon !== 0))
          .map((p) => {
            const { x, y } = project(p.lon, p.lat, W, H);
            return (
              <g key={`pref-${p.name}`}>
                <circle cx={x} cy={y} r={6} fill="#C28D2A" stroke="#1A1614" strokeWidth={1} />
                <text
                  x={x + 8}
                  y={y + 3}
                  fontSize={9}
                  fontFamily="JetBrains Mono, monospace"
                  fill="#1A1614"
                >
                  {p.name}
                </text>
              </g>
            );
          })}

        {alternatives.slice(0, 10).map((p, i) => {
          const { x, y } = project(p.lon, p.lat, W, H);
          return (
            <g key={`alt-${p.name}`}>
              <circle cx={x} cy={y} r={5} fill="#1A1614" />
              <text
                x={x + 7}
                y={y + 3}
                fontSize={8}
                fontFamily="JetBrains Mono, monospace"
                fill="#1A1614"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function TravelMapLegend() {
  return (
    <div className="flex flex-wrap gap-4 font-mono text-xs text-ink/70">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2 w-6 rounded-sm bg-[#C28D2A]/60" /> Stronger fit
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#C28D2A] ring-1 ring-ink" /> Named place
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink" /> Alternative
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink" /> Birth place
      </span>
    </div>
  );
}
