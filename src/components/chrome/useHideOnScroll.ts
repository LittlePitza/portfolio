"use client";

import { useEffect, useState } from "react";

/**
 * Where the compact bar should be (section 5.2):
 * - "frame": the full top row of the frame is on screen, so the bar stays out of view
 *   and out of the tab order;
 * - "hidden": the visitor is scrolling down past it;
 * - "shown": at the top of a page without the full frame, or scrolling up.
 */
export type BarPlacement = "frame" | "hidden" | "shown";

/** Scroll travel, in px, below which the direction is not trusted (trackpad jitter). */
const TOLERANCE = 8;

/** Bottom edge of the full frame's top row in document px, or 0 when it is not drawn. */
function frameBottom(scrollY: number) {
  const row = document.querySelector<HTMLElement>("[data-chrome-top]");
  if (!row || row.offsetHeight === 0) return 0;
  return row.getBoundingClientRect().bottom + scrollY;
}

/**
 * Follows the scroll and returns where the compact bar belongs: null until the first
 * measurement, so the server's markup can leave the decision to CSS. Measures at most
 * once per frame, and on resize, since the full frame comes and goes with the breakpoint.
 */
export function useHideOnScroll(): BarPlacement | null {
  const [placement, setPlacement] = useState<BarPlacement | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let pending = 0;

    const update = () => {
      pending = 0;
      const y = window.scrollY;
      const travel = y - lastY;
      if (y < frameBottom(y)) {
        lastY = y;
        setPlacement("frame");
      } else if (y <= 0) {
        lastY = y;
        setPlacement("shown");
      } else if (Math.abs(travel) >= TOLERANCE) {
        lastY = y;
        setPlacement(travel > 0 ? "hidden" : "shown");
      }
    };
    const schedule = () => {
      if (!pending) pending = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(pending);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return placement;
}
