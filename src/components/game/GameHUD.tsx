import { useGame, XP_GOAL } from "@/lib/game-state";

export default function GameHUD() {
  const { xp, level, xpInLevel } = useGame();

  const xpPercentage = Math.min(
    (xpInLevel / XP_GOAL) * 100,
    100
  );

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 20,
        width: "280px",
        padding: "16px",
        borderRadius: "12px",
        background: "rgba(5, 7, 13, 0.88)",
        border: "1px solid rgba(103, 232, 249, 0.55)",
        boxShadow:
          "0 0 25px rgba(103, 232, 249, 0.12)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "800",
              letterSpacing: "2px",
            }}
          >
            NARESH
          </div>

          <div
            style={{
              marginTop: "3px",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#67e8f9",
            }}
          >
            WEB OF CODE
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              color: "#9ca3af",
              letterSpacing: "1px",
            }}
          >
            LEVEL
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#67e8f9",
            }}
          >
            {String(level).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* XP */}
      <div
        style={{
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
            fontSize: "10px",
            letterSpacing: "1px",
          }}
        >
          <span style={{ color: "#9ca3af" }}>
            XP PROGRESS
          </span>

          <span style={{ color: "#67e8f9" }}>
            {xpInLevel} / {XP_GOAL}
          </span>
        </div>

        <div
          style={{
            height: "7px",
            overflow: "hidden",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              width: `${xpPercentage}%`,
              height: "100%",
              borderRadius: "999px",
              background: "#67e8f9",
              boxShadow:
                "0 0 10px rgba(103, 232, 249, 0.8)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        <Stat label="CODING" value={85} />
        <Stat label="INTELLIGENCE" value={82} />
        <Stat label="CREATIVITY" value={78} />
        <Stat label="PROBLEM SOLVING" value={88} />
      </div>

      <div
        style={{
          marginTop: "14px",
          paddingTop: "10px",
          borderTop:
            "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: "9px",
          color: "#6b7280",
          letterSpacing: "1px",
          textAlign: "center",
        }}
      >
        PORTFOLIO GAME STATS
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        padding: "8px",
        borderRadius: "8px",
        background: "rgba(255, 255, 255, 0.035)",
      }}
    >
      <div
        style={{
          marginBottom: "5px",
          fontSize: "8px",
          color: "#9ca3af",
          letterSpacing: "0.8px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "4px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${value}%`,
              height: "100%",
              background: "#67e8f9",
              borderRadius: "999px",
            }}
          />
        </div>

        <span
          style={{
            fontSize: "9px",
            color: "#d1d5db",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}