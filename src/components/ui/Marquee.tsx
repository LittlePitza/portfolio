interface Props {
  items: string[];
  className?: string;
  /** Seconds per loop. */
  duration?: number;
}

/** Endless ticker strip. Content is duplicated once so the loop is seamless. */
export function Marquee({ items, className = "", duration = 40 }: Props) {
  const row = items.map((item, i) => (
    <span key={i} className="flex items-center gap-6 pr-6">
      <span>{item}</span>
      <span aria-hidden className="inline-block h-2 w-2 bg-current" />
    </span>
  ));
  return (
    <div className={`marquee overflow-hidden whitespace-nowrap ${className}`} style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
      <div className="marquee-track">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}
