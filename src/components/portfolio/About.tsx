import { useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import cutout from "@/assets/profile-cutout.webp";
import { EMAIL, GITHUB_URL } from "./content";
import { StarryCanvas, Skyline } from "./StarryCanvas";
import { easeInOut, range, useScrollProgress } from "./scroll";

/**
 * A small "About me" card floats over a swirling night sky; scrolling opens
 * the card until it fills the screen, revealing a spotlit figure and the intro.
 * The opening is a clip-path on a full-screen panel, so the beam and figure
 * stay fixed in place while the window onto them grows.
 */
export function About() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useScrollProgress(track, (p) => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--e", easeInOut(range(p, 0.08, 0.48)).toFixed(4));
    el.style.setProperty("--split", easeInOut(range(p, 0.18, 0.5)).toFixed(4));
    el.style.setProperty("--c1", range(p, 0.5, 0.62).toFixed(4));
    el.style.setProperty("--c2", range(p, 0.58, 0.72).toFixed(4));
    el.style.setProperty("--c3", range(p, 0.66, 0.8).toFixed(4));
  });

  return (
    <section
      id="about"
      aria-label="About me"
      ref={track}
      className="relative h-[340svh] bg-[#0b0b0c]"
    >
      <div ref={stage} className="about-stage sticky top-0 h-svh overflow-hidden">
        <StarryCanvas className="absolute inset-0 h-full w-full" />
        <div aria-hidden className="about-glows absolute inset-0" />
        <Skyline className="absolute inset-x-0 bottom-0 h-[38svh] w-full" />

        <div className="about-panel absolute inset-0 bg-[#060606]">
          <div aria-hidden className="about-beam" />
          <div aria-hidden className="about-figure-wrap">
            <div
              className="about-figure"
              style={{ maskImage: `url(${cutout})`, WebkitMaskImage: `url(${cutout})` }}
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 [background:radial-gradient(70%_70%_at_50%_55%,transparent_40%,#000_100%)]"
          />

          <div className="about-content absolute inset-0 flex flex-col justify-between px-5 pb-10 pt-24 text-white md:px-14 md:pb-14 md:pt-28">
            <div
              className="flex items-start justify-between gap-6"
              style={{
                opacity: "var(--c1)",
                transform: "translateY(calc((1 - var(--c1)) * 24px))",
              }}
            >
              <h2 className="max-w-xl font-display text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                Turning real-world problems into fast, dependable software.
              </h2>
              <p className="hidden font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/50 md:block">
                Build · Ship · Refine
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div
                className="md:col-span-7"
                style={{
                  opacity: "var(--c2)",
                  transform: "translateY(calc((1 - var(--c2)) * 24px))",
                }}
              >
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/50">
                  Discipline &amp; craft — Web · Mobile · UI
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                  I'm a software developer skilled in HTML, CSS, JavaScript, Python, Flutter and
                  SQLite. I build modern, secure applications with clean architecture and a focus on
                  what actually matters — does it solve the problem? I'm passionate about using
                  technology to address real needs, and always sharpening my craft.
                </p>
              </div>
              <div
                className="flex flex-wrap gap-3 md:col-span-5 md:justify-end"
                style={{
                  opacity: "var(--c3)",
                  transform: "translateY(calc((1 - var(--c3)) * 24px))",
                }}
              >
                <a href={`mailto:${EMAIL}`} className="pill pill--solid">
                  Get in touch <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="pill">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="about-word pointer-events-none absolute inset-0 grid place-items-center text-center font-display font-black uppercase leading-[0.9] tracking-[-0.04em] text-white"
        >
          <span>
            <span className="about-word-l block">About</span>
            <span className="about-word-r block">Me</span>
          </span>
        </p>
      </div>
    </section>
  );
}
