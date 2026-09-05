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
  /** position on the city map, in % */
  x: number;
  y: number;
  xp: number;
};

export const cityLocations: CityLocation[] = [
  { id: "home-base", name: "Home Base", subtitle: "Introduction", x: 9, y: 62, xp: 40 },
  { id: "origin-center", name: "Origin Center", subtitle: "About + Education", x: 22, y: 44, xp: 60 },
  { id: "training-center", name: "Training Center", subtitle: "Skills", x: 35, y: 66, xp: 60 },
  { id: "project-lab", name: "Project Lab", subtitle: "Projects", x: 49, y: 38, xp: 70 },
  { id: "mission-board", name: "Mission Board", subtitle: "Career missions", x: 61, y: 64, xp: 60 },
  { id: "achievement-hq", name: "Achievement HQ", subtitle: "Trophies", x: 73, y: 42, xp: 60 },
  { id: "developer-archive", name: "Developer Archive", subtitle: "Resume", x: 84, y: 66, xp: 50 },
  { id: "communication-hq", name: "Communication HQ", subtitle: "Contact", x: 93, y: 46, xp: 50 },
  { id: "developer-hub", name: "Developer Hub", subtitle: "GitHub & profiles", x: 67, y: 22, xp: 50 },
];
