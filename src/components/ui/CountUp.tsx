"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Counts a figure up from zero when it enters the viewport. Understands
 * prefixes and suffixes ("-28%", "1,050", "20+", "2×"); anything without a
 * leading number renders as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);

  useGSAP(
    () => {
      if (!match || prefersReducedMotion()) return;
      const [, prefix, digits, suffix] = match;
      const target = parseFloat(digits.replace(/,/g, ""));
      const decimals = digits.includes(".") ? digits.split(".")[1]!.length : 0;
      const grouped = digits.includes(",");
      const state = { n: 0 };
      gsap.to(state, {
        n: target,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => {
          const formatted = grouped ? Math.round(state.n).toLocaleString("en-US") : state.n.toFixed(decimals);
          ref.current!.textContent = `${prefix}${formatted}${suffix}`;
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
