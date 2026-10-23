import { useRef } from "react";
import { cn } from "@/lib/utils";
import { chapters } from "./content";
import { range, scrollToProgress, useScrollProgress, useScrollStep } from "./scroll";

const INTRO = 0.1;
/** Progress at which chapter `i` is centred on screen. */
const chapterAt = (i: number) => INTRO + ((i + 0.5) / chapters.length) * (1 - INTRO);

/**
 * A pinned, dark timeline. A giant word for each chapter drifts sideways
 * behind the copy, and the headline glitches (RGB split) each time the
 * chapter changes.
 */
export function Experience() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // -1 while the "Where I've been" intro is on screen.
  const active = useScrollStep(track, (p) =>
    p < INTRO
      ? -1
      : Math.min(chapters.length - 1, Math.floor(((p - INTRO) / (1 - INTRO)) * chapters.length)),
  );

  useScrollProgress(track, (p) => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--xp", p.toFixed(4));
    el.style.setProperty("--intro", (1 - range(p, INTRO * 0.6, INTRO * 1.1)).toFixed(4));
  });

  const chapter = active >= 0 ? chapters[active] : null;

  return (
    <section
      id="experience"
      aria-label="Experience"
      ref={track}
      className="relative bg-[#0a0a0a] text-white"
      style={{ height: `${(chapters.length + 1) * 100}svh` }}
    >
      <div ref={stage} className="xp-stage sticky top-0 h-svh overflow-hidden">
        {/* Giant backdrop words, one row, sliding left across the whole track. */}
        <div
          aria-hidden
          className="xp-backdrop absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display font-black uppercase leading-none tracking-[-0.04em]"
        >
          <span className="xp-backdrop-row inline-block">
            {chapters.map((c) => (
              <span key={c.backdrop} className="mr-[0.4em]">
                {c.backdrop}
              </span>
            ))}
          </span>
        </div>

        <div className="absolute inset-x-5 top-20 flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/50 md:inset-x-10 md:top-24">
          <span>{chapter ? chapter.eyebrow : "Foundation & Journey"}</span>
          <span className="flex items-center gap-3">
            {chapter ? `0${active + 1} / 0${chapters.length}` : ""}
            <span className="relative h-px w-16 bg-white/15 md:w-28">
              <span className="xp-progress absolute inset-y-0 left-0 bg-white" />
            </span>
          </span>
        </div>

        {/* Intro title */}
        <div className="xp-intro absolute inset-x-5 top-1/2 -translate-y-1/2 md:inset-x-10">
          <h2 className="glitch font-display text-[clamp(3rem,10vw,9rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
            Where
            <br />
            I've been
          </h2>
          <p className="mt-6 max-w-sm text-sm text-white/60">
            My journey through learning, building and shipping.
          </p>
        </div>

        {/* Active chapter */}
        <div
          className="absolute inset-x-5 top-1/2 -translate-y-1/2 md:inset-x-10 md:left-[18%]"
          aria-live="polite"
        >
          {chapter && (
            <div key={active} className="xp-chapter max-w-3xl">
              <h3 className="glitch glitch--burst font-display text-[clamp(2.5rem,7.5vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em]">
                {chapter.title[0]}
                <br />
                {chapter.title[1]}
              </h3>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                {chapter.body}
              </p>
              <dl className="mt-10 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
                {chapter.milestones.map((m, i) => (
                  <div key={i}>
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/40">
                      {m.label} {String(i + 1).padStart(2, "0")}
                    </dt>
                    <dd className="mt-2 text-sm text-white/85">{m.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="absolute inset-x-5 bottom-8 flex flex-wrap gap-2 md:inset-x-10 md:bottom-10">
          {chapters.map((c, i) => (
            <button
              key={c.tab}
              type="button"
              onClick={() => scrollToProgress(track.current, chapterAt(i))}
              aria-current={i === active ? "step" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors duration-300",
                i === active
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white/60 hover:border-white/50 hover:text-white",
              )}
            >
              {c.tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
