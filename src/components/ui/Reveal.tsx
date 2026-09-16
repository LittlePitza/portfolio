"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Animate direct children one after another instead of the block as a whole. */
  stagger?: boolean;
  delay?: number;
  as?: "div" | "section" | "ul" | "ol" | "li";
}

/** Progressive enhancement: content remains visible before JS and if motion is disabled. */
export function Reveal({ children, className, stagger = false, delay = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || media.matches || !("IntersectionObserver" in window)) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const targets = stagger ? Array.from(el.children) : [el];
      targets.forEach((target, index) => {
        animations.push(target.animate(
          [{ opacity: 0, translate: "0 24px" }, { opacity: 1, translate: "0 0" }],
          { duration: 760, delay: delay * 1000 + index * 65, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
        ));
      });
    }, { rootMargin: "0px 0px -7% 0px" });
    observer.observe(el);
    const stop = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
    media.addEventListener("change", stop);
    return () => {
      stop();
      media.removeEventListener("change", stop);
    };
  }, [delay, stagger]);

  const Tag = as;
  return <Tag ref={(element: HTMLElement | null) => { ref.current = element; }} className={className}>{children}</Tag>;
}
