import type Lenis from "lenis";

let lenis: Lenis | null = null;

/** Registered by SmoothScroll so other components can drive the same instance. */
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollTo(target: number | HTMLElement, options: { immediate?: boolean; offset?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: options.immediate, offset: options.offset ?? 0, duration: 1.1 });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + (options.offset ?? 0), behavior: options.immediate ? "auto" : "smooth" });
}
