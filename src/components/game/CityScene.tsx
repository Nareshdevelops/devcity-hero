import { useCallback, useEffect, useRef, useState } from "react";
import { cityLocations, WORLD_WIDTH, type LocationId } from "@/data/locations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGame } from "@/lib/game-state";
import { Hero } from "./Hero";
import { Building } from "./Building";
import { Hud } from "./Hud";
import { LocationPanel } from "./LocationPanel";
import { toast } from "sonner";

const SPEED = 420; // world px / second
const DEPTH_SPEED = 0.55; // depth units / second
const MAX_DEPTH = 0.6;
const NEAR_RANGE = 130;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

type Pos = { x: number; depth: number };

export function CityScene({ onExit }: { onExit: () => void }) {
  const { award, unlockAchievement, discovered } = useGame();

  const [sceneH, setSceneH] = useState(480);
  const [state, setState] = useState<"idle" | "move" | "interact">("idle");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [nearby, setNearby] = useState<LocationId | null>(null);
  const [open, setOpen] = useState<LocationId | null>(null);
  const [swinging, setSwinging] = useState(false);

  const sceneRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);

  const pos = useRef<Pos>({ x: cityLocations[0]!.x + 150, depth: 0.05 });
  const keys = useRef<Set<string>>(new Set());
  const travel = useRef<{ from: Pos; to: Pos; start: number; id: LocationId } | null>(null);
  const combo = useRef("");
  const touchDir = useRef(0);

  /* scene height */
  useEffect(() => {
    const measure = () => setSceneH(sceneRef.current?.clientHeight ?? 480);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const depthOffset = useCallback((d: number) => d * sceneH * 0.3, [sceneH]);
  const depthScale = (d: number) => 1 - 0.4 * d;

  const enter = useCallback(
    (id: LocationId) => {
      const loc = cityLocations.find((l) => l.id === id)!;
      award(`loc:${id}`, loc.xp, `Location discovered: ${loc.name}`);
      setOpen(id);
      setState("interact");
    },
    [award],
  );

  const webTravel = useCallback(
    (id: LocationId) => {
      const loc = cityLocations.find((l) => l.id === id)!;
      const target = { x: loc.x + 140, depth: Math.min(loc.depth, MAX_DEPTH) };
      const dist = Math.abs(target.x - pos.current.x);
      if (dist < 60) {
        enter(id);
        return;
      }
      setFacing(target.x > pos.current.x ? 1 : -1);
      setState("move");
      setSwinging(true);
      travel.current = { from: { ...pos.current }, to: target, start: performance.now(), id };
    },
    [enter],
  );

  /* keyboard */
  useEffect(() => {
    const move = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (move.includes(k)) {
        keys.current.add(k);
        e.preventDefault();
      }
      if (k === "e" && nearby) enter(nearby);
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

  /* game loop: movement + camera parallax (imperative for performance) */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastNear: LocationId | null = null;
    let lastState: "idle" | "move" | "interact" = "idle";

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      let swingLift = 0;
      const t = travel.current;
      if (t) {
        const p = Math.min(1, (now - t.start) / 1000);
        const e = easeInOut(p);
        pos.current = {
          x: t.from.x + (t.to.x - t.from.x) * e,
          depth: t.from.depth + (t.to.depth - t.from.depth) * e,
        };
        swingLift = Math.sin(p * Math.PI) * (sceneH * 0.28);
        if (p >= 1) {
          const id = t.id;
          travel.current = null;
          setSwinging(false);
          enter(id);
        }
      } else {
        const k = keys.current;
        let dx = touchDir.current;
        let dd = 0;
        if (k.has("a") || k.has("arrowleft")) dx -= 1;
        if (k.has("d") || k.has("arrowright")) dx += 1;
        if (k.has("w") || k.has("arrowup")) dd += 1;
        if (k.has("s") || k.has("arrowdown")) dd -= 1;
        if (dx || dd) {
          pos.current = {
            x: Math.min(WORLD_WIDTH - 60, Math.max(60, pos.current.x + dx * SPEED * dt)),
            depth: Math.min(MAX_DEPTH, Math.max(0, pos.current.depth + dd * DEPTH_SPEED * dt)),
          };
          if (dx) setFacing(dx > 0 ? 1 : -1);
        }
        const next = dx || dd ? "move" : "idle";
        if (next !== lastState && !open) {
          lastState = next;
          setState(next);
        }
      }

      /* camera */
      const vw = sceneRef.current?.clientWidth ?? 1000;
      const cam = Math.min(
        Math.max(0, WORLD_WIDTH - vw),
        Math.max(0, pos.current.x - vw / 2),
      );

      if (skyRef.current) skyRef.current.style.transform = `translate3d(${-cam * 0.08}px,0,0)`;
      if (farRef.current) farRef.current.style.transform = `translate3d(${-cam * 0.28}px,0,0)`;
      if (fogRef.current) fogRef.current.style.transform = `translate3d(${-cam * 0.45}px,0,0)`;
      if (worldRef.current) worldRef.current.style.transform = `translate3d(${-cam}px,0,0)`;
      if (fgRef.current) fgRef.current.style.transform = `translate3d(${-cam * 1.35}px,0,0)`;

      const s = depthScale(pos.current.depth);
      if (playerRef.current) {
        playerRef.current.style.transform = `translate3d(${pos.current.x}px, ${-depthOffset(pos.current.depth) - swingLift}px, 0) translateX(-50%) scale(${s})`;
        playerRef.current.style.zIndex = String(500 - Math.round(pos.current.depth * 400));
      }
      if (webRef.current && travel.current) {
        const dxw = travel.current.to.x - pos.current.x;
        const len = Math.hypot(dxw, swingLift + 120);
        const ang = (Math.atan2(-(swingLift + 120), dxw) * 180) / Math.PI;
        webRef.current.style.width = `${Math.min(len, 900)}px`;
        webRef.current.style.transform = `rotate(${ang}deg)`;
      }

      /* proximity */
      const near =
        cityLocations.find(
          (l) =>
            Math.abs(l.x - pos.current.x) < NEAR_RANGE &&
            Math.abs(l.depth - pos.current.depth) < 0.3,
        )?.id ?? null;
      if (near !== lastNear) {
        lastNear = near;
        setNearby(near);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [depthOffset, enter, open, sceneH]);

  const ordered = [...cityLocations].sort((a, b) => b.depth - a.depth);

  return (
    <div className="min-h-screen">
      <div
        ref={sceneRef}
        className="city-sky relative h-[62vh] min-h-[400px] w-full overflow-hidden sm:h-[72vh]"
      >
        {/* distant skyline (barely moves) */}
        <div ref={skyRef} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
          <div className="stars absolute inset-0 opacity-70" />
          <div className="skyline-far absolute inset-x-0 bottom-[24%] h-[26%] w-[200%]" />
        </div>

        {/* mid skyline */}
        <div ref={farRef} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
          <div className="skyline-mid absolute inset-x-0 bottom-[17%] h-[22%] w-[200%]" />
        </div>

        {/* atmospheric fog band */}
        <div ref={fogRef} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
          <div className="city-fog absolute inset-x-0 bottom-[16%] h-[26%] w-[200%]" />
        </div>

        <div className="web-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden />
        <div className="city-haze pointer-events-none absolute inset-0" aria-hidden />

        {/* gameplay layer */}
        <div
          ref={worldRef}
          className="absolute inset-y-0 left-0 will-change-transform"
          style={{ width: WORLD_WIDTH }}
        >
          {/* streets / ground planes per depth */}
          <div
            className="street absolute left-0 h-[16%] w-full"
            style={{ bottom: 0 }}
            aria-hidden
          />
          <div
            className="plaza absolute left-0 w-full"
            style={{ bottom: 0, height: depthOffset(MAX_DEPTH) + 40 }}
            aria-hidden
          />
          <div
            className="street-far absolute left-0 h-[8%] w-full"
            style={{ bottom: depthOffset(MAX_DEPTH) }}
            aria-hidden
          />

          {ordered.map((l) => {
            const found = discovered.includes(`loc:${l.id}`);
            const active = nearby === l.id;
            const s = depthScale(l.depth);
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => webTravel(l.id)}
                aria-label={`Travel to ${l.name} — ${l.subtitle}`}
                className="group absolute origin-bottom transition-[filter] duration-300"
                style={{
                  left: l.x,
                  bottom: depthOffset(l.depth) + sceneH * 0.07,
                  transform: `translateX(-50%) scale(${s})`,
                  zIndex: 400 - Math.round(l.depth * 400),
                  filter: `brightness(${active ? 1.15 : 1 - l.depth * 0.35}) saturate(${1 - l.depth * 0.3})`,
                  opacity: 1 - l.depth * 0.18,
                }}
              >
                <span
                  className={`absolute -top-9 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.2em] ${
                    found ? "text-gold" : "text-signal"
                  }`}
                >
                  <span className={`mx-auto mb-1 block size-2.5 rounded-full animate-marker ${found ? "bg-gold" : "bg-signal"}`} aria-hidden />
                  {l.subtitle}
                </span>
                <Building loc={l} active={active} discovered={found} />
              </button>
            );
          })}

          {/* player */}
          <div
            ref={playerRef}
            className="absolute bottom-[7%] left-0 h-20 w-14 origin-bottom will-change-transform sm:h-28 sm:w-[4.5rem]"
          >
            <div className="hero-shadow absolute -bottom-2 left-1/2 h-2.5 w-12 -translate-x-1/2 rounded-full" aria-hidden />
            <div className={state === "idle" ? "hero-idle h-full w-full" : "h-full w-full"}>
              <Hero state={state} facing={facing} />
            </div>
            {swinging && (
              <div
                ref={webRef}
                className="web-line absolute left-1/2 top-2 h-px origin-left"
                aria-hidden
              />
            )}
          </div>
        </div>

        {/* foreground (moves fastest) */}
        <div ref={fgRef} className="pointer-events-none absolute inset-0 z-[600] will-change-transform" aria-hidden>
          <div className="fg-rooftops absolute inset-x-0 bottom-0 h-[14%] w-[220%]" />
          <div className="particles absolute inset-0" />
        </div>

        <div className="vignette pointer-events-none absolute inset-0 z-[650]" aria-hidden />

        {/* HUD */}
        <div className="absolute left-3 top-3 z-[700] w-[250px] max-w-[70vw] sm:w-[320px]">
          <Hud
            locations={cityLocations.length}
            discoveredCount={discovered.filter((d) => d.startsWith("loc:")).length}
          />
        </div>

        <div className="absolute right-3 top-3 z-[700] flex gap-2">
          <Button size="sm" variant="outline" onClick={onExit}>
            Quick Portfolio
          </Button>
        </div>

        {nearby && !open && (
          <div className="absolute bottom-4 left-1/2 z-[700] -translate-x-1/2">
            <Button size="sm" className="animate-float" onClick={() => enter(nearby)}>
              Enter {cityLocations.find((l) => l.id === nearby)?.name}
              <span className="ml-2 hidden text-xs opacity-70 sm:inline">(E)</span>
            </Button>
          </div>
        )}

        {/* touch controls */}
        <div className="absolute bottom-4 left-3 z-[700] flex gap-2 sm:hidden">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              className="hud-panel size-11 rounded-full font-display text-lg"
              aria-label={d === -1 ? "Move left" : "Move right"}
              onPointerDown={() => {
                touchDir.current = d;
                setFacing(d);
              }}
              onPointerUp={() => (touchDir.current = 0)}
              onPointerLeave={() => (touchDir.current = 0)}
              onPointerCancel={() => (touchDir.current = 0)}
            >
              {d === -1 ? "‹" : "›"}
            </button>
          ))}
        </div>
      </div>

      {/* fast travel — always available */}
      <div className="border-t border-border bg-surface/60 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Fast travel · move with WASD / arrows, press E to enter, or tap a building
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cityLocations.map((l) => (
            <Button key={l.id} size="sm" variant="secondary" onClick={() => webTravel(l.id)}>
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

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {cityLocations.find((l) => l.id === open)?.name}
            </DialogTitle>
          </DialogHeader>
          {open && <LocationPanel id={open} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
