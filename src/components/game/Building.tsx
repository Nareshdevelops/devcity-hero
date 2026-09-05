import { memo } from "react";
import type { CityLocation } from "@/data/locations";

const accentVar = {
  primary: "var(--primary)",
  signal: "var(--signal)",
  gold: "var(--gold)",
} as const;

function windows(w: number, h: number, seed: number) {
  const cols = Math.max(3, Math.floor(w / 26));
  const rows = Math.max(3, Math.floor(h / 30));
  const cells: { x: number; y: number; on: boolean; delay: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = (seed * 9301 + (r * cols + c) * 49297) % 233280;
      const v = n / 233280;
      cells.push({
        x: 12 + c * ((w - 24) / cols),
        y: 26 + r * ((h - 40) / rows),
        on: v > 0.42,
        delay: (v * 6).toFixed(2) as unknown as number,
      });
    }
  }
  return cells;
}

/** One recognisable city structure with sign, windows, lighting and depth. */
export const Building = memo(function Building({
  loc,
  active,
  discovered,
}: {
  loc: CityLocation;
  active: boolean;
  discovered: boolean;
}) {
  const { width: w, height: h, shape } = loc;
  const accent = accentVar[loc.accent];
  const seed = loc.x;

  const roof =
    shape === "dome"
      ? `M0 40 Q${w / 2} -34 ${w} 40 L${w} ${h} L0 ${h} Z`
      : shape === "spire"
        ? `M0 46 L${w * 0.5} 0 L${w} 46 L${w} ${h} L0 ${h} Z`
        : shape === "tower"
          ? `M10 18 L${w - 10} 18 L${w} ${h} L0 ${h} Z`
          : shape === "lab"
            ? `M0 34 L${w * 0.22} 14 L${w * 0.78} 14 L${w} 34 L${w} ${h} L0 ${h} Z`
            : `M0 24 L${w} 24 L${w} ${h} L0 ${h} Z`;

  return (
    <svg
      viewBox={`-10 -40 ${w + 20} ${h + 50}`}
      width={w + 20}
      height={h + 50}
      className="overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={`fac-${loc.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.27 0.04 264)" />
          <stop offset="100%" stopColor="oklch(0.17 0.03 264)" />
        </linearGradient>
        <linearGradient id={`side-${loc.id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.2 0.035 264)" />
          <stop offset="100%" stopColor="oklch(0.12 0.025 264)" />
        </linearGradient>
      </defs>

      {/* perspective side face */}
      <path
        d={`M${w} ${shape === "block" ? 24 : 40} L${w + 16} ${shape === "block" ? 36 : 52} L${w + 16} ${h - 6} L${w} ${h} Z`}
        fill={`url(#side-${loc.id})`}
      />
      {/* facade */}
      <path
        d={roof}
        fill={`url(#fac-${loc.id})`}
        stroke={active ? accent : "color-mix(in oklab, var(--border) 70%, transparent)"}
        strokeWidth={active ? 2 : 1}
      />

      {/* animated windows */}
      <g>
        {windows(w, h, seed).map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={9}
            height={12}
            rx={1}
            fill={c.on ? "var(--gold)" : "oklch(0.22 0.03 264)"}
            opacity={c.on ? 0.75 : 0.5}
            className={c.on ? "city-window" : undefined}
            style={c.on ? { animationDelay: `${c.delay}s` } : undefined}
          />
        ))}
      </g>

      {/* rooftop platform + antenna */}
      <rect x={-6} y={shape === "spire" ? 44 : shape === "dome" ? 38 : 18} width={w + 12} height={6} rx={2} fill="oklch(0.3 0.04 264)" />
      <path
        d={`M${w * 0.5} ${shape === "spire" ? -18 : 18} V${shape === "spire" ? 0 : 2}`}
        stroke={accent}
        strokeWidth="2"
      />
      <circle cx={w * 0.5} cy={shape === "spire" ? -20 : 0} r="3" fill={accent} className="beacon" />

      {/* neon sign */}
      <g>
        <rect
          x={w * 0.5 - Math.min(w * 0.46, loc.name.length * 5.4)}
          y={h * 0.36}
          width={Math.min(w * 0.92, loc.name.length * 10.8)}
          height={26}
          rx={4}
          fill="oklch(0.13 0.02 264)"
          stroke={accent}
          strokeWidth={1.2}
          opacity={0.95}
        />
        <text
          x={w * 0.5}
          y={h * 0.36 + 18}
          textAnchor="middle"
          fill={accent}
          style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: 1.4 }}
        >
          {loc.name.toUpperCase()}
        </text>
      </g>

      {/* entrance */}
      <rect x={w * 0.5 - 22} y={h - 44} width={44} height={44} rx={3} fill="oklch(0.1 0.02 264)" />
      <rect
        x={w * 0.5 - 22}
        y={h - 44}
        width={44}
        height={44}
        rx={3}
        fill={accent}
        opacity={active ? 0.35 : discovered ? 0.18 : 0.1}
      />
      <rect x={w * 0.5 - 30} y={h - 50} width={60} height={5} rx={2} fill={accent} opacity={0.5} />
    </svg>
  );
});
