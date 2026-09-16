"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Props {
  items: string[];
  className?: string;
  /** Seconds per loop. */
  duration?: number;
  lang?: "es" | "en";
}

/** One accessible copy, a seamless visual loop, and an explicit pause control. */
export function Marquee({ items, className = "", duration = 40, lang = "es" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = root.current;
    const moving = track.current;
    if (!el || !moving) return;
    let inView = false;
    const sync = () => { moving.style.animationPlayState = paused || !inView || document.hidden ? "paused" : ""; };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  const row = items.map((item, index) => (
    <span key={`${item}-${index}`} className="flex items-center gap-6 pr-6">
      <span>{item}</span>
      <span aria-hidden="true" className="inline-block h-2 w-2 bg-current" />
    </span>
  ));

  return (
    <div ref={root} className={`marquee relative overflow-hidden whitespace-nowrap ${className}`} style={{ "--marquee-duration": `${Math.max(10, duration)}s` } as CSSProperties}>
      <div ref={track} className="marquee-track">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden="true">{row}</div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        aria-label={lang === "es" ? "Pausar animación" : "Pause animation"}
        onClick={() => setPaused((value) => !value)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l border-current/20 bg-inherit motion-reduce:hidden"
      >
        <span aria-hidden="true" className="text-xs">{paused ? "▶" : "Ⅱ"}</span>
      </button>
    </div>
  );
}
