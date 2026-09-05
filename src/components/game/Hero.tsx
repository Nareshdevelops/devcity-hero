/** Original spider-themed developer character (pure SVG, no external assets). */
export function Hero({ state = "idle" }: { state?: "idle" | "move" | "interact" }) {
  return (
    <svg
      viewBox="0 0 40 60"
      className={`h-full w-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)] ${
        state === "move" ? "-scale-x-100" : ""
      }`}
      role="img"
      aria-label="Original spider-themed developer character"
    >
      {/* legs */}
      <path
        d={
          state === "move"
            ? "M20 38 L13 56 M20 38 L28 54"
            : "M20 38 L15 56 M20 38 L25 56"
        }
        stroke="var(--primary)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* arms */}
      <path
        d={
          state === "interact"
            ? "M20 24 L8 14 M20 24 L32 14"
            : state === "move"
              ? "M20 24 L10 32 M20 24 L30 18"
              : "M20 24 L10 34 M20 24 L30 34"
        }
        stroke="var(--signal)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* torso */}
      <path
        d="M20 12 C27 14 30 20 29 30 C28 36 24 39 20 39 C16 39 12 36 11 30 C10 20 13 14 20 12 Z"
        fill="var(--primary)"
      />
      {/* web lines on torso */}
      <path
        d="M20 13 V39 M12 22 H28 M12.5 30 H27.5"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="0.7"
        fill="none"
      />
      {/* head */}
      <circle cx="20" cy="9" r="7.5" fill="var(--primary)" />
      {/* mask eyes */}
      <path d="M14 8 q3.5 -3.5 5 0.5 q-3 3 -5 -0.5 Z" fill="var(--signal)" />
      <path d="M26 8 q-3.5 -3.5 -5 0.5 q3 3 5 -0.5 Z" fill="var(--signal)" />
    </svg>
  );
}
