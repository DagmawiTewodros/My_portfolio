import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "./content";
import { CurvedGallery } from "./CurvedGallery";
import { clamp, easeOut, prefersReducedMotion, range } from "./scroll";

// Each project appears twice so the ribbon is always full edge to edge.
const CARDS = [...projects, ...projects];

// World units: a card is CARD_H tall; the camera sits CAM_Z away with a FOV-degree lens.
const CARD_H = 1.45;
const CARD_W = 2.32;
const GAP = 0.16;
const CAM_Z = 6;
const FOCAL = 1 / Math.tan((34 * Math.PI) / 180 / 2);
const SEG_X = 40;
const SEG_Y = 8;

const VERT = `
attribute vec2 aPos; // card-local, -0.5..0.5
uniform float uX, uW, uH, uHalfW, uAspect, uFocal, uCamZ, uTwist, uBend, uScale;
varying vec2 vUv;
varying float vShade;
void main() {
  vUv = vec2(aPos.x + 0.5, 0.5 - aPos.y);
  float x = (uX + aPos.x * uW) * uScale;
  float y = aPos.y * uH * uScale;
  // Normalised distance from screen centre, so the ribbon is flat in the
  // middle and curls harder toward both edges.
  float n = clamp(x / uHalfW, -1.6, 1.6);
  float t = uTwist * sign(n) * n * n;
  // Twist about the horizontal axis: on the right the top swings toward the
  // viewer, on the left the bottom does — the ribbon's S-shaped sweep.
  float yr = y * cos(t);
  float z = y * sin(t) + uBend * n * n;
  vShade = 1.0 - 0.18 * abs(sin(t));
  gl_Position = vec4(x * uFocal / uAspect, yr * uFocal, 0.0, uCamZ - z);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform float uShift, uAlpha, uRadius, uCardAspect;
varying vec2 vUv;
varying float vShade;
void main() {
  // Rounded corners.
  vec2 p = (vUv - 0.5) * vec2(uCardAspect, 1.0);
  vec2 q = abs(p) - (vec2(uCardAspect, 1.0) * 0.5 - uRadius);
  if (length(max(q, 0.0)) > uRadius) discard;
  // Chromatic split that grows with ribbon speed.
  float r = texture2D(uTex, vUv + vec2(uShift, 0.0)).r;
  vec4 g = texture2D(uTex, vUv);
  float b = texture2D(uTex, vUv - vec2(uShift, 0.0)).b;
  gl_FragColor = vec4(vec3(r, g.g, b) * vShade, uAlpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

/** Bakes a project screenshot into a 16:10 texture: landscape shots cover, phone shots sit on a dark field. */
function bakeTexture(img: HTMLImageElement, project: Project) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const ctx = c.getContext("2d")!;
  if (project.portrait) {
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, c.width, c.height);
    const h = c.height * 0.9;
    const w = (img.naturalWidth / img.naturalHeight) * h;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  } else {
    const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    ctx.drawImage(
      img,
      (c.width - img.naturalWidth * s) / 2,
      0,
      img.naturalWidth * s,
      img.naturalHeight * s,
    );
  }
  return c;
}

/**
 * "Featured project": the cards fly in flat and small, spread out, then curl
 * into one twisting ribbon. While the section is pinned, scrolling slides the
 * ribbon card by card; fast movement splits the images into RGB fringes.
 * Rendered with raw WebGL (one subdivided plane per card, bent in the vertex
 * shader); browsers without WebGL get the CSS carousel instead.
 */
export function RibbonGallery() {
  const track = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [centre, setCentre] = useState(0);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = track.current;
    if (!canvas || !section) return;
    const context = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!context) {
      setFallback(true);
      return;
    }
    // Re-bound so the hoisted draw() below sees a non-null context.
    const gl: WebGLRenderingContext = context;

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    // One shared, finely subdivided unit plane (triangle list).
    const verts: number[] = [];
    for (let j = 0; j < SEG_Y; j++) {
      for (let i = 0; i < SEG_X; i++) {
        const x0 = i / SEG_X - 0.5;
        const x1 = (i + 1) / SEG_X - 0.5;
        const y0 = 0.5 - j / SEG_Y;
        const y1 = 0.5 - (j + 1) / SEG_Y;
        verts.push(x0, y0, x1, y0, x0, y1, x1, y0, x1, y1, x0, y1);
      }
    }
    const vcount = verts.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const U = {
      x: u("uX"),
      w: u("uW"),
      h: u("uH"),
      halfW: u("uHalfW"),
      aspect: u("uAspect"),
      focal: u("uFocal"),
      camZ: u("uCamZ"),
      twist: u("uTwist"),
      bend: u("uBend"),
      scale: u("uScale"),
      shift: u("uShift"),
      alpha: u("uAlpha"),
      radius: u("uRadius"),
      cardAspect: u("uCardAspect"),
    };
    gl.uniform1f(U.w, CARD_W);
    gl.uniform1f(U.h, CARD_H);
    gl.uniform1f(U.focal, FOCAL);
    gl.uniform1f(U.camZ, CAM_Z);
    gl.uniform1f(U.radius, 0.03);
    gl.uniform1f(U.cardAspect, CARD_W / CARD_H);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Textures: a neutral placeholder until each screenshot has loaded.
    const textures = CARDS.map(() => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([210, 210, 206, 255]),
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    });
    let disposed = false;
    projects.forEach((project, pi) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        const baked = bakeTexture(img, project);
        CARDS.forEach((c, ci) => {
          if (c !== project) return;
          gl.bindTexture(gl.TEXTURE_2D, textures[ci]);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, baked);
        });
        draw();
      };
      img.src = projects[pi].image;
    });

    const reduced = prefersReducedMotion();
    const spacing = CARD_W + GAP;
    const loop = spacing * CARDS.length;
    let width = 1;
    let height = 1;
    let offset = 0;
    let velocity = 0;
    let lastCentre = -1;
    let frame = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth || 1;
      height = canvas.clientHeight || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    function draw() {
      const rect = section!.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = Math.max(1, rect.height - vh);
      const p = clamp(-rect.top / travel);
      // Fly-in while the section rises into view, finished as it pins.
      const intro = easeOut(range(1 - rect.top / vh, 0.15, 1));

      const target = p * loop;
      const prev = offset;
      offset = reduced ? target : offset + (target - offset) * 0.09;
      velocity = velocity * 0.8 + (offset - prev) * 0.2;

      const aspect = width / height;
      // Shrink cards on narrow screens so one fills the width with neighbours peeking.
      const fit = clamp(aspect / 1.6, 0.42, 1);
      const halfW = (CAM_Z / FOCAL) * aspect;
      // Keep the caption just under the centre card, whatever its on-screen size.
      if (captionRef.current) {
        const halfH = ((CARD_H / 2) * FOCAL * fit) / CAM_Z;
        captionRef.current.style.top = `${(50 + halfH * 50 + 4).toFixed(2)}%`;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.aspect, aspect);
      gl.uniform1f(U.halfW, halfW);
      gl.uniform1f(U.twist, 1.3 * intro);
      gl.uniform1f(U.bend, 1.5 * intro);
      gl.uniform1f(U.scale, fit * (0.55 + 0.45 * intro));
      gl.uniform1f(U.shift, reduced ? 0 : clamp(velocity * 0.05, -0.025, 0.025));

      let best = Infinity;
      let bestI = 0;
      CARDS.forEach((_, i) => {
        // Wrap each card into [-loop/2, loop/2) around the centre.
        let x = (((i * spacing - offset) % loop) + loop) % loop;
        if (x >= loop / 2) x -= loop;
        if (Math.abs(x) < best) {
          best = Math.abs(x);
          bestI = i;
        }
        const spread = x * (0.35 + 0.65 * intro);
        gl.uniform1f(U.x, spread);
        gl.uniform1f(U.alpha, clamp(intro * 1.6 - Math.abs(x) * (1 - intro) * 0.6));
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.drawArrays(gl.TRIANGLES, 0, vcount);
      });

      const c = bestI % projects.length;
      if (c !== lastCentre) {
        lastCentre = c;
        setCentre(c);
      }
    }

    const tick = () => {
      draw();
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          frame = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(section);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (fallback) return <CurvedGallery />;

  const current = projects[centre];

  return (
    <section
      ref={track}
      aria-label="Featured projects"
      className="relative h-[360svh] bg-[#ececea] text-[#111]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <p className="absolute left-5 top-20 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-black uppercase tracking-[-0.03em] md:left-10 md:top-24">
          Featured project
        </p>

        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

        <div
          ref={captionRef}
          className="absolute inset-x-0 top-[70%] text-center"
          aria-live="polite"
        >
          <p className="font-display text-sm font-bold uppercase tracking-tight">{current.title}</p>
          <p className="mt-1 text-xs text-[#111]/55">{current.kind}</p>
          <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[#111]/40">
            0{centre + 1} / 0{projects.length}
          </p>
          <a
            href={current.href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#111] px-4 py-2 text-xs font-semibold text-white"
          >
            {current.linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <p className="absolute bottom-6 left-5 font-display text-[clamp(1.25rem,2.5vw,2rem)] font-black uppercase tracking-[-0.03em] md:left-10">
          Web &amp; mobile
        </p>

        {/* The canvas is decorative; this is the accessible list of the same work. */}
        <ul className="sr-only">
          {projects.map((p) => (
            <li key={p.title}>
              <a href={p.href}>
                {p.title} — {p.kind}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
