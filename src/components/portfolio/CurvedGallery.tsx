import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { projects } from "./content";
import { prefersReducedMotion } from "./scroll";

const REPEAT = 4;
const items = Array.from(
  { length: projects.length * REPEAT },
  (_, i) => projects[i % projects.length],
);

/**
 * An endless strip of project cards bent onto the inside of a cylinder: cards
 * curl toward the viewer as they near the edges. It drifts on its own, and can
 * be dragged (mouse or touch) to scrub through.
 */
export function CurvedGallery() {
  const viewport = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const [centre, setCentre] = useState(0);

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    const reduced = prefersReducedMotion();
    let offset = 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let moved = 0;
    let frame = 0;
    let running = false;
    let nearest = -1;

    const render = () => {
      const width = vp.clientWidth;
      const card = cards.current[0]?.offsetWidth ?? 300;
      const gap = card * 1.06;
      const total = gap * items.length;
      const half = width / 2;
      let best = Infinity;
      let bestI = 0;
      cards.current.forEach((el, i) => {
        if (!el) return;
        // Wrap each card into [-total/2, total/2) around the centre.
        let x = (((i * gap - offset) % total) + total) % total;
        if (x >= total / 2) x -= total;
        const u = Math.max(-1.6, Math.min(1.6, x / half));
        const rot = -u * 46;
        const z = u * u * card * 0.8;
        el.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${rot}deg)`;
        el.style.zIndex = String(100 - Math.round(Math.abs(u) * 10));
        el.style.opacity = Math.abs(u) > 1.45 ? "0" : "1";
        if (Math.abs(x) < best) {
          best = Math.abs(x);
          bestI = i;
        }
      });
      if (bestI !== nearest) {
        nearest = bestI;
        setCentre(bestI % projects.length);
      }
    };

    const loop = () => {
      if (!dragging) {
        velocity *= 0.94;
        offset += velocity + (reduced ? 0 : 0.6);
      }
      render();
      frame = requestAnimationFrame(loop);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      velocity = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      offset -= dx;
      velocity = -dx;
      if (moved > 6) vp.setPointerCapture?.(e.pointerId);
    };
    const onUp = () => {
      dragging = false;
    };
    // A drag should never also count as a click on the card under the pointer.
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    io.observe(vp);
    render();

    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    vp.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      vp.removeEventListener("click", onClick, true);
    };
  }, []);

  const current = projects[centre];

  return (
    <section
      aria-label="Featured projects"
      className="relative overflow-hidden bg-[#ececea] py-24 text-[#111] md:py-32"
    >
      <div className="px-5 md:px-10">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[#111]/50">
          Featured Project
        </p>
        <h2 className="mt-3 font-display text-[clamp(2.25rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          Selected work
        </h2>
      </div>

      <div
        ref={viewport}
        className="relative mt-14 h-[clamp(200px,24vw,360px)] cursor-grab touch-pan-y select-none active:cursor-grabbing [perspective:1100px] md:mt-20"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {items.map((p, i) => (
            <a
              key={i}
              ref={(el) => {
                cards.current[i] = el;
              }}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              draggable={false}
              tabIndex={i < projects.length ? undefined : -1}
              aria-hidden={i < projects.length ? undefined : true}
              aria-label={i < projects.length ? `${p.title} — ${p.kind}` : undefined}
              className={cn(
                "absolute left-1/2 top-0 -ml-[clamp(100px,11vw,180px)] aspect-[16/10] w-[clamp(200px,22vw,360px)] overflow-hidden rounded-md shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] will-change-transform",
                p.portrait ? "bg-[#141414]" : "bg-white",
              )}
            >
              <img
                src={p.image}
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                className={cn(
                  "h-full w-full",
                  p.portrait ? "object-contain py-3" : "object-cover object-top",
                )}
              />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center" aria-live="polite">
        <p className="font-display text-sm font-bold uppercase tracking-tight">{current.title}</p>
        <p className="mt-1 text-xs text-[#111]/55">{current.kind}</p>
        <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[#111]/40">
          Drag to explore
        </p>
      </div>

      <p className="pointer-events-none absolute bottom-6 left-5 font-display text-[clamp(1.25rem,2.5vw,2rem)] font-black uppercase tracking-[-0.03em] md:left-10">
        Web &amp; Mobile
      </p>
    </section>
  );
}
