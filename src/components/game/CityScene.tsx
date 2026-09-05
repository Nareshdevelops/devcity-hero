import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cityLocations, type LocationId } from "@/data/locations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGame } from "@/lib/game-state";
import { Hero } from "./Hero";
import { Hud } from "./Hud";
import { LocationPanel } from "./LocationPanel";
import { toast } from "sonner";

const SPEED = 1.6;

export function CityScene({ onExit }: { onExit: () => void }) {
  const { award, unlockAchievement, discovered } = useGame();
  const [pos, setPos] = useState({ x: 9, y: 62 });
  const [state, setState] = useState<"idle" | "move" | "interact">("idle");
  const [open, setOpen] = useState<LocationId | null>(null);
  const [travelTo, setTravelTo] = useState<LocationId | null>(null);
  const keys = useRef<Set<string>>(new Set());
  const frame = useRef<number | null>(null);
  const combo = useRef("");

  const nearby = useMemo(
    () =>
      cityLocations.find((l) => Math.hypot(l.x - pos.x, (l.y - pos.y) * 0.6) < 6) ?? null,
    [pos],
  );

  const enter = useCallback(
    (id: LocationId) => {
      const loc = cityLocations.find((l) => l.id === id)!;
      award(`loc:${id}`, loc.xp, `Location discovered: ${loc.name}`);
      setOpen(id);
      setState("interact");
    },
    [award],
  );

  const travel = useCallback(
    (id: LocationId) => {
      const loc = cityLocations.find((l) => l.id === id)!;
      setTravelTo(id);
      setState("move");
      setPos({ x: loc.x, y: loc.y });
      const t = setTimeout(() => {
        setTravelTo(null);
        enter(id);
      }, 700);
      return () => clearTimeout(t);
    },
    [enter],
  );

  /* keyboard movement */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        keys.current.add(k);
        e.preventDefault();
      }
      if (k === "e" && nearby) enter(nearby.id);
      combo.current = (combo.current + k).slice(-6);
      if (combo.current === "spider") {
        unlockAchievement("easter-spider", "Secret: Web Whisperer", 100);
        combo.current = "";
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [nearby, enter, unlockAchievement]);

  useEffect(() => {
    const loop = () => {
      const k = keys.current;
      if (k.size) {
        setPos((p) => {
          let { x, y } = p;
          if (k.has("a") || k.has("arrowleft")) x -= SPEED;
          if (k.has("d") || k.has("arrowright")) x += SPEED;
          if (k.has("w") || k.has("arrowup")) y -= SPEED;
          if (k.has("s") || k.has("arrowdown")) y += SPEED;
          return { x: Math.min(96, Math.max(4, x)), y: Math.min(78, Math.max(18, y)) };
        });
        setState("move");
      } else {
        setState((s) => (s === "move" ? "idle" : s));
      }
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* CITY */}
        <div className="city-sky relative h-[62vh] min-h-[380px] w-full overflow-hidden sm:h-[70vh]">
          <div className="web-grid absolute inset-0 opacity-30" aria-hidden />
          {/* skyline layers */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 opacity-40"
            aria-hidden
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent 0 32px, oklch(0.19 0.03 264) 32px 96px)",
              maskImage: "linear-gradient(to top, black 20%, transparent)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[22%]"
            aria-hidden
            style={{
              background:
                "repeating-linear-gradient(90deg, oklch(0.14 0.025 264) 0 54px, transparent 54px 92px)",
              maskImage: "linear-gradient(to top, black 55%, transparent)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[18%] opacity-70"
            aria-hidden
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent 0 8px, color-mix(in oklab, var(--gold) 30%, transparent) 8px 11px, transparent 11px 24px)",
              maskImage: "linear-gradient(to top, black 10%, transparent 70%)",
            }}
          />


          {/* location markers */}
          {cityLocations.map((l) => {
            const found = discovered.includes(`loc:${l.id}`);
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => travel(l.id)}
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
                className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-center"
                aria-label={`Travel to ${l.name} — ${l.subtitle}`}
              >
                <span
                  className={`mx-auto block size-3 rounded-full animate-marker ${
                    found ? "bg-gold" : "bg-signal"
                  }`}
                  aria-hidden
                />
                <span className="mt-1 block whitespace-nowrap font-display text-[10px] uppercase tracking-[0.15em] text-foreground/85 group-hover:text-signal sm:text-xs">
                  {l.name}
                </span>
                <span className="hidden text-[10px] text-muted-foreground sm:block">{l.subtitle}</span>
              </button>
            );
          })}

          {/* character */}
          <div
            className="absolute z-30 h-14 w-9 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-500 ease-out sm:h-20 sm:w-12"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <Hero state={state} />
            {travelTo && (
              <span
                className="absolute left-1/2 top-0 h-px w-40 origin-left bg-signal"
                style={{ animation: "web-shoot 700ms ease-out" }}
                aria-hidden
              />
            )}
          </div>

          {/* HUD */}
          <div className="absolute left-3 top-3 z-40 w-[240px] max-w-[68vw] sm:w-[300px]">
            <Hud
              locations={cityLocations.length}
              discoveredCount={discovered.filter((d) => d.startsWith("loc:")).length}
            />
          </div>

          <div className="absolute right-3 top-3 z-40 flex gap-2">
            <Button size="sm" variant="outline" onClick={onExit}>
              Quick Portfolio
            </Button>
          </div>

          {nearby && !open && (
            <div className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2">
              <Button size="sm" onClick={() => enter(nearby.id)}>
                Enter {nearby.name} <span className="ml-2 text-xs opacity-70">(E)</span>
              </Button>
            </div>
          )}
        </div>

        {/* fallback navigation — always available */}
        <div className="border-t border-border bg-surface/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Fast travel · move with WASD / arrows, press E to enter, or tap a district
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cityLocations.map((l) => (
              <Button key={l.id} size="sm" variant="secondary" onClick={() => travel(l.id)}>
                {l.name}
              </Button>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                unlockAchievement("easter-rooftop", "Secret: Hidden Rooftop", 100);
                toast("You found the hidden rooftop.", { description: "Nice exploring." });
              }}
              aria-label="Hidden rooftop"
            >
              ⌁
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display tracking-[0.2em]">
              {cityLocations.find((l) => l.id === open)?.name.toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {open && <LocationPanel id={open} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
