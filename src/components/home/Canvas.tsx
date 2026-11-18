"use client";

import { lazy, Suspense, useRef } from "react";
import { MQ } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import styles from "./carousel.module.css";

// Its own chunk, with GSAP's Observer: a phone or a short window never downloads it.
const Carousel = lazy(() => import("./Carousel"));

interface Props {
  /** The cover screen, the list of projects and the names, rendered on the server. */
  children: React.ReactNode;
  /** "Proyecto {n} de {total}: {name}". */
  announce: string;
  names: readonly string[];
}

/**
 * Home's canvas (section 6.1): the one DOM both layouts share. Stacked, it is the page;
 * on the stage carousel.module.css composes it into a single viewport (`data-fit` tells
 * the shell so), and the carousel is mounted to drive it.
 */
export function Canvas({ children, announce, names }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const isStage = useMediaQuery(MQ.stage);

  return (
    <div ref={root} data-fit className={styles.canvas}>
      {children}
      {isStage && (
        <Suspense fallback={null}>
          <Carousel root={root} announce={announce} names={names} />
        </Suspense>
      )}
    </div>
  );
}
