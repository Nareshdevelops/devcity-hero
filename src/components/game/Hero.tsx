/**
 * Original masked urban "web" developer-hero. Pure SVG, no external assets,
 * not based on any existing character or franchise.
 */
export function Hero({
  state = "idle",
  facing = 1,
}: {
  state?: "idle" | "move" | "interact";
  facing?: 1 | -1;
}) {
  const moving = state === "move";
  const reaching = state === "interact";

  return (
    <svg
      viewBox="0 0 60 100"
      className="h-full w-full"
      style={{ transform: facing === -1 ? "scaleX(-1)" : undefined }}
      role="img"
      aria-label="Original masked spider-inspired developer hero character"
    >
      <defs>
        <linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.34 0.06 264)" />
          <stop offset="55%" stopColor="oklch(0.24 0.05 264)" />
          <stop offset="100%" stopColor="oklch(0.18 0.04 264)" />
        </linearGradient>
        <linearGradient id="suitAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="oklch(0.44 0.18 18)" />
        </linearGradient>
        <radialGradient id="heroGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--signal) 45%, transparent)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <ellipse cx="30" cy="45" rx="26" ry="34" fill="url(#heroGlow)" opacity="0.5" />

      {/* back leg */}
      <path
        className={moving ? "hero-leg-back" : undefined}
        d={moving ? "M30 62 L20 78 L23 94" : "M30 62 L23 78 L22 94"}
        stroke="url(#suit)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* back arm */}
      <path
        className={moving ? "hero-arm-back" : undefined}
        d={reaching ? "M30 40 L16 26 L12 16" : moving ? "M30 40 L20 50 L14 44" : "M30 40 L20 52 L18 62"}
        stroke="oklch(0.28 0.05 264)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* front leg */}
      <path
        className={moving ? "hero-leg-front" : undefined}
        d={moving ? "M30 62 L40 76 L38 94" : "M30 62 L36 78 L37 94"}
        stroke="url(#suitAccent)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* torso */}
      <path
        d="M30 20 C40 22 45 30 44 44 C43 55 38 63 30 63 C22 63 17 55 16 44 C15 30 20 22 30 20 Z"
        fill="url(#suit)"
        stroke="color-mix(in oklab, var(--primary) 55%, transparent)"
        strokeWidth="1"
      />
      {/* chest panels */}
      <path d="M30 21 C38 24 41 31 40 41 L30 45 Z" fill="url(#suitAccent)" opacity="0.9" />
      {/* subtle web lines */}
      <path
        d="M30 21 V62 M18 33 H42 M17 42 H43 M19 51 H41 M20 23 L40 60 M40 23 L20 60"
        stroke="color-mix(in oklab, var(--signal) 28%, transparent)"
        strokeWidth="0.5"
        fill="none"
      />
      {/* original spider emblem: 4 legs + body diamond */}
      <g stroke="var(--gold)" strokeWidth="0.9" fill="none" strokeLinecap="round">
        <path d="M30 36 L24 31 M30 36 L36 31 M30 40 L24 45 M30 40 L36 45" />
      </g>
      <path d="M30 34 L32.2 38 L30 42 L27.8 38 Z" fill="var(--gold)" />

      {/* front arm */}
      <path
        className={moving ? "hero-arm-front" : undefined}
        d={reaching ? "M30 40 L44 26 L50 18" : moving ? "M30 40 L42 48 L46 40" : "M30 40 L41 52 L43 62"}
        stroke="url(#suitAccent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* head + mask */}
      <path
        d="M30 4 C38 4 43 9 43 15 C43 21 37 25 30 25 C23 25 17 21 17 15 C17 9 22 4 30 4 Z"
        fill="url(#suit)"
        stroke="color-mix(in oklab, var(--primary) 60%, transparent)"
        strokeWidth="1"
      />
      <path
        d="M30 5 V24 M19 12 H41 M19.5 18 H40.5"
        stroke="color-mix(in oklab, var(--signal) 22%, transparent)"
        strokeWidth="0.45"
        fill="none"
      />
      {/* lenses */}
      <path d="M21 14 q4.5 -6 8 -0.5 q-4 5.5 -8 0.5 Z" fill="var(--signal)" className="hero-lens" />
      <path d="M39 14 q-4.5 -6 -8 -0.5 q4 5.5 8 0.5 Z" fill="var(--signal)" className="hero-lens" />
    </svg>
  );
}
