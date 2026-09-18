import type { CSSProperties, ReactNode } from "react";
import styles from "./plate.module.css";

interface Props {
  /** The line across the top: the slug and the project's idea in a few words. */
  caption: string;
  /** `Fig. 01`, the project's place in the list. */
  figure: string;
  /** The mat: the project's colour. */
  color: string;
  /** What the drawing shows, for anyone who cannot see it. */
  alt: string;
  children: ReactNode;
}

/**
 * The frame every cover shares: a mat in the project's colour, a caption
 * line, and a 4:3 stage the app's fragments are drawn on. Everything inside is
 * sized in em from the frame's own box, so the drawing is identical on a
 * 320px phone and across a full-width case page, and never goes soft the way
 * a scaled screenshot does. Assistive technology reads it as one image.
 */
export function Plate({ caption, figure, color, alt, children }: Props) {
  return (
    <div
      role="img"
      aria-label={alt}
      data-plate
      data-nosnippet
      className={styles.plate}
      style={{ "--mat": color, "--mat-ink": inkOn(color) } as CSSProperties}
    >
      <div className={styles.inner} aria-hidden>
        <div className={styles.caption}>
          <span>{caption}</span>
          <span>{figure}</span>
        </div>
        <div className={styles.stage}>{children}</div>
      </div>
    </div>
  );
}

/** The site's ink or its paper, whichever has more contrast on the mat (WCAG relative luminance). */
function inkOn(hex: string) {
  const [r, g, b] = [1, 3, 5].map((at) => {
    const channel = parseInt(hex.slice(at, at + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Where contrast against #141414 (L 0.007) and against #f6f6f3 (L 0.92) is equal.
  return luminance >= 0.185 ? "#141414" : "#f6f6f3";
}
