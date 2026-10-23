import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./scroll";

type Vortex = { x: number; y: number; r: number; s: number };

// Positions are fractions of the canvas; `s` is spin strength and direction.
const VORTICES: Vortex[] = [
  { x: 0.12, y: 0.18, r: 0.07, s: 1.2 },
  { x: 0.34, y: 0.3, r: 0.12, s: -1.6 },
  { x: 0.58, y: 0.16, r: 0.06, s: 1.1 },
  { x: 0.8, y: 0.26, r: 0.1, s: 1.5 },
  { x: 0.92, y: 0.08, r: 0.05, s: -0.9 },
  { x: 0.5, y: 0.45, r: 0.16, s: 1.3 },
  { x: 0.22, y: 0.55, r: 0.08, s: -1 },
];

/**
 * A monochrome, Van Gogh–style night sky: particles follow a swirling flow
 * field and leave short brush-like trails that slowly fade. Pauses whenever
 * it is off screen, and renders a single settled frame for reduced motion.
 */
export function StarryCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let frame = 0;
    let running = false;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    type P = { x: number; y: number; life: number; tone: number };
    let ps: P[] = [];

    const spawn = (p: P) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h * 0.82;
      p.life = 60 + Math.random() * 140;
      p.tone = 120 + Math.random() * 135;
      return p;
    };

    const field = (x: number, y: number) => {
      // A slow, wavy drift to the right…
      let vx = 1;
      let vy = 0.35 * Math.sin(y * 0.012 + t * 0.6) + 0.25 * Math.cos(x * 0.006 - t * 0.3);
      // …bent into whirlpools around each "star".
      const m = Math.min(w, h);
      for (const v of VORTICES) {
        const dx = x - v.x * w;
        const dy = y - v.y * h;
        const rr = (v.r * m) ** 2;
        const f = v.s / (1 + (dx * dx + dy * dy) / rr);
        const len = Math.hypot(dx, dy) || 1;
        vx += (-dy / len) * f * 2.2;
        vy += (dx / len) * f * 2.2;
      }
      return Math.atan2(vy, vx);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0b0b0c";
      ctx.fillRect(0, 0, w, h);
      const count = Math.round(Math.min(1400, (w * h) / 900));
      ps = Array.from({ length: count }, () => spawn({ x: 0, y: 0, life: 0, tone: 0 }));
    };

    const step = (steps: number) => {
      for (let s = 0; s < steps; s++) {
        ctx.fillStyle = "rgba(11,11,12,0.035)";
        ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        for (const p of ps) {
          const a = field(p.x, p.y);
          const nx = p.x + Math.cos(a) * 1.6;
          const ny = p.y + Math.sin(a) * 1.6;
          ctx.strokeStyle = `rgba(${p.tone},${p.tone},${p.tone},0.55)`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          p.x = nx;
          p.y = ny;
          if (--p.life <= 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) spawn(p);
        }
        t += 0.004;
      }
    };

    const loop = () => {
      step(1);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    const reduced = prefersReducedMotion();
    // Pre-roll so the sky is already painted when it scrolls into view.
    step(reduced ? 220 : 90);

    const ro = new ResizeObserver(() => {
      resize();
      step(reduced ? 220 : 90);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

/** Gothic spires along the bottom edge — a nod to the village in the painting. */
export function Skyline({ className }: { className?: string }) {
  const spires: [number, number, number][] = [
    [40, 120, 10],
    [70, 60, 16],
    [95, 180, 8],
    [118, 90, 12],
    [150, 260, 9],
    [175, 110, 14],
    [205, 70, 10],
    [240, 150, 9],
    [262, 85, 12],
    [300, 50, 16],
    [340, 100, 10],
    [380, 65, 14],
    [420, 40, 18],
    [470, 75, 12],
    [520, 45, 16],
    [600, 30, 20],
    [680, 55, 14],
    [760, 35, 18],
    [840, 60, 12],
    [900, 40, 16],
    [960, 70, 10],
  ];
  let d = "M0 400 L0 330";
  for (const [x, hgt, wdt] of spires) {
    const base = 330;
    d += ` L${x - wdt} ${base} L${x - wdt} ${base - hgt * 0.45} L${x} ${base - hgt} L${x + wdt} ${base - hgt * 0.45} L${x + wdt} ${base}`;
  }
  d += " L1000 330 L1000 400 Z";
  return (
    <svg aria-hidden viewBox="0 0 1000 400" preserveAspectRatio="none" className={className}>
      <path d={d} fill="#050505" />
      <path d="M0 360 Q250 330 500 352 T1000 340 L1000 400 L0 400 Z" fill="#050505" />
    </svg>
  );
}
