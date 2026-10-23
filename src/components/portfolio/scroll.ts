import { useEffect, useRef, useState, type RefObject } from "react";

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Maps `v` from the [a, b] window onto 0–1, clamped. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Reports how far the user has scrolled through a tall "scrolly" section, as
 * 0 (its top meets the viewport top) to 1 (its bottom meets the viewport
 * bottom). The callback runs inside rAF and should write styles directly —
 * that keeps scroll-linked motion off React's render path.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let visible = true;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? clamp(-rect.top / travel) : rect.top <= 0 ? 1 : 0;
      cb.current(p);
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(measure);
    };

    // Only track while the section is near the viewport.
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              if (visible) schedule();
            },
            { rootMargin: "50% 0px" },
          )
        : null;
    io?.observe(el);

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);
}

/** Like useScrollProgress, but quantised into React state for discrete UI (active index, labels). */
export function useScrollStep(ref: RefObject<HTMLElement | null>, toStep: (p: number) => number) {
  const [step, setStep] = useState(0);
  const fn = useRef(toStep);
  fn.current = toStep;
  useScrollProgress(ref, (p) => {
    const next = fn.current(p);
    setStep((s) => (s === next ? s : next));
  });
  return step;
}

/** Scrolls the window so that `el` sits at progress `p` (0–1) of its scrolly track. */
export function scrollToProgress(el: HTMLElement | null, p: number) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const travel = el.offsetHeight - window.innerHeight;
  window.scrollTo({ top: top + travel * p, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
