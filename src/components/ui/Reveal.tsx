"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Animate direct children one after another instead of the block as a whole. */
  stagger?: boolean;
  delay?: number;
  as?: "div" | "section" | "ul" | "ol" | "li";
}

/** Fades and lifts content in once it scrolls into view. Runs once. */
export function Reveal({ children, className, stagger = false, delay = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current!;
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        delay,
        ease: "expo.out",
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  const Tag = as;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Tag ref={ref as any} className={className}>{children}</Tag>;
}
