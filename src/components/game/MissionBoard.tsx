import {
  experience,
  internationalQuest,
} from "@/data/portfolio";

export default function MissionBoard() {
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
              color: "#67e8f9",
              marginBottom: "8px",
            }}
          >
            MISSION BOARD
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              letterSpacing: "2px",
            }}
          >
            CAREER MISSIONS
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            Every experience is part of the journey.
          </p>
        </div>

        {/* EXPERIENCE MISSIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {experience.map((mission, index) => (
            <article
              key={mission.id}
              style={{
                position: "relative",
                padding: "22px",
                borderRadius: "14px",
                background:
                  "rgba(15, 23, 42, 0.9)",
                border:
                  "1px solid rgba(103, 232, 249, 0.25)",
                boxShadow:
                  "0 0 20px rgba(103, 232, 249, 0.06)",
              }}
            >
              {/* MISSION TYPE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "2px",
                    color: "#67e8f9",
                  }}
                >
                  MISSION{" "}
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  style={{
                    fontSize: "10px",
                    padding: "5px 8px",
                    borderRadius: "6px",
                    background:
                      "rgba(255,255,255,0.06)",
                    color: "#d1d5db",
                  }}
                >
                  COMPLETED
                </span>
              </div>

              {/* ROLE */}
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: "21px",
                  lineHeight: 1.3,
                }}
              >
                {mission.role}
              </h2>

              {/* COMPANY */}
              <div
                style={{
                  marginBottom: "14px",
                  color: "#67e8f9",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {mission.company}
              </div>

              {/* PERIOD */}
              <div
                style={{
                  marginBottom: "18px",
                  fontSize: "11px",
                  color: "#9ca3af",
                }}
              >
                {mission.period}
              </div>

              {/* OBJECTIVES */}
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "1px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  OBJECTIVES
                </div>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    color: "#d1d5db",
                    fontSize: "12px",
                    lineHeight: 1.7,
                  }}
                >
                  {mission.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* FOOTER */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "14px",
                  borderTop:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: "#6b7280",
                    letterSpacing: "1px",
                    marginBottom: "6px",
                  }}
                >
                  MISSION STATUS
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#67e8f9",
                    fontWeight: "700",
                  }}
                >
                  EXPERIENCE ACQUIRED
                </div>
              </div>
            </article>
          ))}

          {/* MALAYSIA QUEST */}
          <article
            style={{
              position: "relative",
              padding: "22px",
              borderRadius: "14px",
              background:
                "rgba(15, 23, 42, 0.9)",
              border:
                "1px solid rgba(167, 139, 250, 0.35)",
              boxShadow:
                "0 0 24px rgba(167, 139, 250, 0.08)",
            }}
          >
            {/* MISSION TYPE */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#c4b5fd",
                }}
              >
                SPECIAL QUEST
              </span>

              <span
                style={{
                  fontSize: "10px",
                  padding: "5px 8px",
                  borderRadius: "6px",
                  background:
                    "rgba(255,255,255,0.06)",
                  color: "#d1d5db",
                }}
              >
                COMPLETED
              </span>
            </div>

            {/* TITLE */}
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: "21px",
                lineHeight: 1.3,
              }}
            >
              {internationalQuest.title}
            </h2>

            <div
              style={{
                marginBottom: "18px",
                color: "#c4b5fd",
                fontSize: "13px",
              }}
            >
              {internationalQuest.subtitle}
            </div>

            {/* TOPICS */}
            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "1px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                TOPICS
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                {internationalQuest.topics.map(
                  (topic) => (
                    <span
                      key={topic}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background:
                          "rgba(167,139,250,0.08)",
                        border:
                          "1px solid rgba(167,139,250,0.18)",
                        color: "#ddd6fe",
                        fontSize: "10px",
                      }}
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div>
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "1px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                HIGHLIGHTS
              </div>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: "#d1d5db",
                  fontSize: "12px",
                  lineHeight: 1.7,
                }}
              >
                {internationalQuest.highlights.map(
                  (highlight) => (
                    <li key={highlight}>
                      {highlight}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* FOOTER */}
            <div
              style={{
                marginTop: "20px",
                paddingTop: "14px",
                borderTop:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "#6b7280",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                QUEST STATUS
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#c4b5fd",
                  fontWeight: "700",
                }}
              >
                INTERNATIONAL EXPERIENCE ACQUIRED
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}