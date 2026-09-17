import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  AboutBlock,
  AchievementsBlock,
  ContactBlock,
  DeveloperHubBlock,
  EducationBlock,
  ExperienceBlock,
  HomeBaseBlock,
  ProjectsBlock,
  ResumeBlock,
  SkillsBlock,
} from "@/components/content/blocks";
import { profile, socialLinks } from "@/data/portfolio";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "resume", label: "Resume" },
  { id: "developer-hub", label: "Developer Hub" },
  { id: "contact", label: "Contact" },
];

export function QuickPortfolio({
  onPlay,
  initialSection,
}: {
  onPlay: () => void;
  initialSection?: string;
}) {
  const github = socialLinks.find(
    (l) => l.id === "github"
  );

  const linkedin = socialLinks.find(
    (l) => l.id === "linkedin"
  );

  useEffect(() => {
    if (!initialSection) return;

    const timer = window.setTimeout(() => {
      const section =
        document.getElementById(initialSection);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [initialSection]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <a
            href="#home"
            className="font-display text-sm tracking-[0.25em]"
          >
            {profile.name.toUpperCase()}
          </a>

          <nav
            aria-label="Portfolio sections"
            className="flex flex-wrap gap-x-3 gap-y-1 text-sm"
          >
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="py-1 text-muted-foreground transition-colors hover:text-signal"
              >
                {n.label}
              </a>
            ))}

            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noreferrer"
                className="py-1 text-muted-foreground hover:text-signal"
              >
                GitHub
              </a>
            )}

            {linkedin && (
              <a
                href={linkedin.url}
                target="_blank"
                rel="noreferrer"
                className="py-1 text-muted-foreground hover:text-signal"
              >
                LinkedIn
              </a>
            )}
          </nav>

          <Button
            size="sm"
            className="ml-auto"
            onClick={onPlay}
          >
            Play mode
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-14 px-4 py-10">
        <section
          id="home"
          className="scroll-mt-24"
        >
          <HomeBaseBlock />
        </section>

        <section
          id="about"
          className="scroll-mt-24"
        >
          <AboutBlock />
        </section>

        <section
          id="skills"
          className="scroll-mt-24"
        >
          <SkillsBlock />
        </section>

        <section
          id="projects"
          className="scroll-mt-24"
        >
          <ProjectsBlock />
        </section>

        <section
          id="experience"
          className="scroll-mt-24"
        >
          <ExperienceBlock />
        </section>

        <section
          id="education"
          className="scroll-mt-24"
        >
          <EducationBlock />
        </section>

        <section
          id="achievements"
          className="scroll-mt-24"
        >
          <AchievementsBlock />
        </section>

        <section
          id="resume"
          className="scroll-mt-24"
        >
          <ResumeBlock />
        </section>

        <section
          id="developer-hub"
          className="scroll-mt-24"
        >
          <DeveloperHubBlock />
        </section>

        <section
          id="contact"
          className="scroll-mt-24"
        >
          <ContactBlock />
        </section>
      </main>

      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        {profile.name} · {profile.tagline}
      </footer>
    </div>
  );
}