"use client";

import { useRef } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { BrandMark } from "./BrandMark";
import { CurtainLink } from "./Curtain";
import { MenuLayer } from "./MenuLayer";
import { useHideOnScroll } from "./useHideOnScroll";

interface Props {
  locale: Locale;
  nav: Dictionary["nav"];
  frame: Dictionary["frame"];
  /** Extra classes from the shell, e.g. `stage:hidden` where the full frame replaces it. */
  className?: string;
}

/**
 * The 56 px bar (section 5.2): mark and name on the left, "Menú" on the right, which
 * opens the menu layer. Fixed to the top; it slides away while scrolling down and comes
 * back when scrolling up or when something inside it takes focus. Where the full frame
 * is on screen it stays away and out of the tab order.
 */
export function CompactBar({ locale, nav, frame, className = "" }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const placement = useHideOnScroll();
  const isAway = placement === "frame" || placement === "hidden";
  // Before the first measurement: away wherever the full frame is drawn, so it never slides off it.
  const firstPaint = placement === null ? "stage:-translate-y-full" : "";

  return (
    <>
      <div
        inert={placement === "frame"}
        className={`fixed inset-x-0 top-0 z-(--z-chrome) flex h-14 items-center justify-between
          border-b border-line bg-bg px-(--margin) text-ui
          transition-transform duration-(--dur-base) ease-(--ease) focus-within:translate-y-0
          ${isAway ? "-translate-y-full" : ""} ${firstPaint} ${className}`}
      >
        <CurtainLink href={`/${locale}`} label={nav.work} className="flex min-h-11 items-center gap-2">
          <BrandMark />
          <span>{site.name}</span>
        </CurtainLink>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
          className="min-h-11 min-w-11 text-right"
        >
          {nav.menu}
        </button>
      </div>
      <MenuLayer dialog={dialog} locale={locale} nav={nav} frame={frame} />
    </>
  );
}
