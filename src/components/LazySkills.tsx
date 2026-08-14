import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

const skillLogos = [
  { name: "HTML5", url: "/icons/html5-original.svg" },
  { name: "CSS3", url: "/icons/css3-original.svg" },
  { name: "JavaScript", url: "/icons/javascript-original.svg" },
  { name: "TypeScript", url: "/icons/typescript-original.svg" },
  { name: "Python", url: "/icons/python-original.svg" },
  { name: "Flutter", url: "/icons/flutter-original.svg" },
  { name: "Dart", url: "/icons/dart-original.svg" },
  { name: "SQLite", url: "/icons/sqlite-original.svg" },
  { name: "Git", url: "/icons/git-original.svg" },
  { name: "GitHub", url: "/icons/github-original.svg" },
  { name: "React", url: "/icons/react-original.svg" },
  { name: "Tailwind CSS", url: "/icons/tailwindcss-original.svg" },
  { name: "VS Code", url: "/icons/vscode-original.svg" },
  { name: "Figma", url: "/icons/figma-original.svg" },
];

const MARQUEE_MASK = "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)";

function MarqueeRow({
  items,
  reverse = false,
  duration,
  label,
}: {
  items: typeof skillLogos;
  reverse?: boolean;
  duration: string;
  label?: string;
}) {
  return (
    <div
      className="marquee relative overflow-hidden"
      style={{ maskImage: MARQUEE_MASK, WebkitMaskImage: MARQUEE_MASK }}
    >
      <div
        className={cn("marquee-track flex w-max", reverse && "marquee-track--reverse")}
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {[0, 1].map((half) => (
          <ul
            key={half}
            aria-hidden={half === 1 || !label ? true : undefined}
            aria-label={half === 0 ? label : undefined}
            className="flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4"
          >
            {items.map((skill) => (
              <li
                key={skill.name}
                className="group/logo flex h-20 w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-card/80 px-2 backdrop-blur transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_34px_-22px_oklch(0.22_0.04_180_/_0.55)] sm:h-24 sm:w-32 sm:gap-2 sm:px-3"
              >
                <img
                  src={skill.url}
                  alt=""
                  width={36}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-8 object-contain opacity-70 grayscale transition duration-300 ease-out group-hover/logo:scale-110 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 sm:h-9 sm:w-9"
                />
                <span className="text-center text-[0.6875rem] font-medium leading-tight text-muted-foreground transition-colors duration-300 group-hover/logo:text-foreground">
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function SkillsMarquee() {
  const split = Math.ceil(skillLogos.length / 2);
  const rowTwo = [...skillLogos.slice(split), ...skillLogos.slice(0, split)];

  return (
    <div className="mt-12 flex flex-col gap-3 sm:mt-14 sm:gap-4">
      <MarqueeRow items={skillLogos} duration="46s" label="Technologies I work with" />
      <MarqueeRow items={rowTwo} reverse duration="54s" />
    </div>
  );
}
