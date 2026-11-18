"use client";

import { useEffect } from "react";

/** How much of an element must show before it enters. */
const THRESHOLD = 0.15;

/**
 * The entrance below the fold (section 7.1): every `[data-enter-view]` on the page gets
 * `data-enter`, and so the CSS entrance, the first time it reaches the viewport. Until
 * then globals.css keeps it out of sight, but only when scripts run (`html[data-js]`).
 * Renders nothing; mount it once in a page that uses the attribute.
 */
export function EnterOnView() {
  useEffect(() => {
    const pending = document.querySelectorAll<HTMLElement>("[data-enter-view]:not([data-enter])");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-enter", "");
          observer.unobserve(entry.target);
        }
      },
      { threshold: THRESHOLD },
    );
    pending.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
