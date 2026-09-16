import Image from "next/image";
import type { Slide } from "./types";

interface Props {
  slide: Slide;
  index: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Hard border and offset shadow. */
  brutal?: boolean;
  /** Show the status stamp in the corner. */
  stamp?: boolean;
}

/**
 * Project cover. Uses the real screenshot when `slide.cover` is set; otherwise
 * renders a generated app window in the project colour with its own numbers,
 * so the carousel looks finished before screenshots exist.
 */
export function Cover({ slide, index, sizes = "40vw", className = "", priority, brutal = true, stamp = false }: Props) {
  const label = String(index + 1).padStart(2, "0");
  const frame = brutal ? "border-2 border-ink shadow-[8px_8px_0_var(--ink)]" : "";

  if (slide.cover) {
    return (
      <div className={`relative overflow-hidden bg-ink ${frame} ${className}`}>
        <Image src={slide.cover} alt={slide.name} fill sizes={sizes} priority={priority} className="object-cover" />
        {stamp && <span className="stamp absolute left-4 top-4 bg-bg text-ink">{slide.status}</span>}
      </div>
    );
  }

  const stats = slide.numbers.slice(0, 3);

  return (
    <div className={`relative overflow-hidden ${frame} ${className}`} style={{ background: slide.color }} aria-label={`${slide.name} preview`}>
      <div className="absolute inset-[9%] flex flex-col overflow-hidden border-2 border-ink bg-paper text-ink">
        <div className="flex items-center gap-1.5 border-b-2 border-ink px-3 py-2">
          <span className="h-2 w-2 bg-ink" />
          <span className="h-2 w-2 bg-ink/40" />
          <span className="h-2 w-2 bg-ink/40" />
          <span className="label ml-2 truncate text-muted">{slide.slug}.internal</span>
        </div>
        <div className="grid grow grid-cols-[1fr_3fr] gap-[4%] p-[4%]">
          <div className="space-y-[10%]">
            {[70, 55, 80, 45, 60].map((w, i) => (
              <span key={i} className="block h-[6%]" style={{ width: `${w}%`, background: i === 1 ? slide.color : "rgba(20,20,20,0.12)" }} />
            ))}
          </div>
          <div className="flex flex-col gap-[6%]">
            <span className="block h-[7%] w-1/2 bg-ink/15" />
            <div className="grid grid-cols-3 gap-[4%]">
              {stats.map((s) => (
                <div key={s.label} className="border-2 border-ink p-[8%]">
                  <p className="font-display text-[clamp(0.8rem,1.8vw,1.5rem)] leading-none">{s.value}</p>
                  <p className="label mt-1 truncate text-[0.5rem] text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grow space-y-[5%]">
              {[100, 92, 96, 88].map((w, i) => (
                <span key={i} className="block h-[10%] bg-ink/8" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="label absolute right-3 top-3 border-2 border-bg px-1.5 py-0.5 text-bg">{label}</span>
      {stamp && <span className="stamp absolute bottom-3 left-3 bg-bg text-ink">{slide.status}</span>}
    </div>
  );
}
