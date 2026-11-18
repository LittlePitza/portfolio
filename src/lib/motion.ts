/**
 * Motion tokens for GSAP and the media queries every animated component reads.
 * They mirror the tokens in src/app/globals.css (docs/02-diseno-v2.md, section 3.4):
 * change both together.
 */

/**
 * The site's one curve. CSS draws it as cubic-bezier(0.22, 1, 0.36, 1), the usual
 * approximation of a quintic ease-out, which is what GSAP calls power4.out.
 */
export const EASE = "power4.out";

/** Durations in seconds, as GSAP takes them. */
export const DUR = { fast: 0.2, base: 0.45, slow: 0.9 } as const;

/** With reduced motion every change is this fade and nothing travels (section 7.6). */
export const REDUCED_FADE = 0.15;

export const MQ = {
  /** The visitor has not asked for reduced motion. */
  motion: "(prefers-reduced-motion: no-preference)",
  /** A pointer that hovers and aims precisely. */
  fine: "(hover: hover) and (pointer: fine)",
  /** The composed-screen breakpoint, the same as the stage: variant. */
  stage: "(min-width: 64rem) and (min-height: 40rem)",
} as const;

/** Whether a query from MQ holds right now. Always false on the server. */
export function matches(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

/** True when the visitor asked for reduced motion. Only meaningful in the browser. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !matches(MQ.motion);
}
