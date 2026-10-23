import mmitImg from "@/assets/mmit.webp";
import pulseImg from "@/assets/pulse.png";
import fk1 from "@/assets/farmkeeper-1.webp";

export const NAME = "Dagmawi Tewodros";
export const BRAND = "DAGMAWI";
export const EMAIL = "dagipommy@gmail.com";
export const GITHUB_URL = "https://github.com/DagmawiTewodros";
export const LOCATION = "Addis Ababa, Ethiopia";

export const NAV_ITEMS = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;

export type Project = {
  title: string;
  tag: string;
  kind: string;
  description: string;
  highlights: string[];
  href: string;
  linkLabel: string;
  image: string;
  /** Phone captures are shown contained on a dark field instead of cropped. */
  portrait?: boolean;
};

export const projects: Project[] = [
  {
    title: "FarmKeeper",
    tag: "Mobile · Flutter",
    kind: "Mobile App",
    description:
      "A local-only mobile app for farmers to manage crops, track watering schedules, and monitor harvest dates — with push reminders and a full crop journal.",
    highlights: ["Crop Registration", "Watering Reminders", "Harvest Tracking", "Crop Journal"],
    href: "https://github.com/DagmawiTewodros/farmkeeper",
    linkLabel: "View repo",
    image: fk1,
    portrait: true,
  },
  {
    title: "MMIT Web",
    tag: "Web · Institutional",
    kind: "Institute Website",
    description:
      "A modern website for the Mated Management Institute — presenting programs, faculty, and student resources without friction, on any device.",
    highlights: ["Responsive UI", "Content-driven", "Institutional"],
    href: "https://matedinstitute.com/",
    linkLabel: "Visit site",
    image: mmitImg,
  },
  {
    title: "Pulse Digital",
    tag: "Web · Agency",
    kind: "Agency Landing Page",
    description:
      "A website for a digital marketing agency offering web builds, social media management, and content marketing. Premium design, responsive throughout.",
    highlights: ["Modern Design", "Marketing", "Responsive UI"],
    href: "https://pulse2-alpha.vercel.app/",
    linkLabel: "Visit site",
    image: pulseImg,
  },
];

export type Chapter = {
  tab: string;
  /** Oversized word scrolling behind the chapter. */
  backdrop: string;
  eyebrow: string;
  title: [string, string];
  body: string;
  milestones: { label: string; text: string }[];
};

export const chapters: Chapter[] = [
  {
    tab: "Learning",
    backdrop: "SELF-DIRECTED",
    eyebrow: "Foundations · Self-directed",
    title: ["Web", "Foundations"],
    body: "Taught myself the fundamentals hands-on — HTML, CSS, JavaScript and Python — by building small projects end to end.",
    milestones: [
      { label: "Languages", text: "HTML, CSS, JavaScript & Python" },
      { label: "Data", text: "SQLite and local-first storage" },
      { label: "Workflow", text: "Git, GitHub & clean architecture" },
    ],
  },
  {
    tab: "Mobile",
    backdrop: "FLUTTER",
    eyebrow: "Mobile · Flutter & Dart",
    title: ["Mobile", "Developer"],
    body: "Built FarmKeeper in Flutter — an offline app that helps farmers register crops, get watering reminders and track harvests.",
    milestones: [
      { label: "Shipped", text: "FarmKeeper crop manager" },
      { label: "Stack", text: "Flutter, Dart & SQLite" },
      { label: "Feature", text: "Scheduled push reminders" },
    ],
  },
  {
    tab: "Web",
    backdrop: "PRODUCTION",
    eyebrow: "Web · Client work",
    title: ["Web", "Developer"],
    body: "Designed and shipped production websites for an institute and a digital agency — responsive, content-driven and fast.",
    milestones: [
      { label: "Live", text: "matedinstitute.com" },
      { label: "Live", text: "Pulse Digital agency site" },
      { label: "Focus", text: "Responsive, accessible UI" },
    ],
  },
  {
    tab: "Now",
    backdrop: "OPEN TO WORK",
    eyebrow: "Present · Freelance",
    title: ["Open to", "Work"],
    body: "Taking on freelance projects and collaborations across web and mobile — and always sharpening the craft.",
    milestones: [
      { label: "Building", text: "React, TypeScript & Tailwind" },
      { label: "Designing", text: "Figma to production code" },
      { label: "Available", text: "Remote, worldwide" },
    ],
  },
];

export type Service = {
  title: string;
  body: string;
  deliverables: string;
  tools: { name: string; icon: string }[];
};

const icon = (name: string, file: string) => ({ name, icon: `/icons/${file}-original.svg` });

export const services: Service[] = [
  {
    title: "Web Development",
    body: "Fast, responsive websites and web apps built with clean, maintainable code — from marketing sites to content-driven platforms.",
    deliverables: "Responsive builds, CMS-ready content, performance tuning",
    tools: [
      icon("React", "react"),
      icon("TypeScript", "typescript"),
      icon("JavaScript", "javascript"),
      icon("Tailwind CSS", "tailwindcss"),
      icon("HTML5", "html5"),
      icon("CSS3", "css3"),
    ],
  },
  {
    title: "Mobile Apps",
    body: "Cross-platform Flutter apps with offline-first data, reminders and interfaces that work for real people in the field.",
    deliverables: "Android & iOS builds, local storage, notifications",
    tools: [
      icon("Flutter", "flutter"),
      icon("Dart", "dart"),
      icon("SQLite", "sqlite"),
      icon("Python", "python"),
    ],
  },
  {
    title: "Landing Page Design",
    body: "High-converting, editorial landing pages for startups, product launches and personal brands — designed to capture attention and drive action.",
    deliverables: "Wireframes, Figma design, motion, production build",
    tools: [
      icon("Figma", "figma"),
      icon("VS Code", "vscode"),
      icon("Git", "git"),
      icon("GitHub", "github"),
    ],
  },
];
