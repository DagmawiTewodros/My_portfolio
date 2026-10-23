import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { services } from "./content";

/** Accordion of services; the open row turns into a dark card. */
export function Services() {
  const [open, setOpen] = useState(services.length - 1);
  const base = useId();

  return (
    <section id="services" className="relative bg-[#efefed] px-5 py-24 text-[#111] md:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-[-0.04em]">
          The services I provide
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.18em] text-[#111]/50">
          Visually appealing, functional products tailored to each client's needs — with a
          consistent experience across every platform.
        </p>
      </div>

      <ul className="mx-auto mt-14 max-w-3xl space-y-3">
        {services.map((s, i) => {
          const isOpen = open === i;
          const panel = `${base}-panel-${i}`;
          return (
            <li
              key={s.title}
              className={cn(
                "overflow-hidden rounded-2xl border transition-[background-color,color,border-color,box-shadow] duration-500",
                isOpen
                  ? "border-[#111] bg-[#0e0e0e] text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
                  : "border-black/10 bg-white/50 hover:border-black/25",
              )}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="grid w-full grid-cols-[2rem_1fr_2rem] items-center px-5 py-5 text-left md:px-7"
                >
                  <span className="font-mono text-[0.625rem] opacity-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-center font-display text-xs font-bold uppercase tracking-[0.18em] md:text-sm">
                    {s.title}
                  </span>
                  <Plus
                    className={cn(
                      "h-4 w-4 justify-self-end transition-transform duration-500",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
              </h3>
              <div
                id={panel}
                role="region"
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="min-h-0" inert={!isOpen}>
                  <div className="px-5 pb-6 md:px-7">
                    <p className="max-w-xl text-sm leading-relaxed text-white/75">{s.body}</p>
                    <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/50">
                        Deliverables: {s.deliverables}
                      </p>
                      <ul className="flex gap-2" aria-label="Tools">
                        {s.tools.map((t) => (
                          <li
                            key={t.name}
                            title={t.name}
                            className="grid h-8 w-8 place-items-center rounded-lg bg-white/90"
                          >
                            <img
                              src={t.icon}
                              alt={t.name}
                              width={18}
                              height={18}
                              loading="lazy"
                              className="h-[18px] w-[18px]"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
