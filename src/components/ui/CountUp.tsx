"use client";

import { useEffect, useRef } from "react";

/** Animate the visual value once; assistive technology always receives the final figure. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || !match || media.matches || !("IntersectionObserver" in window)) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const decimals = digits.split(".")[1]?.length ?? 0;
    const formatter = new Intl.NumberFormat("en-US", { useGrouping: digits.includes(","), minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1000, 1);
        el.textContent = `${prefix}${formatter.format(target * (1 - (1 - progress) ** 4))}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(tick);
        else el.textContent = value;
      };
      frame = requestAnimationFrame(tick);
    }, { rootMargin: "0px 0px -10% 0px" });
    observer.observe(el);
    const stop = () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
    const onVisibility = () => { if (document.hidden) stop(); };
    media.addEventListener("change", stop);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      media.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">{value}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
