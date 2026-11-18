"use client";

import { usePathname } from "next/navigation";

interface Props {
  /** The home path, the one page whose hint is about moving. */
  home: string;
  /** "Desliza ↓", "Usa las flechas" (with reduced motion) and "© 2026". */
  labels: { scroll: string; keys: string; rest: string };
}

/**
 * The bottom-left slot of the frame on screen-mode pages (section 5.1): on Home, how to
 * move through the projects; on About and Contact, the year.
 */
export function StageHint({ home, labels }: Props) {
  const pathname = usePathname();
  if (pathname !== home) return labels.rest;

  return (
    <>
      <span className="motion-reduce:hidden">{labels.scroll}</span>
      <span className="hidden motion-reduce:inline">{labels.keys}</span>
    </>
  );
}
