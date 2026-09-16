import Image from "next/image";
import type { Slide } from "./types";

interface Props {
  slide: Slide;
  index: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Project cover. Uses the real screenshot when `slide.cover` is set; otherwise
 * renders a generated app window in the project colour with its own numbers,
 * so the carousel looks finished before screenshots exist.
 */
export function Cover({ slide, index, sizes = "40vw", className = "", priority }: Props) {
  const label = String(index + 1).padStart(2, "0");

  if (slide.cover) {
    return (
      <div className={`relative overflow-hidden bg-ink ${className}`}>
        <Image src={slide.cover} alt={slide.name} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const stats = slide.numbers.slice(0, 3);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: slide.color }} aria-label={`${slide.name} preview`}>
      <div className="absolute inset-[9%] flex flex-col overflow-hidden rounded-md bg-paper text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 border-b hairline px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="label ml-2 truncate text-muted">{slide.slug}.internal</span>
        </div>
        <div className="grid grow grid-cols-[1fr_3fr] gap-[4%] p-[4%]">
          <div className="space-y-[10%]">
            {[70, 55, 80, 45, 60].map((w, i) => (
              <span
                key={i}
                className="block h-[6%] rounded-sm"
                style={{ width: `${w}%`, background: i === 1 ? slide.color : "rgba(20,20,20,0.1)" }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-[6%]">
            <span className="block h-[7%] w-1/2 rounded-sm bg-ink/15" />
            <div className="grid grid-cols-3 gap-[4%]">
              {stats.map((s) => (
                <div key={s.label} className="rounded-sm border hairline p-[8%]">
                  <p className="font-mono text-[clamp(0.6rem,1.4vw,1.1rem)] leading-none">{s.value}</p>
                  <p className="label mt-1 truncate text-[0.5rem] text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grow space-y-[5%]">
              {[100, 92, 96, 88].map((w, i) => (
                <span key={i} className="block h-[10%] rounded-sm bg-ink/8" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="label absolute right-4 top-3 text-bg/80">{label}</span>
    </div>
  );
}
