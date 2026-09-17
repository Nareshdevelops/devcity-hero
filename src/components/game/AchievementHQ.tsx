import {
  achievements,
  lockedAchievementSlots,
} from "@/data/portfolio";

export default function AchievementHQ() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "48px 24px",
        background:
          "linear-gradient(180deg, #05070d 0%, #0b1020 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "36px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#facc15",
              marginBottom: "8px",
            }}
          >
            ACHIEVEMENT HQ
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              letterSpacing: "2px",
            }}
          >
            TROPHY ROOM
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            Milestones unlocked along the journey.
          </p>
        </div>

        {/* ACHIEVEMENTS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >
          {achievements.map((achievement) => (
            <article
              key={achievement.id}
              style={{
                padding: "22px",
                borderRadius: "14px",
                background:
                  "rgba(15, 23, 42, 0.9)",
                border:
                  "1px solid rgba(250, 204, 21, 0.25)",
                boxShadow:
                  "0 0 22px rgba(250, 204, 21, 0.06)",
              }}
            >
              {/* TROPHY */}
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  borderRadius: "12px",
                  background:
                    "rgba(250, 204, 21, 0.08)",
                  border:
                    "1px solid rgba(250, 204, 21, 0.2)",
                  fontSize: "22px",
                }}
              >
                🏆
              </div>

              {/* STATUS */}
              <div
                style={{
                  marginBottom: "9px",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  color: "#facc15",
                }}
              >
                UNLOCKED
              </div>

              {/* NAME */}
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "18px",
                  lineHeight: 1.35,
                }}
              >
                {achievement.name}
              </h2>

              {/* DETAIL */}
              <p
                style={{
                  margin: 0,
                  color: "#9ca3af",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                {achievement.detail}
              </p>

              {/* XP */}
              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "13px",
                  borderTop:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    color: "#6b7280",
                    letterSpacing: "1px",
                  }}
                >
                  REWARD
                </span>

                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#facc15",
                  }}
                >
                  +{achievement.xp} XP
                </div>
              </div>
            </article>
          ))}

          {/* LOCKED SLOTS */}
          {Array.from(
            { length: lockedAchievementSlots },
            (_, index) => (
              <article
                key={`locked-${index}`}
                style={{
                  padding: "22px",
                  borderRadius: "14px",
                  background:
                    "rgba(15, 23, 42, 0.55)",
                  border:
                    "1px dashed rgba(156, 163, 175, 0.2)",
                  opacity: 0.65,
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    borderRadius: "12px",
                    background:
                      "rgba(255,255,255,0.035)",
                    fontSize: "20px",
                  }}
                >
                  🔒
                </div>

                <div
                  style={{
                    marginBottom: "9px",
                    fontSize: "9px",
                    letterSpacing: "2px",
                    color: "#6b7280",
                  }}
                >
                  LOCKED
                </div>

                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: "18px",
                  }}
                >
                  Future Achievement
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  A new milestone will be unlocked here.
                </p>
              </article>
            )
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            fontSize: "10px",
            color: "#6b7280",
            letterSpacing: "1px",
          }}
        >
          ACHIEVEMENTS ARE PORTFOLIO MILESTONES · XP IS GAME SCORE ONLY
        </div>
      </div>
    </section>
  );
}