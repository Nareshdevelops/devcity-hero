import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/portfolio";
import { Hero } from "./Hero";

const BOOT = ["CONNECTING TO WEB OF CODE...", "SYSTEM ONLINE", "CITY LOADED"];

export function StartScreen({
  onPlay,
  onQuick,
}: {
  onPlay: () => void;
  onQuick: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= BOOT.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 550);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <section className="city-sky relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="web-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-70"
        aria-hidden
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 26px, oklch(0.14 0.03 264) 26px 74px)",
          maskImage: "linear-gradient(to top, black 30%, transparent)",
        }}
      />
      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 h-24 w-16 animate-float">
          <Hero />
        </div>
        <h1 className="text-glow font-display text-4xl font-bold tracking-[0.18em] sm:text-6xl">
          {profile.name.toUpperCase()}
        </h1>
        <p className="mt-2 font-display text-xl tracking-[0.4em] text-signal sm:text-2xl">
          WEB OF CODE
        </p>
        <p className="mt-3 font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {profile.role}
        </p>
        <p className="mt-6 text-sm italic text-muted-foreground">{profile.tagline}</p>

        <ul className="mx-auto mt-6 max-w-xs space-y-1 text-left font-mono text-[11px] text-signal">
          {BOOT.slice(0, step).map((line) => (
            <li key={line}>&gt; {line}</li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" className="font-display tracking-[0.2em]" onClick={onPlay}>
            ENTER THE CITY
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="font-display tracking-[0.2em]"
            onClick={onQuick}
          >
            QUICK PORTFOLIO
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Recruiters: Quick Portfolio gives every section — about, skills, projects, experience,
          education, achievements, resume and contact — with no game required.
        </p>
      </div>
    </section>
  );
}
