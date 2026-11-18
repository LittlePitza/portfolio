"use client";

import { useEffect, useRef } from "react";
import { MQ } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import styles from "./cards.module.css";

/** How far, in px, the group travels toward the pointer on each axis (section 6.3). */
const REACH = 6;

/**
 * The cards' table: a group that follows a fine pointer by up to 6 px, and the children's
 * neighbours soften on hover through the data-siblings rule. Touch screens and reduced
 * motion get a still group. The offset is written as --px / --py for cards.module.css.
 */
export function ParallaxStack({ children }: { children: React.ReactNode }) {
  const stack = useRef<HTMLDivElement>(null);
  const hasFinePointer = useMediaQuery(MQ.fine);
  const allowsMotion = useMediaQuery(MQ.motion);
  const isActive = hasFinePointer && allowsMotion;

  useEffect(() => {
    const element = stack.current;
    if (!isActive || !element) return;
    const follow = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2 * REACH;
      const y = (event.clientY / window.innerHeight - 0.5) * 2 * REACH;
      element.style.setProperty("--px", x.toFixed(2));
      element.style.setProperty("--py", y.toFixed(2));
    };
    window.addEventListener("pointermove", follow);
    return () => {
      window.removeEventListener("pointermove", follow);
      element.style.removeProperty("--px");
      element.style.removeProperty("--py");
    };
  }, [isActive]);

  return (
    <div ref={stack} data-siblings className={styles.stack}>
      {children}
    </div>
  );
}
