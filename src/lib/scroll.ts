import type Lenis from "lenis";

let lenis: Lenis | null = null;

/** Registered by SmoothScroll so other components can drive the same instance. */
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollTo(target: number | HTMLElement, options: { immediate?: boolean; offset?: number } = {}) {
  if (typeof window === "undefined") return;
  const immediate = options.immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    lenis.scrollTo(target, { immediate, offset: options.offset ?? 0, duration: 0.85 });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + (options.offset ?? 0), behavior: immediate ? "instant" : "smooth" });
}
