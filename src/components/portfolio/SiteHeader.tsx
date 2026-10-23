import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND, EMAIL, GITHUB_URL, NAV_ITEMS } from "./content";

/**
 * Fixed, transparent header. `mix-blend-difference` lets one set of white
 * marks read correctly over both the light and the dark sections below it.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex h-16 items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <a
            href="#top"
            className="pointer-events-auto font-display text-sm font-bold tracking-[0.18em]"
          >
            {BRAND}
            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle" />
          </a>

          <nav
            className="pointer-events-auto hidden items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="link-underline font-mono text-[0.6875rem] uppercase tracking-[0.2em] opacity-80 hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pointer-events-auto hidden items-center gap-4 lg:flex">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="opacity-80 hover:opacity-100"
            >
              <Github className="h-4 w-4" />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Email" className="opacity-80 hover:opacity-100">
              <Mail className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-overlay"
            className="pointer-events-auto font-mono text-[0.6875rem] uppercase tracking-[0.2em] lg:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-[#0a0a0a] px-5 pb-10 text-white transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden",
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <div className="flex h-16 items-center justify-between">
          <span className="font-display text-sm font-bold tracking-[0.18em]">{BRAND}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-mono text-[0.6875rem] uppercase tracking-[0.2em]"
          >
            Close
          </button>
        </div>
        <nav className="mt-10 flex flex-1 flex-col gap-2" aria-label="Mobile">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${200 + i * 60}ms` : "0ms" }}
              className={cn(
                "flex items-baseline gap-4 border-b border-white/10 py-3 font-display text-4xl font-extrabold uppercase tracking-tight transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
            >
              <span className="font-mono text-xs font-normal text-white/40">0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black"
        >
          Contact me <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </>
  );
}
