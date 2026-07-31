import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Github,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import mmitImg from "@/assets/mmit.webp";
import lostIdImg from "@/assets/lostid.webp";
import fk1 from "@/assets/farmkeeper-1.webp";
import fk2 from "@/assets/farmkeeper-2.webp";
import fk3 from "@/assets/farmkeeper-3.webp";
import fk4 from "@/assets/farmkeeper-4.webp";

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

const EMAIL = "Dagmawi_Tewodros@outlook.com";
const GITHUB_URL = "https://github.com/DagmawiTewodros";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

const NAV_IDS = NAV_ITEMS.map((item) => item.id);

type Frame = { src: string; width: number; height: number };

type Preview =
  | { kind: "screenshot"; src: string; width: number; height: number; alt: string }
  | { kind: "device"; label: string; frames: Frame[] };

type Project = {
  title: string;
  tag: string;
  description: string;
  highlights: string[];
  href: string;
  linkLabel: string;
  preview: Preview;
};

const projects: Project[] = [
  {
    title: "FarmKeeper",
    tag: "Mobile · Flutter",
    description:
      "A local-only mobile app for farmers to manage crops, track watering schedules, and monitor harvest dates. Auto-calculates harvest dates from planting and maturity data, sends push reminders, and supports a full crop journal with photos, yields, and quality tracking.",
    highlights: ["Crop Registration", "Watering Reminders", "Harvest Tracking", "Crop Journal"],
    href: "https://github.com/DagmawiTewodros/farmkeeper",
    linkLabel: "View repo",
    preview: {
      kind: "device",
      label:
        "FarmKeeper app screens: crop registration, watering reminders, harvest tracking, and the crop journal",
      frames: [
        { src: fk1, width: 361, height: 780 },
        { src: fk2, width: 104, height: 320 },
        { src: fk3, width: 107, height: 297 },
        { src: fk4, width: 107, height: 231 },
      ],
    },
  },
  {
    title: "MMIT Web",
    tag: "Web · Institutional",
    description:
      "A modern website for the Mated Management Institute — built to present programs, faculty, and student resources without friction, across any device.",
    highlights: ["Responsive UI", "Content-driven", "Institutional"],
    href: "https://matedinstitute.com/",
    linkLabel: "Visit site",
    preview: {
      kind: "screenshot",
      src: mmitImg,
      width: 1000,
      height: 469,
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
    linkLabel: "View repo",
    preview: {
      kind: "screenshot",
      src: lostIdImg,
      width: 1000,
      height: 480,
      alt: "Lost ID reporting system search and match interface",
    },
  },
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

/* ------------------------------------------------------------------ */
/* Motion + scroll primitives                                          */
/* ------------------------------------------------------------------ */

/**
 * Fades and lifts its children into place the first time they enter the
 * viewport. The hidden state lives behind the `.js` class (set in the document
 * head), so content is never trapped at opacity 0 when scripts are unavailable.
 */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      // threshold 0 (not a ratio) so blocks taller than the viewport still
      // fire — their max intersectionRatio is viewportH/elementH, which can
      // sit below any non-zero threshold. The negative bottom margin is what
      // delays the trigger until the block is meaningfully on screen.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      data-visible={visible ? "true" : "false"}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Returns the id of the section currently under the header. */
function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      // The section that has most recently crossed below the header wins.
      const line = 160;
      let current: string | null = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }

      // The last section is often too short to ever reach the line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = ids[ids.length - 1] ?? current;

      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const lifted = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-out",
        lifted
          ? "border-b border-border/70 bg-background/80 shadow-[0_10px_30px_-20px_oklch(0.22_0.04_180_/_0.5)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          onClick={() => setMenuOpen(false)}
          className="font-display text-lg font-bold tracking-tight text-foreground"
        >
          Dagmawi<span className="text-primary-ink">.</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group relative py-1 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-primary transition-transform duration-300 ease-out",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={`mailto:${EMAIL}`}
            className="btn-lift hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 hover:shadow-[0_12px_24px_-14px_oklch(0.22_0.04_180_/_0.9)] sm:inline-flex"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative -mr-2 grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors duration-200 hover:bg-secondary md:hidden"
          >
            <Menu
              className={cn(
                "absolute h-5 w-5 transition-all duration-300 ease-out",
                menuOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
              )}
            />
            <X
              className={cn(
                "absolute h-5 w-5 transition-all duration-300 ease-out",
                menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
              )}
            />
          </button>
        </div>
      </div>

      {/* Animating grid-template-rows gives a real height transition without
          hard-coding a max-height that would clip or stutter. */}
      <div
        id="mobile-nav"
        aria-hidden={!menuOpen}
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden",
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <nav className="shell flex flex-col gap-1 border-t border-border/60 py-4" aria-label="Mobile">
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                tabIndex={menuOpen ? undefined : -1}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${70 + i * 45}ms` : "0ms" }}
                className={cn(
                  "rounded-xl px-3 py-3 text-base font-medium transition-all duration-300 ease-out",
                  active === item.id ? "bg-secondary text-foreground" : "text-muted-foreground",
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href={`mailto:${EMAIL}`}
              tabIndex={menuOpen ? undefined : -1}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${70 + NAV_ITEMS.length * 45}ms` : "0ms" }}
              className={cn(
                "mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all duration-300 ease-out sm:hidden",
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
            >
              <span>Get in touch</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */

/**
 * The FarmKeeper captures are tall, low-resolution phone screenshots, so they
 * are shown inside a device frame that bleeds past the bottom of the media box.
 * That keeps them at (or below) their native size — sharp rather than upscaled —
 * while still filling the same 16:10 area as the landscape web captures.
 */
function DeviceShowcase({ label, frames }: { label: string; frames: Frame[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (frames.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, 3200);
    return () => clearInterval(id);
  }, [frames.length]);

  return (
    <div className="absolute inset-0" role="img" aria-label={label}>
      <div
        aria-hidden
        className="absolute inset-0 [background:radial-gradient(80%_65%_at_50%_5%,oklch(0.45_0.09_190_/_0.6),transparent_72%)]"
      />

      <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]">
        <div className="absolute left-1/2 top-[13%] aspect-[9/19.5] h-[112%] -translate-x-1/2 overflow-hidden rounded-[1.35rem] border border-white/15 bg-black shadow-[0_26px_50px_-22px_oklch(0.08_0.02_260)]">
          {frames.map((frame, i) => (
            <img
              key={frame.src}
              src={frame.src}
              alt=""
              width={frame.width}
              height={frame.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
          <div
            aria-hidden
            className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/25"
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {frames.map((frame, i) => (
          <span
            key={frame.src}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500 ease-out",
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_oklch(0.22_0.04_180_/_0.05)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_28px_54px_-28px_oklch(0.22_0.04_180_/_0.4)]"
    >
      {/* Fixed 16:10 media box — identical across every project. */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border/70 bg-[oklch(0.17_0.025_235)]">
        {project.preview.kind === "screenshot" ? (
          <img
            src={project.preview.src}
            alt={project.preview.alt}
            width={project.preview.width}
            height={project.preview.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <DeviceShowcase label={project.preview.label} frames={project.preview.frames} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="t-eyebrow">{project.tag}</p>
        <h3 className="t-h3 mt-3">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="inline-flex items-center rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[0.6875rem] font-medium leading-4 text-secondary-foreground"
            >
              {highlight}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex items-center gap-1.5 border-t border-border/70 pt-5 text-sm font-semibold text-primary-ink">
          {project.linkLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

/**
 * Two identical halves sit side by side and the track slides exactly -50%, so
 * the loop point is pixel-identical. Each half carries a trailing gutter equal
 * to the gap, otherwise the seam would swallow half a gap and visibly jump.
 */
const MARQUEE_MASK = "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)";

/** One seamless row. `items` must already be in the order it should scroll. */
function MarqueeRow({
  items,
  reverse = false,
  duration,
  label,
}: {
  items: typeof skillLogos;
  reverse?: boolean;
  duration: string;
  label?: string;
}) {
  return (
    <div
      className="marquee relative overflow-hidden"
      style={{ maskImage: MARQUEE_MASK, WebkitMaskImage: MARQUEE_MASK }}
    >
      <div
        className={cn("marquee-track flex w-max", reverse && "marquee-track--reverse")}
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {[0, 1].map((half) => (
          <ul
            key={half}
            aria-hidden={half === 1 || !label ? true : undefined}
            aria-label={half === 0 ? label : undefined}
            className="flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4"
          >
            {items.map((skill) => (
              <li
                key={skill.name}
                className="group/logo flex h-20 w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-card/80 px-2 backdrop-blur transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_34px_-22px_oklch(0.22_0.04_180_/_0.55)] sm:h-24 sm:w-32 sm:gap-2 sm:px-3"
              >
                <img
                  src={skill.url}
                  alt=""
                  width={36}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-8 object-contain opacity-70 grayscale transition duration-300 ease-out group-hover/logo:scale-110 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 sm:h-9 sm:w-9"
                />
                <span className="text-center text-[0.6875rem] font-medium leading-tight text-muted-foreground transition-colors duration-300 group-hover/logo:text-foreground">
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Two counter-scrolling rows. A single row left the section looking sparse
 * (only ~2.5 cards visible at 375px against a lot of empty background), and
 * the opposing directions read as deliberate motion rather than a loop.
 */
function SkillsMarquee() {
  const split = Math.ceil(skillLogos.length / 2);
  // Rotating the second row means the two rows never sit in lockstep.
  const rowTwo = [...skillLogos.slice(split), ...skillLogos.slice(0, split)];

  return (
    <div className="mt-12 flex flex-col gap-3 sm:mt-14 sm:gap-4">
      <MarqueeRow items={skillLogos} duration="46s" label="Technologies I work with" />
      <MarqueeRow items={rowTwo} reverse duration="54s" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero robot                                                          */
/* ------------------------------------------------------------------ */

/**
 * The published Spline embed is cross-origin, so its named meshes cannot be
 * addressed from this page. Instead, move the complete robot presentation a
 * few pixels and tilt it toward the pointer. Keeping the movement below 4deg
 * preserves the model's composition while making it feel responsive.
 */
function HeroRobot() {
  return (
    <div
      aria-hidden="true"
      className="hero-robot pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-hidden"
    >
      <div className="hero-robot-scene absolute inset-0">
        <iframe
          title="NEXBOT interactive robot model"
          src="https://my.spline.design/nexbotrobotcharacterconcept-BmyLPBJpW17BCxXWJk55wwc5/"
          className="absolute left-1/2 top-0 h-[calc(100%+60px)] w-[120%] max-w-none -translate-x-[46%] border-0 sm:w-[112%] md:w-[106%] lg:w-full lg:-translate-x-1/2"
          loading="eager"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero -------------------------------------------------------- */}
      <section
        id="top"
        className="hero-section relative isolate flex min-h-[92svh] w-full flex-col overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 z-0 [background:radial-gradient(65%_55%_at_50%_0%,oklch(0.62_0.19_258_/_0.1),transparent_70%)]"
        />

        <HeroRobot />

        <div 
          className="hero-text-backdrop pointer-events-none absolute inset-y-0 left-0 z-[5] w-full md:w-[60%] bg-gradient-to-r from-background via-background/90 to-transparent" 
          aria-hidden="true" 
        />

        <div className="relative z-10 flex flex-1 items-center">
          <div className="shell py-28 md:py-32">
            <div className="relative max-w-[34rem] md:max-w-[38rem] lg:max-w-[56%]">

              <p className="t-eyebrow">Software Developer · Addis Ababa</p>

              <h1 className="t-h1 mt-6">
                Software that works — <span className="text-primary-ink">clean, fast,</span> and
                built to last.
              </h1>

              <p className="t-lead mt-8 max-w-xl">
                I'm Dagmawi Tewodros — a software developer based in Addis Ababa working across web
                and mobile. I turn real-world problems into responsive, performant, and secure
                applications.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="btn-lift inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-14px_oklch(0.52_0.11_180_/_0.95)] hover:bg-primary/90 hover:shadow-[0_20px_42px_-16px_oklch(0.52_0.11_180_/_1)]"
                >
                  <span>View selected work</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-lift inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur hover:border-primary/40 hover:bg-secondary"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#about"
          aria-label="Scroll to the about section"
          className="relative z-10 mx-auto mb-8 inline-flex flex-col items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em]">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-float-hint" />
        </a>
      </section>

      {/* About ------------------------------------------------------- */}
      <section id="about" className="relative border-t border-border/60">
        <div className="shell section-y">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <Reveal className="md:col-span-4">
              <p className="t-eyebrow">About</p>
              <h2 className="t-h2 mt-4">A short intro.</h2>
            </Reveal>

            <Reveal delay={120} className="md:col-span-8">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-foreground md:text-xl md:leading-relaxed">
                  I'm a software developer skilled in HTML, CSS, JavaScript, Python, Flutter, and
                  SQLite. I build modern, secure applications with clean architecture and a focus on
                  what actually matters — does it solve the problem?
                </p>
                <p className="t-lead">
                  I'm passionate about using technology to address real needs, and I'm always
                  working to sharpen my craft.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Work -------------------------------------------------------- */}
      <section id="work" className="bg-noise relative border-t border-border/60 bg-secondary/40">
        <div className="shell section-y relative">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="t-eyebrow">Selected work</p>
                <h2 className="t-h2 mt-4">Projects.</h2>
              </div>
              <p className="t-body max-w-sm md:text-right">
                A few things I've built recently — spanning mobile, institutional web, and
                university tooling.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.title} delay={i * 110} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skills ------------------------------------------------------ */}
      <section id="skills" className="relative overflow-hidden border-t border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 40% at 20% 10%, oklch(0.52 0.11 180 / 0.08), transparent 70%), radial-gradient(50% 40% at 85% 90%, oklch(0.62 0.13 175 / 0.06), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.02] sm:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.18 0.02 260) 1px, transparent 1px), linear-gradient(90deg, oklch(0.18 0.02 260) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            // Fades the grid out at the edges so it reads as depth, not a border.
            maskImage: "radial-gradient(75% 65% at 50% 45%, #000, transparent)",
            WebkitMaskImage: "radial-gradient(75% 65% at 50% 45%, #000, transparent)",
          }}
        />

        <div className="shell section-y relative">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <p className="t-eyebrow">Toolkit</p>
                <h2 className="t-h2 mt-4">Skills &amp; tools.</h2>
              </div>
              <div className="md:col-span-7 md:flex md:items-end">
                <p className="t-lead">
                  The languages, frameworks, and tools I reach for most. Hover to pause.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SkillsMarquee />
          </Reveal>
        </div>
      </section>

      {/* Contact ----------------------------------------------------- */}
      <section
        id="contact"
        className="bg-noise relative overflow-hidden border-t border-border/60 bg-secondary/40"
      >
        {/* Closing echo of the hero's radial wash, mirrored to the bottom. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_50%_100%,oklch(0.52_0.11_180_/_0.16),transparent_72%)]"
        />

        <div className="shell section-y relative text-center">
          <Reveal>
            <p className="t-eyebrow">Contact</p>
            <h2 className="t-h2 mt-4">
              Let's <span className="text-primary-ink">talk</span>.
            </h2>
            <p className="t-lead mx-auto mt-6 max-w-xl">
              Have a problem worth solving? I'm open to collaborations, freelance projects, and
              interesting challenges.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`mailto:${EMAIL}`}
                className="btn-lift inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-[0.8125rem] font-semibold text-primary-foreground shadow-[0_12px_30px_-14px_oklch(0.52_0.11_180_/_0.95)] hover:bg-primary/90 hover:shadow-[0_20px_42px_-16px_oklch(0.52_0.11_180_/_1)] sm:w-auto sm:px-6 sm:text-sm"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>{EMAIL}</span>
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-lift inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3.5 text-[0.8125rem] font-semibold text-foreground hover:border-primary/40 hover:shadow-[0_16px_34px_-20px_oklch(0.22_0.04_180_/_0.5)] sm:w-auto sm:px-6 sm:text-sm"
              >
                <Github className="h-4 w-4 shrink-0" />
                <span>GitHub</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
              <MapPin className="h-4 w-4 text-primary-ink" />
              Addis Ababa, Ethiopia
            </p>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="shell flex flex-col items-center justify-between gap-6 py-10 text-sm text-muted-foreground md:flex-row md:gap-8">
          <p>© {new Date().getFullYear()} Dagmawi Tewodros</p>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="link-underline hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="link-underline inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>github.com/DagmawiTewodros</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
