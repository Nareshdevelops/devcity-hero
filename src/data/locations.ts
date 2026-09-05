export type LocationId =
  | "home-base"
  | "origin-center"
  | "training-center"
  | "project-lab"
  | "mission-board"
  | "achievement-hq"
  | "developer-archive"
  | "communication-hq"
  | "developer-hub";

export type CityLocation = {
  id: LocationId;
  name: string;
  subtitle: string;
  /** horizontal position in world pixels */
  x: number;
  /** 0 = close to camera, 1 = deep into the city */
  depth: number;
  /** building silhouette variant */
  shape: "tower" | "block" | "dome" | "lab" | "spire";
  /** building width in world px (at depth 0) */
  width: number;
  height: number;
  accent: "primary" | "signal" | "gold";
  xp: number;
};

export const WORLD_WIDTH = 3400;

export const cityLocations: CityLocation[] = [
  {
    id: "home-base",
    name: "Home Base",
    subtitle: "Introduction",
    x: 180,
    depth: 0.05,
    shape: "block",
    width: 190,
    height: 210,
    accent: "primary",
    xp: 40,
  },
  {
    id: "origin-center",
    name: "Origin Center",
    subtitle: "About + Education",
    x: 560,
    depth: 0.45,
    shape: "dome",
    width: 210,
    height: 250,
    accent: "signal",
    xp: 60,
  },
  {
    id: "training-center",
    name: "Training Center",
    subtitle: "Skills",
    x: 900,
    depth: 0.08,
    shape: "lab",
    width: 200,
    height: 195,
    accent: "gold",
    xp: 60,
  },
  {
    id: "project-lab",
    name: "Project Lab",
    subtitle: "Projects",
    x: 1260,
    depth: 0.5,
    shape: "lab",
    width: 230,
    height: 285,
    accent: "signal",
    xp: 70,
  },
  {
    id: "mission-board",
    name: "Mission Board",
    subtitle: "Career missions",
    x: 1620,
    depth: 0.1,
    shape: "block",
    width: 200,
    height: 200,
    accent: "primary",
    xp: 60,
  },
  {
    id: "achievement-hq",
    name: "Achievement HQ",
    subtitle: "Trophies",
    x: 1990,
    depth: 0.52,
    shape: "spire",
    width: 190,
    height: 320,
    accent: "gold",
    xp: 60,
  },
  {
    id: "developer-archive",
    name: "Developer Archive",
    subtitle: "Resume",
    x: 2340,
    depth: 0.06,
    shape: "block",
    width: 210,
    height: 220,
    accent: "signal",
    xp: 50,
  },
  {
    id: "communication-hq",
    name: "Communication HQ",
    subtitle: "Contact",
    x: 2700,
    depth: 0.48,
    shape: "tower",
    width: 180,
    height: 300,
    accent: "primary",
    xp: 50,
  },
  {
    id: "developer-hub",
    name: "Developer Hub",
    subtitle: "GitHub & profiles",
    x: 3080,
    depth: 0.12,
    shape: "tower",
    width: 200,
    height: 260,
    accent: "gold",
    xp: 50,
  },
];
