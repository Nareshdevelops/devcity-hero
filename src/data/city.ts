export type CityLocation = {
  id: string;
  name: string;
  type:
    | "home"
    | "about"
    | "skills"
    | "projects"
    | "experience"
    | "achievements"
    | "resume"
    | "contact"
    | "hub";
  position: [number, number, number];
  height: number;
};

export const cityLocations: CityLocation[] = [
  {
    id: "home-base",
    name: "Home Base",
    type: "home",
    position: [0, 0, 0],
    height: 8,
  },

  {
    id: "origin-center",
    name: "Origin Center",
    type: "about",
    position: [-10, 0, -8],
    height: 10,
  },

  {
    id: "training-center",
    name: "Training Center",
    type: "skills",
    position: [10, 0, -8],
    height: 14,
  },

  {
    id: "project-lab",
    name: "Project Lab",
    type: "projects",
    position: [-10, 0, 8],
    height: 12,
  },

  {
    id: "mission-board",
    name: "Mission Board",
    type: "experience",
    position: [10, 0, 8],
    height: 9,
  },

  {
    id: "achievement-hq",
    name: "Achievement HQ",
    type: "achievements",
    position: [0, 0, 18],
    height: 11,
  },

  {
    id: "developer-archive",
    name: "Developer Archive",
    type: "resume",
    position: [18, 0, 0],
    height: 13,
  },

  {
    id: "communication-hq",
    name: "Communication HQ",
    type: "contact",
    position: [-18, 0, 0],
    height: 10,
  },

  {
    id: "developer-hub",
    name: "Developer Hub",
    type: "hub",
    position: [0, 0, -18],
    height: 12,
  },
];