import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { GameProvider } from "@/lib/game-state";
import { StartScreen } from "@/components/game/StartScreen";
import { CityScene } from "@/components/game/CityScene";
import { QuickPortfolio } from "@/components/QuickPortfolio";

const TITLE = "Naresh K.A — Web of Code | AI/ML & Data Analytics Portfolio";
const DESC =
  "Interactive game-style portfolio of Naresh K.A, B.Tech CSBS student working in Python, Data Analytics, AI/ML and web development. Projects, experience, resume and contact.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Mode = "start" | "play" | "quick";

function Index() {
  const [mode, setMode] = useState<Mode>("start");

  return (
    <GameProvider>
      {mode === "start" && (
        <StartScreen onPlay={() => setMode("play")} onQuick={() => setMode("quick")} />
      )}
      {mode === "play" && <CityScene onExit={() => setMode("quick")} />}
      {mode === "quick" && <QuickPortfolio onPlay={() => setMode("play")} />}
      <Toaster position="top-right" />
    </GameProvider>
  );
}
