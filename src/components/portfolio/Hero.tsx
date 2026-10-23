import { useEffect, useRef } from "react";
import cutout from "@/assets/profile-cutout.webp";
import { LOCATION, NAME } from "./content";
import { prefersReducedMotion, range, useScrollProgress } from "./scroll";

export function Hero() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useScrollProgress(track, (p) => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--hp", p.toFixed(4));
    el.style.setProperty("--hp-text", range(p, 0, 0.7).toFixed(4));
  });

  // The portrait leans a few pixels toward the pointer.
  useEffect(() => {
    const el = stage.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section id="top" ref={track} className="relative h-[160svh] bg-[#e7e7e4]">
      <div ref={stage} className="hero-stage sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 [background:radial-gradient(60%_55%_at_50%_45%,#f6f6f4,transparent_75%)]"
        />

        <h1 className="hero-title absolute inset-x-0 top-[13svh] text-center font-display font-black uppercase leading-[0.86] tracking-[-0.045em] text-[#111] md:top-[14svh]">
          <span className="sr-only">{NAME} — </span>
          <span className="hero-line block">Explore my</span>
          <span className="hero-line hero-line--fade block">Portfolio</span>
        </h1>

        <img
          src={cutout}
          alt={`Portrait of ${NAME}`}
          width={900}
          height={981}
          fetchPriority="high"
          className="hero-portrait absolute bottom-0 left-1/2 h-[70svh] w-auto max-w-none md:h-[72svh]"
        />

        <div className="hero-meta absolute bottom-8 left-5 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.2em] text-[#111]/60 md:bottom-12 md:left-10">
          <p>Software Developer</p>
          <p>{LOCATION}</p>
        </div>

        <div className="hero-meta absolute bottom-8 right-5 hidden max-w-[16rem] text-right md:bottom-12 md:right-10 md:block">
          <p className="text-xs leading-relaxed text-[#111]/70">
            I build responsive, performant and secure applications that turn real-world problems
            into software people enjoy using.
          </p>
          <ul className="mt-4 space-y-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[#111]/50">
            <li>Web Development</li>
            <li>Mobile Apps</li>
            <li>Landing Pages</li>
          </ul>
        </div>

        <a
          href="#about"
          className="hero-meta absolute bottom-8 left-1/2 hidden -translate-x-1/2 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-white/80 mix-blend-difference md:block"
        >
          Scroll ↓
        </a>
      </div>
    </section>
  );
}
