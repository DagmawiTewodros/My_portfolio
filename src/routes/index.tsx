import { createFileRoute } from "@tanstack/react-router";
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
  },
  {
    title: "MMIT Web",
    tag: "Web · Institutional",
    description:
      "A modern website for the Mated Management Institute, designed to present programs, faculty, and student resources with a clean, accessible layout that works across devices.",
    highlights: ["Responsive UI", "Content-driven", "Institutional"],
    href: "https://github.com/DagmawiTewodros/MMIT_web",
  },
  {
    title: "Lost ID Reporting System",
    tag: "Web · University",
    description:
      "A reporting system for lost student IDs at Addis Ababa University. Students report missing IDs, finders post matches, and the platform streamlines retrieval through a simple, secure workflow.",
    highlights: ["Auth Flow", "Reporting Workflow", "Search & Match"],
    href: "https://github.com/Elizabeth-Abay/Lost_Id_Reporting_System",
  },
];

const skillCategories = [
  {
    title: "Frontend",
    icon: Layout,
    items: [
      { name: "HTML", level: "Proficient" },
      { name: "CSS", level: "Proficient" },
      { name: "JavaScript", level: "Proficient" },
      { name: "Responsive Design", level: "Proficient" },
    ],
  },
  {
    title: "Programming",
    icon: Code2,
    items: [
      { name: "Python", level: "Proficient" },
      { name: "SQLite", level: "Experienced" },
    ],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    items: [
      { name: "Flutter", level: "Proficient" },
    ],
  },
  {
    title: "Architecture",
    icon: Cpu,
    items: [
      { name: "Clean Architecture", level: "Proficient" },
      { name: "Git", level: "Experienced" },
      { name: "Problem Solving", level: "Proficient" },
    ],
  },
];

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
            Get in touch <ArrowUpRight className="h-3.5 w-3.5" />
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
              View selected work <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/DagmawiTewodros"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full font-medium hover:bg-secondary transition"
            >
              <Github className="h-4 w-4" /> GitHub
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
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col bg-card border border-border rounded-2xl p-7 hover:border-primary/50 hover:shadow-[0_20px_60px_-20px_oklch(0.62_0.19_258_/_0.25)] transition"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {p.tag}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                  {p.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {p.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid md:grid-cols-12 gap-10 mb-14">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Toolkit</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Skills & stack.</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-muted-foreground leading-relaxed">
                A curated set of technologies and practices I use to build reliable, performant software across web and mobile.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skillCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="group relative flex flex-col bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition" />
                    </div>
                    <h3 className="font-display text-base font-semibold">{cat.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="text-sm text-foreground font-medium">{item.name}</span>
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          {item.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
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
            <Github className="h-4 w-4" /> github.com/DagmawiTewodros
          </a>
        </div>
      </footer>
    </div>
  );
}
