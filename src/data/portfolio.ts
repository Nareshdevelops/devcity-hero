/**
 * All portfolio content lives here, separate from game logic.
 * Add a project -> new mission. Add a skill -> new ability. Etc.
 */

export type Project = {
  id: string;
  title: string;
  boss?: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: "COMPLETED" | "IN PROGRESS";
  summary: string;
  problem?: string;
  solution?: string;
  features: string[];
  technologies: string[];
  contribution?: string;
  learned?: string;
  github?: string;
  demo?: string;
  xp: number;
};

export const profile = {
  name: "Naresh K.A",
  codename: "WEB OF CODE",
  role: "AI / ML Developer",
  headline: "B.Tech CSBS Student | Data Analytics | Python Developer | AI/ML",
  tagline: "Every skill has a story. Every project is a mission.",
  about: [
    "B.Tech Computer Science and Business Systems student with experience in Python, Data Analytics, AI/ML and Web Development.",
    "International academic exposure through a 4-month Malaysia mobility program covering Big Data Analytics, Data Mining, Cloud Computing and Cloud Architecture.",
    "Projects include an AI assistant, a resume analysis system and an academic analytics system.",
  ],
};

export const education = {
  degree: "B.Tech Computer Science and Business Systems",
  institution: "Knowledge Institute of Technology",
  period: "2024 – 2028",
  cgpa: "8.4 / 10",
};

export const projects: Project[] = [
  {
    id: "rockyx",
    title: "RockyX — AI Desktop Companion",
    boss: true,
    difficulty: 5,
    status: "COMPLETED",
    summary:
      "An AI-powered desktop assistant inspired by the virtual assistant concept from Project Hail Mary.",
    features: [
      "Voice interaction",
      "Memory management",
      "Internet search",
      "Study-assistant features",
      "Local AI models",
      "Offline speech recognition",
    ],
    technologies: ["Python", "Machine Learning"],
    xp: 200,
  },
  {
    id: "resume-analyzer",
    title: "Automated Resume Analyzer",
    difficulty: 4,
    status: "COMPLETED",
    summary: "An intelligent resume analysis system.",
    features: [
      "Extracts candidate information",
      "Performs skill matching",
      "Generates analytics and recommendations",
      "Provides resume improvement guidance",
    ],
    technologies: ["Python", "Machine Learning", "Data Analysis"],
    xp: 150,
  },
  {
    id: "learning-gap",
    title: "Learning Gap Detector",
    difficulty: 3,
    status: "COMPLETED",
    summary: "A system that identifies weak learning areas using academic performance data.",
    features: [
      "Identifies weak learning areas using academic performance data",
      "Generates personalized recommendations",
      "Visualizes performance trends",
      "Visualizes learning patterns",
    ],
    technologies: ["Python", "Data Analysis", "Data Visualization"],
    xp: 150,
  },
];

export const skillTree: { branch: string; skills: { name: string; note?: string }[] }[] = [
  {
    branch: "Programming",
    skills: [{ name: "Python" }, { name: "Java" }, { name: "C" }, { name: "C++" }],
  },
  {
    branch: "Data Analytics",
    skills: [
      { name: "Data Analysis" },
      { name: "Big Data Analytics" },
      { name: "Data Mining" },
      { name: "Data Visualization" },
    ],
  },
  {
    branch: "AI / ML",
    skills: [{ name: "Machine Learning" }, { name: "Prompt Engineering" }],
  },
  {
    branch: "Web & Tools",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript", note: "Basics" },
      { name: "Git" },
      { name: "GitHub" },
      { name: "VS Code" },
      { name: "Excel" },
    ],
  },
];

export const experience = [
  {
    id: "persvax",
    role: "Data Analytics Intern",
    company: "Persvax",
    period: "May 2024 – Jun 2024",
    points: [
      "Real-world data analysis projects using Python",
      "Data cleaning",
      "Data preprocessing",
      "Exploratory data analysis",
      "Data visualization",
      "Reporting",
    ],
  },
  {
    id: "codsoft",
    role: "Web Development Intern",
    company: "CodeSoft",
    period: "May 2024 – Jun 2024",
    points: [
      "Responsive websites using HTML and CSS",
      "UI/UX principles",
      "Website performance",
      "Front-end development",
      "Git / version control",
    ],
  },
];

export const internationalQuest = {
  title: "International Quest — Malaysia",
  subtitle: "4-month international academic mobility program",
  topics: ["Big Data Analytics", "Data Mining", "Cloud Computing", "Cloud Architecture"],
  highlights: ["Collaboration", "Communication", "Diverse academic environment"],
};

export const achievements: { id: string; name: string; detail: string; xp: number }[] = [
  { id: "hackerrank", name: "HackerRank — Python (Basic)", detail: "Certification", xp: 60 },
  { id: "prompt", name: "Advanced Prompt Engineering", detail: "Certification", xp: 60 },
  { id: "malaysia", name: "Malaysia Mobility Program", detail: "4-month academic mobility", xp: 80 },
  { id: "intern-data", name: "Data Analytics Internship", detail: "Persvax", xp: 60 },
  { id: "intern-web", name: "Web Development Internship", detail: "CodeSoft", xp: 60 },
  { id: "ai-projects", name: "Completed AI/ML Projects", detail: "3 shipped projects", xp: 80 },
];

export const lockedAchievementSlots = 2;

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  handle: string;
};

/** Only add entries with real URLs. */
export const socialLinks: SocialLink[] = [
  { id: "email", label: "Email", url: "mailto:kanaresh93@gmail.com", handle: "kanaresh93@gmail.com" },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/naresh-ka-b6051b333",
    handle: "linkedin.com/in/naresh-ka-b6051b333",
  },
  { id: "github", label: "GitHub", url: "https://github.com/Naresh-KA", handle: "github.com/Naresh-KA" },
];

/** Place NARESH_KA_RESUME.pdf in /public to make these live. */
export const resume = {
  fileName: "NARESH_KA_RESUME.pdf",
  url: "/NARESH_KA_RESUME.pdf",
};

export const hudStats = [
  { label: "Speed", value: 7 },
  { label: "Intelligence", value: 8 },
  { label: "Coding", value: 8 },
  { label: "Creativity", value: 7 },
  { label: "Problem Solving", value: 8 },
];
