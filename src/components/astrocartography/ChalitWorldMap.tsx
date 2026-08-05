/** Chalit mosaic world map: score ramp + boundary curves. */

import type { BoundaryCurve, GeoPoint, RankedPlace, ScoreGrid } from "@/lib/astroApi";
import { project, polylineToSvgPath, meridianToSvgPath } from "@/lib/astroGeo";
import { WORLD_LAND_PATHS } from "@/lib/worldLandPaths";

const W = 1000;
const H = 500;

/** Brihaspati Gold single-hue ramp on Bone. */
function scoreToGold(t: number, min: number, max: number): string {
  if (!Number.isFinite(t)) return "transparent";
  const span = Math.max(max - min, 1e-6);
  const u = Math.max(0, Math.min(1, (t - min) / span));
  // gold #C28D2A ≈ rgb(194,141,42)
  const a = 0.08 + u * 0.72;
  return `rgba(194, 141, 42, ${a.toFixed(3)})`;
}

type ChalitWorldMapProps = {
  scoreGrid: ScoreGrid;
  boundaries: BoundaryCurve[];
  blurDegreesLon: number;
  birth?: GeoPoint | null;
  shortlist?: RankedPlace[];
  hoverLabel?: string | null;
  onBoundaryHover?: (label: string | null) => void;
};

function Landmasses() {
  return (
    <g aria-hidden>
      {WORLD_LAND_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="#E8DFD0"
          stroke="#6B6560"
          strokeWidth={0.45}
          strokeLinejoin="round"
          opacity={0.95}
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

function CapHatch() {
  // Mask |φ| > 66 as low-opacity Graphite hatch bands
  const top = project(0, 90, W, H).y;
  const capY = project(0, 66, W, H).y;
  const botCap = project(0, -66, W, H).y;
  const bot = project(0, -90, W, H).y;
  return (
    <g aria-hidden>
      <rect x={0} y={top} width={W} height={capY - top} fill="#6B6560" opacity={0.18} />
      <rect x={0} y={botCap} width={W} height={bot - botCap} fill="#6B6560" opacity={0.18} />
    </g>
  );
}

export function ChalitWorldMap({
  scoreGrid,
  boundaries,
  blurDegreesLon,
  birth,
  shortlist = [],
  onBoundaryHover,
}: ChalitWorldMapProps) {
  const blurPx = Math.max(0.5, Math.min(12, blurDegreesLon * 1.2));

  return (
    <div className="w-full overflow-hidden border border-border bg-[#F4EFE5]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label="AstroCarto score mosaic with bhāva boundary curves"
      >
        <defs>
          <filter id="boundaryBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={blurPx * 0.35} />
          </filter>
        </defs>
        <rect width={W} height={H} fill="#F7F1E8" />
        <Landmasses />
        <ScoreCells grid={scoreGrid} />
        <CapHatch />

        {boundaries.map((b, i) => {
          const isMute = b.role === "mute" || b.kind === "mute_sandhi";
          const isDig = b.role === "digbala" || b.kind.startsWith("digbala");
          const stroke = isDig ? "#C28D2A" : "#4A453F";
          const d =
            b.meridianLon != null
              ? meridianToSvgPath(b.meridianLon, W, H)
              : polylineToSvgPath(b.points, W, H);
          if (!d) return null;
          return (
            <g key={`${b.kind}-${i}`}>
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={isDig ? 1.4 : 0.9}
                strokeDasharray={isMute ? "4 3" : undefined}
                opacity={isDig ? 0.95 : 0.65}
                filter="url(#boundaryBlur)"
                onMouseEnter={() => onBoundaryHover?.(b.label)}
                onMouseLeave={() => onBoundaryHover?.(null)}
                style={{ cursor: "help" }}
              />
              {isDig && b.points[Math.floor(b.points.length / 2)] && (
                <TriangleTag
                  point={b.points[Math.floor(b.points.length / 2)]}
                  label={(b.planet ?? "?").slice(0, 2)}
                />
              )}
              {isMute && b.points[Math.floor(b.points.length / 2)] && (
                <EllipseTag point={b.points[Math.floor(b.points.length / 2)]} />
              )}
            </g>
          );
        })}

        {birth && (
          <circle
            cx={project(birth.lon, birth.lat, W, H).x}
            cy={project(birth.lon, birth.lat, W, H).y}
            r={4}
            fill="#1A1614"
          />
        )}

        {shortlist.slice(0, 8).map((p, i) => {
          const { x, y } = project(p.lon, p.lat, W, H);
          return (
            <g key={`${p.name}-${i}`}>
              <circle cx={x} cy={y} r={5} fill="#C28D2A" stroke="#1A1614" strokeWidth={0.8} />
              <text
                x={x + 7}
                y={y + 3}
                fontSize={9}
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

function TriangleTag({ point, label }: { point: GeoPoint; label: string }) {
  const { x, y } = project(point.lon, point.lat, W, H);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points="0,-6 5,4 -5,4" fill="#C28D2A" stroke="#1A1614" strokeWidth={0.4} />
      <text y={12} textAnchor="middle" fontSize={7} fill="#1A1614" fontFamily="JetBrains Mono, monospace">
        {label}
      </text>
    </g>
  );
}

function EllipseTag({ point }: { point: GeoPoint }) {
  const { x, y } = project(point.lon, point.lat, W, H);
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={5}
      ry={3}
      fill="none"
      stroke="#6B6560"
      strokeWidth={1.1}
    />
  );
}

export function ChalitMapLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-ink/70 font-mono">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2 w-6 rounded-sm bg-[#C28D2A]/70" /> Score (Brihaspati Gold)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-6 bg-[#4A453F]" /> Structure edges
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-6 bg-[#C28D2A]" /> Digbala maxima
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2 w-4 rounded-full border border-[#6B6560]" /> Mute sandhi
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-3 w-6 bg-[#6B6560]/30" /> Beyond ±66°
      </span>
    </div>
  );
}
