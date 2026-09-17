import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { GameProvider } from "@/lib/game-state";
import { StartScreen } from "@/components/game/StartScreen";
import ThreeDWorld from "@/components/game/ThreeDWorld";
import { QuickPortfolio } from "@/components/QuickPortfolio";
import MissionBoard from "@/components/game/MissionBoard";
import AchievementHQ from "@/components/game/AchievementHQ";

const TITLE =
  "Naresh K.A — Web of Code | AI/ML & Data Analytics Portfolio";

const DESC =
  "Interactive game-based portfolio of Naresh K.A — AI/ML, Data Analytics and Python developer.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: TITLE,
      },
      {
        name: "description",
        content: DESC,
      },
    ],
  }),
  component: Index,
});

type Mode =
  | "start"
  | "play"
  | "quick"
  | "missions"
  | "achievements";

/* ========================================================= */
/* 3D CITY → PORTFOLIO SECTION MAPPING                       */
/* ========================================================= */

const sectionMap: Record<string, string> = {
  "Home Base": "home",
  "Origin Center": "about",
  "Training Center": "skills",
  "Project Lab": "projects",
  "Developer Archive": "resume",
  "Communication HQ": "contact",
  "Developer Hub": "developer-hub",
};

/* ========================================================= */
/* MAIN PAGE                                                  */
/* ========================================================= */

function Index() {
  const [mode, setMode] =
    useState<Mode>("start");

  const [portfolioSection, setPortfolioSection] =
    useState("home");

  /* ======================================================= */
  /* ENTER LOCATION FROM 3D CITY                             */
  /* ======================================================= */

  const handleEnterLocation = (
    location: string,
  ) => {
    console.log(
      "Opening location:",
      location,
    );

    /* ----------------------------------------- */
    /* Mission Board                              */
    /* ----------------------------------------- */

    if (location === "Mission Board") {
      setMode("missions");
      return;
    }

    /* ----------------------------------------- */
    /* Achievement HQ                             */
    /* ----------------------------------------- */

    if (location === "Achievement HQ") {
      setMode("achievements");
      return;
    }

    /* ----------------------------------------- */
    /* Normal portfolio locations                 */
    /* ----------------------------------------- */

    const section =
      sectionMap[location] ?? "home";

    setPortfolioSection(section);
    setMode("quick");
  };

  return (
    <GameProvider>
      {/* =================================================== */}
      {/* 3D GAME WORLD                                       */}
      {/* =================================================== */}

      <div
        style={{
          display:
            mode === "quick" ||
            mode === "missions" ||
            mode === "achievements"
              ? "none"
              : "block",
        }}
      >
        <ThreeDWorld
          onEnterLocation={
            handleEnterLocation
          }
        />
      </div>

      {/* =================================================== */}
      {/* START SCREEN                                        */}
      {/* =================================================== */}

      {mode === "start" && (
        <StartScreen
          onPlay={() =>
            setMode("play")
          }
          onQuick={() =>
            setMode("quick")
          }
        />
      )}

      {/* =================================================== */}
      {/* QUICK PORTFOLIO                                     */}
      {/* =================================================== */}

      {mode === "quick" && (
        <QuickPortfolio
          onPlay={() =>
            setMode("play")
          }
          initialSection={
            portfolioSection
          }
        />
      )}

      {/* =================================================== */}
      {/* MISSION BOARD                                       */}
      {/* =================================================== */}

      {mode === "missions" && (
        <div
          style={{
            position: "relative",
            minHeight: "100vh",
          }}
        >
          <button
            type="button"
            onClick={() =>
              setMode("play")
            }
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 50,
              padding: "10px 16px",
              borderRadius: "8px",
              border:
                "1px solid rgba(103,232,249,0.4)",
              background:
                "rgba(5,7,13,0.9)",
              color: "#67e8f9",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ← BACK TO CITY
          </button>

          <MissionBoard />
        </div>
      )}

      {/* =================================================== */}
      {/* ACHIEVEMENT HQ                                      */}
      {/* =================================================== */}

      {mode === "achievements" && (
        <div
          style={{
            position: "relative",
            minHeight: "100vh",
          }}
        >
          <button
            type="button"
            onClick={() =>
              setMode("play")
            }
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 50,
              padding: "10px 16px",
              borderRadius: "8px",
              border:
                "1px solid rgba(250,204,21,0.4)",
              background:
                "rgba(5,7,13,0.9)",
              color: "#facc15",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ← BACK TO CITY
          </button>

          <AchievementHQ />
        </div>
      )}

      {/* =================================================== */}
      {/* TOAST NOTIFICATIONS                                  */}
      {/* =================================================== */}

      <Toaster position="bottom-right" />
    </GameProvider>
  );
}