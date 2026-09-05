import { profile, hudStats } from "@/data/portfolio";
import { useGame, XP_GOAL } from "@/lib/game-state";

export function Hud({ locations, discoveredCount }: { locations: number; discoveredCount: number }) {
  const { level, xp, xpInLevel } = useGame();

  return (
    <div className="hud-panel pointer-events-none rounded-lg p-3 text-xs">
      <div className="flex items-center justify-between gap-6">
        <span className="font-display text-sm tracking-[0.2em]">{profile.name.toUpperCase()}</span>
        <span className="font-display text-primary">LV. {String(level).padStart(2, "0")}</span>
      </div>
      <div className="mt-2">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>XP</span>
          <span>
            {xpInLevel} / {XP_GOAL}
          </span>
        </div>
        <div className="mt-1 h-2 rounded bg-surface-2">
          <div
            className="h-full rounded bg-primary transition-[width] duration-500"
            style={{ width: `${(xpInLevel / XP_GOAL) * 100}%` }}
            aria-hidden
          />
        </div>
      </div>
      <ul className="mt-3 hidden gap-x-4 gap-y-1 sm:grid sm:grid-cols-2">
        {hudStats.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="uppercase tracking-[0.15em] text-muted-foreground">{s.label}</span>
            <span className="text-signal">{s.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Districts discovered {discoveredCount}/{locations} · total XP {xp} (game score)
      </p>
    </div>
  );
}
