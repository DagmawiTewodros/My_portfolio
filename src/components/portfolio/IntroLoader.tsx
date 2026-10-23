import { useEffect, useState } from "react";
import { BRAND } from "./content";
import { prefersReducedMotion } from "./scroll";

/** A closed, gently rippled circle — the line that draws itself around the name. */
function wavyCircle(cx: number, cy: number, r: number, amp: number, waves: number, steps = 240) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    // Start at the top-right so the stroke "arrives" the way it does in the reel.
    const t = (i / steps) * Math.PI * 2 - Math.PI / 3;
    const rr = r + amp * Math.sin(t * waves);
    const x = cx + rr * Math.cos(t);
    const y = cy + rr * Math.sin(t);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

const PATH = wavyCircle(200, 200, 150, 9, 9);
const SESSION_KEY = "intro-seen";

/**
 * Black intro card: the name glows in, a wavy line traces a ring around it,
 * then the whole card lifts away. Shown once per browser session, and never
 * when the visitor prefers reduced motion. The overlay only exists under `.js`,
 * so it can never trap a script-less visitor behind a black screen.
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<"show" | "leave" | "done">("show");

  useEffect(() => {
    // The head script adds `intro-skip` before first paint when this session
    // has already seen the intro; reading it (not storage) keeps re-runs stable.
    const seen = document.documentElement.classList.contains("intro-skip");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage blocked — the intro just plays again next time */
    }
    if (seen || prefersReducedMotion()) {
      setPhase("done");
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const leave = setTimeout(() => setPhase("leave"), 2600);
    const done = setTimeout(() => setPhase("done"), 3500);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase !== "show") document.documentElement.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className="intro" data-phase={phase} aria-hidden="true">
      <div className="intro-stage">
        <svg viewBox="0 0 400 400" className="intro-ring">
          <path d={PATH} pathLength={1} className="intro-ring-path" />
        </svg>
        <p className="intro-word">
          {BRAND.split("").map((ch, i) => (
            <span key={i} style={{ animationDelay: `${120 + i * 70}ms` }}>
              {ch}
            </span>
          ))}
          <span className="intro-dot">.</span>
        </p>
      </div>
    </div>
  );
}
