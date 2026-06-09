import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Github,
  Mail,
  Phone,
  MapPin,
  Code2,
  Layers,
  Smartphone,
  Database,
  Layout,
  GitBranch,
  Cpu,
} from "lucide-react";
import mmitImg from "@/assets/mmit.png";
import lostIdImg from "@/assets/lostid.png";
import fk1 from "@/assets/farmkeeper-1.png";
import fk2 from "@/assets/farmkeeper-2.png";
import fk3 from "@/assets/farmkeeper-3.png";
import fk4 from "@/assets/farmkeeper-4.png";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dagmawi Tewodros — Software Developer" },
      { name: "description", content: "Portfolio of Dagmawi Tewodros, a software developer building modern web and mobile applications with clean architecture and thoughtful design." },
      { property: "og:title", content: "Dagmawi Tewodros — Software Developer" },
      { property: "og:description", content: "Portfolio of Dagmawi Tewodros, a software developer building modern web and mobile applications." },
    ],
  }),
  component: Index,
});

const projects = [
  {
    title: "FarmKeeper",
    tag: "Mobile · Flutter",
    description:
      "A local-only mobile app for farmers to manage crops, track watering schedules, and monitor harvest dates. Auto-calculates harvest dates from planting and maturity data, sends push reminders, and supports a full crop journal with photos, yields, and quality tracking.",
    highlights: ["Crop Registration", "Watering Reminders", "Harvest Tracking", "Crop Journal"],
    href: "https://github.com/DagmawiTewodros/farmkeeper",
    preview: {
      type: "slideshow" as const,
      images: [fk1, fk2, fk3, fk4],
      alts: [
        "FarmKeeper crop registration screen showing planting date input",
        "FarmKeeper watering schedule and reminder screen",
        "FarmKeeper harvest tracking screen with date calculator",
        "FarmKeeper crop journal with photo and yield logging",
      ],
    },
  },
  {
    title: "MMIT Web",
    tag: "Web · Institutional",
    description:
      "A modern website for the Mated Management Institute — built to present programs, faculty, and student resources without friction, across any device.",
    highlights: ["Responsive UI", "Content-driven", "Institutional"],
    href: "https://github.com/DagmawiTewodros/MMIT_web",
    preview: {
      type: "image" as const,
      image: mmitImg,
      alt: "MMIT website homepage showing programs and faculty layout",
    },
  },
  {
    title: "Lost ID Reporting System",
    tag: "Web · University",
    description:
      "A reporting system for lost student IDs at Addis Ababa University. Students report missing IDs, finders post matches — one platform replaces the whole back-and-forth.",
    highlights: ["Auth Flow", "Reporting Workflow", "Search & Match"],
    href: "https://github.com/Elizabeth-Abay/Lost_Id_Reporting_System",
    preview: {
      type: "image" as const,
      image: lostIdImg,
      alt: "Lost ID reporting system search and match interface",
    },
  },
];

type ProjectPreview =
  | { type: "image"; image: string; alt: string }
  | { type: "slideshow"; images: string[]; alts: string[] };

function ProjectCard({
  project,
}: {
  project: {
    title: string;
    tag: string;
    description: string;
    highlights: string[];
    href: string;
    preview: ProjectPreview;
  };
}) {
  const [flipped, setFlipped] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!flipped) return;
    const timers: ReturnType<typeof setInterval>[] = [];
    if (project.preview.type === "slideshow") {
      const images = project.preview.images;
      timers.push(
        setInterval(() => {
          setSlide((s) => (s + 1) % images.length);
        }, 1800),
      );
    }
    const flipBack = setTimeout(() => {
      setFlipped(false);
      setSlide(0);
    }, 2000);
    return () => {
      timers.forEach(clearInterval);
      clearTimeout(flipBack);
    };
  }, [flipped, project.preview]);

  return (
    <div className="group relative h-[420px]" style={{ perspective: "1200px" }}>
      <div
        className="relative h-full w-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="absolute inset-0 flex flex-col bg-card border border-border rounded-2xl p-7 text-left hover:border-primary/50 hover:shadow-[0_20px_60px_-20px_oklch(0.52_0.11_180_/_0.25)] transition"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-start justify-between mb-6">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {project.tag}
            </span>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
          </div>
          <h3 className="font-display text-2xl font-bold tracking-tight">{project.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.highlights.map((h) => (
              <span
                key={h}
                className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
              >
                {h}
              </span>
            ))}
          </div>
          <span className="mt-4 text-[11px] uppercase tracking-[0.18em] text-primary">
            Click to preview →
          </span>
        </button>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border border-border bg-card overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="relative h-full w-full bg-secondary/40">
            {project.preview.type === "image" ? (
              <img
                src={project.preview.image}
                alt={project.preview.alt}
                className="absolute inset-0 h-full w-full object-contain p-3"
              />
            ) : (
              <>
                {project.preview.images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={project.preview.type === "slideshow" ? project.preview.alts[i] : ""}
                    className="absolute inset-0 h-full w-full object-contain p-3 transition-opacity duration-700"
                    style={{ opacity: i === slide ? 1 : 0 }}
                  />
                ))}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {project.preview.images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === slide ? "w-6 bg-primary" : "w-1.5 bg-border"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
                setSlide(0);
              }}
              className="absolute top-3 left-3 text-[11px] uppercase tracking-[0.18em] bg-background/90 backdrop-blur border border-border px-3 py-1.5 rounded-full hover:bg-background transition"
            >
              ← Back
            </button>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:bg-primary/90 transition"
            >
              Repo <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const skills = [
  { name: "HTML", level: 95, category: "Frontend" },
  { name: "CSS", level: 90, category: "Frontend" },
  { name: "JavaScript", level: 88, category: "Frontend" },
  { name: "TypeScript", level: 82, category: "Frontend" },
  { name: "Python", level: 85, category: "Backend" },
  { name: "Flutter", level: 82, category: "Mobile" },
  { name: "SQLite", level: 78, category: "Database" },
  { name: "Git", level: 80, category: "Tools" },
  { name: "Clean Arch.", level: 85, category: "Practice" },
];

const skillLogos = [
  { name: "HTML5", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Python", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Flutter", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Dart", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { name: "SQLite", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
  { name: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Tailwind CSS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "VS Code", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  { name: "Figma", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
];

function SkillsMarquee() {
  const row = [...skillLogos, ...skillLogos];
  return (
    <div
      className="relative mt-12 overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <style>{`
        @keyframes skills-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .skills-marquee-track {
          animation: skills-marquee 35s linear infinite;
        }
        .skills-marquee:hover .skills-marquee-track {
          animation-play-state: paused;
        }
      `}</style>
      <div className="skills-marquee">
        <div className="skills-marquee-track flex w-max gap-10 py-4">
          {row.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="group/logo flex h-20 w-32 shrink-0 items-center justify-center rounded-xl border border-border bg-card/70 backdrop-blur px-4 transition hover:border-primary/60 hover:bg-card"
              title={s.name}
            >
              <img
                src={s.url}
                alt={s.name}
                loading="lazy"
                className="max-h-10 max-w-full object-contain transition group-hover/logo:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillRing({ name, level, category }: { name: string; level: number; category: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;
  const gradId = `grad-${name.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 flex flex-col items-center transition hover:border-primary/50 hover:shadow-[0_20px_60px_-20px_oklch(0.62_0.19_258_/_0.15)]">
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle, oklch(0.52 0.11 180 / 0.12), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle, oklch(0.52 0.11 180 / 0.10), transparent 70%)" }}
      />

      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.52 0.11 180)" />
              <stop offset="100%" stopColor="oklch(0.62 0.13 175)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={radius} fill="none" stroke="oklch(0.85 0.015 255)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: "drop-shadow(0 0 5px oklch(0.52 0.11 180 / 0.35))",
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-foreground tabular-nums">{level}%</span>
        </div>
      </div>

      <div className="mt-5 text-center">
        <h3 className="font-display text-base font-semibold text-foreground">{name}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{category}</p>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="font-display font-bold tracking-tight text-lg">
            Dagmawi<span className="text-primary">.</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#work" className="hover:text-foreground transition">Work</a>
            <a href="#skills" className="hover:text-foreground transition">Skills</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <a
            href="mailto:Dagmawi_Tewodros@outlook.com"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition"
          >
            <span>Get in touch</span> <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_0%,oklch(0.62_0.19_258_/_0.12),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-28 md:pt-36 md:pb-40">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Software Developer · Addis Ababa
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.02] tracking-tight max-w-4xl">
            Building modern, reliable software with{" "}
            <span className="text-primary">clean architecture</span> and thoughtful design.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            I'm Dagmawi Tewodros — a software developer working across web and mobile.
            I enjoy turning real-world problems into responsive, performant, and secure
            applications.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition"
            >
              <span>View selected work</span> <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/DagmawiTewodros"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full font-medium hover:bg-secondary transition"
            >
              <Github className="h-4 w-4" /> <span>GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">A short intro.</h2>
          </div>
          <div className="md:col-span-8 text-lg leading-relaxed text-muted-foreground space-y-5">
            <p className="text-foreground">
              I'm a software developer skilled in HTML, CSS, JavaScript, Python, Flutter,
              and SQLite, with experience building modern, secure, and reliable applications.
            </p>
            <p>
              I enjoy developing responsive websites and mobile applications with clean
              architecture, strong performance, and user-friendly design. I'm passionate
              about using technology to solve real-world problems, continuously improving
              my skills, and creating impactful digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Selected work</p>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold">Projects.</h2>
            </div>
            <p className="hidden md:block max-w-sm text-sm text-muted-foreground">
              A few things I've built recently — spanning mobile, institutional web, and
              university tooling.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="relative overflow-hidden border-t border-border/60 bg-secondary/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 40% at 20% 10%, oklch(0.52 0.11 180 / 0.08), transparent 70%), radial-gradient(50% 40% at 85% 90%, oklch(0.62 0.13 175 / 0.06), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.18 0.02 260) 1px, transparent 1px), linear-gradient(90deg, oklch(0.18 0.02 260) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="grid md:grid-cols-12 gap-10 mb-14">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Toolkit</p>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold text-foreground">
                Skills &{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, oklch(0.52 0.11 180), oklch(0.4 0.09 185))" }}
                >
                  proficiency
                </span>
                .
              </h2>
            </div>
            <div className="md:col-span-7 flex md:items-end">
              <p className="text-muted-foreground leading-relaxed">
                A measured snapshot of the technologies I work with day-to-day — calibrated to real project depth, not buzzword bingo.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((s) => (
              <SkillRing key={s.name} {...s} />
            ))}
          </div>

          <SkillsMarquee />
        </div>
      </section>


      {/* Contact */}
      <section id="contact" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-extrabold tracking-tight">
            Let's build something <span className="text-primary">together</span>.
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground text-lg">
            Open to collaborations, freelance projects, and interesting problems worth solving.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:Dagmawi_Tewodros@outlook.com"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition"
            >
              <Mail className="h-4 w-4" />
              <span>Dagmawi_Tewodros@outlook.com</span>
            </a>
            <a
              href="tel:+251970514141"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full font-medium hover:bg-secondary transition"
            >
              <Phone className="h-4 w-4" />
              <span>+251 97 051 4141</span>
            </a>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> Addis Ababa, Ethiopia
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Dagmawi Tewodros</p>
          <a
            href="https://github.com/DagmawiTewodros"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition"
          >
            <Github className="h-4 w-4" />
            <span>github.com/DagmawiTewodros</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
