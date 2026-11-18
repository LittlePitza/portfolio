import type { CSSProperties } from "react";

/** The `--i` of an entrance step (section 7.1): where an element stands in its page's stagger. */
export function enterStep(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
