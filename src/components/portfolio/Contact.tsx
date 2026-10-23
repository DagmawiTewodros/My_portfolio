import { useRef } from "react";
import { ArrowUpRight, Github, Mail, MapPin } from "lucide-react";
import { BRAND, EMAIL, GITHUB_URL, LOCATION, NAME } from "./content";

/** Closing slab: chrome "Let's talk" whose sheen follows the pointer. */
export function Contact() {
  const title = useRef<HTMLHeadingElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = title.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
  };

  return (
    <section
      id="contact"
      onPointerMove={onMove}
      className="relative flex min-h-svh flex-col bg-[#0a0a0a] px-5 text-white md:px-10"
    >
      <div className="flex flex-1 flex-col items-center justify-center py-28 text-center">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/45">
          Have a problem worth solving?
        </p>
        <h2
          ref={title}
          className="chrome mt-5 font-display text-[clamp(3.5rem,13vw,12rem)] font-black uppercase leading-[0.85] tracking-[-0.045em]"
        >
          Let's talk
        </h2>
        <p className="mt-6 max-w-md text-sm text-white/60">
          Open to collaborations, freelance projects and interesting challenges.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          <a href={`mailto:${EMAIL}`} className="pill">
            <Mail className="h-3.5 w-3.5" /> {EMAIL}
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="pill">
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <span className="pill pointer-events-none">
            <MapPin className="h-3.5 w-3.5" /> {LOCATION}
          </span>
          <a href={`mailto:${EMAIL}`} className="pill pill--solid">
            Contact me <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/40 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {NAME} — All rights reserved
        </p>
        <a href="#top" className="link-underline hover:text-white">
          {BRAND} · Back to top ↑
        </a>
      </footer>
    </section>
  );
}
