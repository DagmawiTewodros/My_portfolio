import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "./content";
import {
  easeInOut,
  lerp,
  range,
  scrollToProgress,
  useScrollProgress,
  useScrollStep,
} from "./scroll";

const RING = [...projects, ...projects];
const YEAR = `'${String(new Date().getFullYear()).slice(2)}`;

// Phase boundaries along the section's scroll track.
const SPIN_END = 0.16;
const MORPH_END = 0.3;
const cycleAt = (i: number) =>
  MORPH_END + (i / Math.max(1, projects.length - 1)) * (1 - MORPH_END - 0.06);

/**
 * Six project cards orbit "Works" as a hexagon; scrolling on folds the ring
 * into a vertical deck that cycles one project at a time, with its name on the
 * left and an index on the right.
 */
export function WorksRing() {
  const track = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const label = useRef<HTMLParagraphElement>(null);

  const active = useScrollStep(track, (p) =>
    p < MORPH_END ? -1 : Math.round(range(p, MORPH_END, 1 - 0.06) * (projects.length - 1)),
  );

  useScrollProgress(track, (p) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const small = vw < 768;
    const radius = Math.min(vw * (small ? 0.36 : 0.22), vh * 0.3);
    const spin = range(p, 0, SPIN_END) * 60;
    const morph = easeInOut(range(p, SPIN_END, MORPH_END));
    const cursor = range(p, MORPH_END, 1 - 0.06) * (projects.length - 1);

    cards.current.forEach((el, i) => {
      if (!el) return;
      const theta = ((i / RING.length) * 360 + spin - 90) * (Math.PI / 180);
      const ring = {
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius,
        rz: (theta * 180) / Math.PI + 90,
        rx: 0,
        s: small ? 0.42 : 0.5,
        o: 1,
      };
      const offset = i - cursor;
      const deck =
        i < projects.length
          ? {
              x: 0,
              // Phones lift the deck to leave room for the copy underneath.
              y: offset * vh * (small ? 0.3 : 0.42) - (small ? vh * 0.1 : 0),
              rz: 0,
              rx: -offset * 38,
              s: 1 - Math.min(1, Math.abs(offset)) * 0.3,
              o: 1 - Math.min(1, Math.abs(offset) * (small ? 0.85 : 0.55)),
            }
          : { x: ring.x * 1.6, y: ring.y * 1.6, rz: ring.rz, rx: 0, s: 0.3, o: 0 };
      const x = lerp(ring.x, deck.x, morph);
      const y = lerp(ring.y, deck.y, morph);
      const rz = lerp(ring.rz, deck.rz, morph);
      const rx = lerp(ring.rx, deck.rx, morph);
      const s = lerp(ring.s, deck.s, morph);
      el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s})`;
      el.style.opacity = String(lerp(ring.o, deck.o, morph));
      el.style.zIndex = String(50 - Math.round(Math.abs(offset) * 10));
    });

    if (label.current) label.current.style.opacity = String(1 - morph);
  });

  const project = active >= 0 ? projects[active] : null;

  return (
    <section
      id="work"
      aria-label="Projects"
      ref={track}
      className="relative h-[420svh] bg-[#efefed] text-[#111]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <p className="absolute left-5 top-20 font-display text-[clamp(1.25rem,2.5vw,2rem)] font-black uppercase tracking-[-0.03em] md:left-10 md:top-24">
          Projects
        </p>

        <div className="absolute inset-0 [perspective:1200px]">
          {RING.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                cards.current[i] = el;
              }}
              aria-hidden
              className={cn(
                "absolute left-1/2 top-1/2 aspect-[16/10] w-[min(78vw,34rem)] overflow-hidden rounded-lg border border-black/5 shadow-[0_40px_70px_-40px_rgba(0,0,0,0.6)] will-change-transform",
                p.portrait ? "bg-[#141414]" : "bg-white",
              )}
            >
              <img
                src={p.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={cn(
                  "h-full w-full",
                  p.portrait ? "object-contain py-4" : "object-cover object-top",
                )}
              />
              <span className="absolute bottom-2 left-3 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[0.625rem] text-white">
                {p.title}
              </span>
            </div>
          ))}
        </div>

        <p
          ref={label}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-lg font-bold uppercase tracking-tight md:text-2xl"
        >
          Works {YEAR}
        </p>

        {/* Deck copy: name + details on the left, index on the right. */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#efefed] via-[#efefed]/95 to-transparent px-5 pb-8 pt-16 transition-opacity duration-500 md:inset-x-auto md:bg-none md:p-0 md:bottom-auto md:left-10 md:top-1/2 md:w-[22%] md:-translate-y-1/2",
            project ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-live="polite"
        >
          {project && (
            <div key={active} className="works-copy">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[#111]/45">
                {project.tag}
              </p>
              <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none tracking-[-0.03em] md:text-4xl">
                {project.title}
              </h3>
              <p className="mt-4 hidden text-sm leading-relaxed text-[#111]/65 md:block">
                {project.description}
              </p>
              <ul className="mt-4 hidden flex-wrap gap-1.5 md:flex">
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-full border border-black/10 px-2 py-0.5 text-[0.625rem] text-[#111]/70"
                  >
                    {h}
                  </li>
                ))}
              </ul>
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#111] px-4 py-2 text-xs font-semibold text-white"
              >
                {project.linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        <ol className="absolute right-5 top-20 space-y-1 text-right font-mono text-[0.625rem] uppercase tracking-[0.15em] md:right-10 md:top-24">
          {projects.map((p, i) => (
            <li key={p.title}>
              <button
                type="button"
                onClick={() => scrollToProgress(track.current, cycleAt(i) + 0.001)}
                className={cn(
                  "transition-colors",
                  i === active
                    ? "text-[#111] underline underline-offset-4"
                    : "text-[#111]/40 hover:text-[#111]/70",
                )}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ol>

        <p className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[#111]/40 md:block">
          ↕ Scroll to cycle
        </p>
      </div>
    </section>
  );
}
