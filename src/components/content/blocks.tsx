import { useState } from "react";
import {
  achievements,
  education,
  experience,
  hudStats,
  internationalQuest,
  lockedAchievementSlots,
  profile,
  projects,
  resume,
  skillTree,
  socialLinks,
  type Project,
} from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/game-state";
import {
  Award,
  Briefcase,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe2,
  Lock,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

export function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="mb-6">
      <p className="font-display text-xs uppercase tracking-[0.35em] text-signal">{kicker}</p>
      <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
    </header>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`hud-panel rounded-lg p-5 ${className}`}>{children}</div>;
}

/* ------------------------------- ABOUT ---------------------------------- */

export function AboutBlock() {
  return (
    <div className="space-y-4">
      <SectionHeading kicker="Origin Center" title="Character Origin" />
      <Panel>
        <p className="font-display text-lg">{profile.name}</p>
        <p className="text-sm text-muted-foreground">{profile.headline}</p>
        <div className="mt-4 space-y-3 text-sm leading-relaxed">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Panel>
      <EducationBlock compact />
    </div>
  );
}

/* ----------------------------- EDUCATION -------------------------------- */

export function EducationBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-4">
      {!compact && <SectionHeading kicker="Background" title="Education" />}
      <Panel>
        <div className="flex items-start gap-3">
          <GraduationCap className="mt-1 size-5 shrink-0 text-signal" aria-hidden />
          <div>
            <h3 className="font-display text-base">{education.degree}</h3>
            <p className="text-sm text-muted-foreground">{education.institution}</p>
            <p className="mt-1 text-sm">
              {education.period} · CGPA {education.cgpa}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------- SKILLS --------------------------------- */

export function SkillsBlock() {
  const { award } = useGame();
  return (
    <div>
      <SectionHeading kicker="Training Center" title="Ability Tree" />
      <div className="grid gap-4 sm:grid-cols-2">
        {skillTree.map((branch) => (
          <Panel key={branch.branch}>
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-signal">
              {branch.branch}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {branch.skills.map((s) => (
                <li key={s.name}>
                  <button
                    type="button"
                    onClick={() => award(`skill:${s.name}`, 10, `Ability explored: ${s.name}`)}
                    className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm transition-colors hover:border-signal hover:text-signal"
                  >
                    <span className="font-medium">{s.name}</span>
                    {s.note && <span className="ml-1 text-xs text-muted-foreground">({s.note})</span>}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Abilities are listed without proficiency scores — they reflect technologies worked with.
      </p>
    </div>
  );
}

/* ------------------------------ PROJECTS -------------------------------- */

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`Difficulty ${n} of 5`} className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${i < n ? "fill-gold text-gold" : "text-muted-foreground"}`}
          aria-hidden
        />
      ))}
    </span>
  );
}

function MissionDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <Panel className="border-signal/40">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
            {project.boss ? "Boss Mission" : "Mission"}
          </p>
          <h3 className="mt-1 font-display text-xl">{project.title}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{project.summary}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-signal">Key features</h4>
          <ul className="mt-2 space-y-1 text-sm">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2">
                <Zap className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-signal">Technologies</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li
                key={t}
                className="rounded border border-border bg-surface-2 px-2 py-1 text-xs font-medium"
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Status: {project.status} · Difficulty <Stars n={project.difficulty} />
          </p>
        </div>
      </div>

      {(project.github || project.demo) && (
        <div className="mt-4 flex gap-2">
          {project.github && (
            <Button asChild size="sm">
              <a href={project.github} target="_blank" rel="noreferrer">
                GitHub <ExternalLink className="ml-1 size-3.5" />
              </a>
            </Button>
          )}
          {project.demo && (
            <Button asChild size="sm" variant="outline">
              <a href={project.demo} target="_blank" rel="noreferrer">
                Live demo
              </a>
            </Button>
          )}
        </div>
      )}
      <p className="mt-4 font-display text-xs uppercase tracking-[0.25em] text-gold">
        Mission complete · +{project.xp} XP
      </p>
    </Panel>
  );
}

export function ProjectsBlock() {
  const [open, setOpen] = useState<string | null>(null);
  const { award } = useGame();
  const active = projects.find((p) => p.id === open);

  return (
    <div>
      <SectionHeading kicker="Project Lab" title="Missions" />
      {active ? (
        <MissionDetail project={active} onClose={() => setOpen(null)} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Panel key={p.id} className={p.boss ? "border-primary/60" : ""}>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
                {p.boss ? "Boss mission" : "Mission available"}
              </p>
              <h3 className="mt-1 font-display text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <Stars n={p.difficulty} />
                <span>Status: {p.status}</span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <li key={t} className="rounded bg-surface-2 px-2 py-0.5 text-xs">
                    {t}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  setOpen(p.id);
                  award(`mission:${p.id}`, p.xp, `Mission opened: ${p.title}`);
                }}
              >
                {p.boss ? "Enter mission" : "Start mission"}
              </Button>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- EXPERIENCE ------------------------------- */

export function ExperienceBlock() {
  return (
    <div>
      <SectionHeading kicker="Mission Board" title="Career Missions" />
      <div className="grid gap-4 md:grid-cols-2">
        {experience.map((e) => (
          <Panel key={e.id}>
            <div className="flex items-start gap-3">
              <Briefcase className="mt-1 size-5 shrink-0 text-signal" aria-hidden />
              <div>
                <h3 className="font-display text-base">{e.role}</h3>
                <p className="text-sm text-muted-foreground">
                  {e.company} · {e.period}
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {e.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <Panel className="mt-4 border-gold/50">
        <div className="flex items-start gap-3">
          <Globe2 className="mt-1 size-5 shrink-0 text-gold" aria-hidden />
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">
              International Quest
            </p>
            <h3 className="mt-1 font-display text-lg">{internationalQuest.title}</h3>
            <p className="text-sm text-muted-foreground">{internationalQuest.subtitle}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-signal">Topics</h4>
                <ul className="mt-1 space-y-1 text-sm">
                  {internationalQuest.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-signal">Highlights</h4>
                <ul className="mt-1 space-y-1 text-sm">
                  {internationalQuest.highlights.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* --------------------------- ACHIEVEMENTS ------------------------------- */

export function AchievementsBlock() {
  const { unlocked, unlockAchievement } = useGame();
  return (
    <div>
      <SectionHeading kicker="Achievement HQ" title="Trophies" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => unlockAchievement(a.id, a.name, a.xp)}
              className={`hud-panel rounded-lg p-4 text-left transition-colors ${
                isUnlocked ? "border-gold/60" : "hover:border-signal"
              }`}
            >
              <Trophy
                className={`size-5 ${isUnlocked ? "text-gold" : "text-muted-foreground"}`}
                aria-hidden
              />
              <h3 className="mt-2 font-display text-sm">{a.name}</h3>
              <p className="text-xs text-muted-foreground">{a.detail}</p>
            </button>
          );
        })}
        {Array.from({ length: lockedAchievementSlots }).map((_, i) => (
          <div key={i} className="rounded-lg border border-dashed border-border p-4 opacity-60">
            <Lock className="size-5 text-muted-foreground" aria-hidden />
            <h3 className="mt-2 font-display text-sm">Future achievement</h3>
            <p className="text-xs text-muted-foreground">Slot reserved</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ ARCHIVE --------------------------------- */

export function ResumeBlock() {
  return (
    <div>
      <SectionHeading kicker="Developer Archive" title="Resume" />
      <Panel>
        <div className="flex items-center gap-3">
          <FileText className="size-6 text-signal" aria-hidden />
          <div>
            <p className="font-display">{resume.fileName}</p>
            <p className="text-xs text-muted-foreground">Always available — no missions required.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <a href={resume.url} target="_blank" rel="noreferrer">
              View resume
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={resume.url} download>
              <Download className="mr-1 size-4" /> Download resume
            </a>
          </Button>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------ CONTACT --------------------------------- */

export function ContactBlock() {
  return (
    <div>
      <SectionHeading kicker="Communication HQ" title="Contact" />
      <div className="grid gap-3 sm:grid-cols-2">
        {socialLinks.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target={l.url.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="hud-panel flex items-center justify-between rounded-lg p-4 transition-colors hover:border-signal"
          >
            <span>
              <span className="block font-display text-sm">{l.label}</span>
              <span className="block break-all text-xs text-muted-foreground">{l.handle}</span>
            </span>
            <ExternalLink className="size-4 shrink-0 text-signal" aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- DEVELOPER HUB ----------------------------- */

export function DeveloperHubBlock() {
  const gh = socialLinks.find((l) => l.id === "github");
  return (
    <div>
      <SectionHeading kicker="Developer Hub" title="Coding Profiles" />
      <Panel>
        {gh ? (
          <a
            href={gh.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between"
          >
            <span>
              <span className="block font-display text-sm">GitHub</span>
              <span className="block text-xs text-muted-foreground">{gh.handle}</span>
            </span>
            <ExternalLink className="size-4 text-signal" aria-hidden />
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">No coding profiles configured yet.</p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          More coding profiles appear here automatically once their links are added.
        </p>
      </Panel>
    </div>
  );
}

/* ----------------------------- HOME BASE -------------------------------- */

export function HomeBaseBlock() {
  return (
    <div>
      <SectionHeading kicker="Home Base" title={profile.name} />
      <Panel>
        <p className="font-display text-lg text-primary">{profile.role}</p>
        <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>
        <p className="mt-4 text-sm italic">{profile.tagline}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {hudStats.map((s) => (
            <li key={s.label} className="text-xs">
              <div className="flex justify-between">
                <span className="uppercase tracking-[0.2em] text-muted-foreground">{s.label}</span>
                <span className="text-signal">{s.value}/10</span>
              </div>
              <div className="mt-1 h-1.5 rounded bg-surface-2">
                <div
                  className="h-full rounded bg-primary"
                  style={{ width: `${s.value * 10}%` }}
                  aria-hidden
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Award className="size-3.5" aria-hidden /> Stats are part of the game experience only.
        </p>
      </Panel>
    </div>
  );
}
