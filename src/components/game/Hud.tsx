import { profile, hudStats } from "@/data/portfolio";
import { useGame, XP_GOAL } from "@/lib/game-state";

export function Hud({ locations, discoveredCount }: { locations: number; discoveredCount: number }) {
  const { level, xp, xpInLevel } = useGame();
  const pct = Math.round((xpInLevel / XP_GOAL) * 100);

  return (
    <div className="hud-panel pointer-events-none rounded-xl p-3 text-xs sm:p-4">
      <div className="flex items-center gap-3">
        <div className="relative grid size-10 shrink-0 place-items-center rounded-lg border border-primary/60 bg-surface-2/70">
          <span className="font-display text-base leading-none text-primary">
            {String(level).padStart(2, "0")}
          </span>
          <span className="absolute -bottom-2 rounded bg-primary px-1 font-display text-[8px] uppercase tracking-[0.18em] text-primary-foreground">
            lv
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm tracking-[0.22em]">
            {profile.name.toUpperCase()}
          </p>
          <p className="truncate text-[10px] uppercase tracking-[0.22em] text-signal">
            {profile.codename}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between font-display text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>XP</span>
          <span>
            {xpInLevel} / {XP_GOAL}
          </span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full border border-border/70 bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-[width] duration-700"
            style={{ width: `${pct}%`, boxShadow: "0 0 12px color-mix(in oklab, var(--primary) 60%, transparent)" }}
            aria-hidden
          />
        </div>
      </div>

      <ul className="mt-3 hidden gap-x-4 gap-y-1 sm:grid sm:grid-cols-2">
        {hudStats.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between gap-3 rounded border border-border/50 bg-surface-2/40 px-2 py-1"
          >
            <span className="uppercase tracking-[0.14em] text-muted-foreground">{s.label}</span>
            <span className="font-display text-signal">{s.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>
          Districts <span className="text-gold">{discoveredCount}</span>/{locations}
        </span>
        <span>Score {xp} XP</span>
      </div>
    </div>
  );
}
