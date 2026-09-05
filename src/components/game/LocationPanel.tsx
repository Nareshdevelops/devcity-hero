import type { LocationId } from "@/data/locations";
import {
  AboutBlock,
  AchievementsBlock,
  ContactBlock,
  DeveloperHubBlock,
  ExperienceBlock,
  HomeBaseBlock,
  ProjectsBlock,
  ResumeBlock,
  SkillsBlock,
} from "@/components/content/blocks";

const blocks: Record<LocationId, () => React.ReactElement> = {
  "home-base": HomeBaseBlock,
  "origin-center": AboutBlock,
  "training-center": SkillsBlock,
  "project-lab": ProjectsBlock,
  "mission-board": ExperienceBlock,
  "achievement-hq": AchievementsBlock,
  "developer-archive": ResumeBlock,
  "communication-hq": ContactBlock,
  "developer-hub": DeveloperHubBlock,
};

export function LocationPanel({ id }: { id: LocationId }) {
  const Block = blocks[id];
  return <Block />;
}
