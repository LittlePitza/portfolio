"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, prefersReducedMotion, REDUCED_FADE } from "@/lib/motion";
import { HOME_POSITION_ATTR } from "@/lib/navigation";
import { placeCovers, type CanvasGeometry } from "./placeCovers";
import { useCarousel } from "./useCarousel";

interface Props {
  /** The canvas, which holds the cover screen, the list of projects and the names. */
  root: RefObject<HTMLDivElement | null>;
  /** "Proyecto {n} de {total}: {name}". */
  announce: string;
  /** The projects' names, in order. */
  names: readonly string[];
}

/** The canvas's moving parts, found once in the server's markup. */
interface Parts {
  portada: HTMLElement | null;
  items: HTMLElement[];
  covers: HTMLElement[];
  names: HTMLElement | null;
  nameItems: HTMLElement[];
}

function findParts(root: HTMLElement): Parts {
  const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
  return {
    portada: root.querySelector<HTMLElement>("[data-portada]"),
    items: all("[data-item]"),
    covers: all("[data-cover]"),
    names: root.querySelector<HTMLElement>("[data-names]"),
    nameItems: all("[data-name-item]"),
  };
}

/** Moves the state attributes the stylesheet reads, and keeps what is not active inert. */
function markPosition(root: HTMLElement, parts: Parts, position: number) {
  const named = Math.max(1, position);
  root.dataset.position = String(position);
  if (parts.portada) parts.portada.inert = position !== 0;
  if (parts.names) {
    parts.names.inert = position === 0;
    parts.names.style.setProperty("--pos", String(named));
  }
  parts.items.forEach((item, index) => {
    const n = index + 1;
    item.toggleAttribute("data-active", n === position);
    item.toggleAttribute("data-past", n < position);
    item.inert = n !== position;
  });
  parts.nameItems.forEach((item, index) => {
    const n = index + 1;
    item.toggleAttribute("data-active", n === position);
    item.toggleAttribute("data-after", n > named);
    item.toggleAttribute("data-far", Math.abs(n - named) > 2);
    const button = item.querySelector("button");
    if (n === position) button?.setAttribute("aria-current", "true");
    else button?.removeAttribute("aria-current");
  });
}

/** Undoes markPosition and every inline style, for the stacked layout. */
function clearPosition(root: HTMLElement, parts: Parts) {
  delete root.dataset.position;
  if (parts.portada) parts.portada.inert = false;
  if (parts.names) {
    parts.names.inert = false;
    parts.names.style.removeProperty("--pos");
  }
  for (const item of parts.items) {
    item.removeAttribute("data-active");
    item.removeAttribute("data-past");
    item.inert = false;
  }
  for (const item of parts.nameItems) {
    for (const name of ["data-active", "data-after", "data-far"]) item.removeAttribute(name);
    item.querySelector("button")?.removeAttribute("aria-current");
  }
  for (const cover of parts.covers) {
    cover.removeAttribute("style");
    cover.removeAttribute("data-near");
  }
}

/**
 * When the canvas part that held focus has just turned inert, focus moves to the new
 * position's text link instead of falling back to the page. Not the cover's: it is still
 * travelling in, and hidden until it is near.
 */
function keepFocus(root: HTMLElement, parts: Parts, position: number, focused: Element | null) {
  const wasLost = focused !== null && root.contains(focused) && focused.closest("[inert]") !== null;
  if (!wasLost) return;
  const owner = position === 0 ? parts.portada : parts.items[position - 1];
  owner?.querySelector<HTMLElement>("a:not([data-cover])")?.focus({ preventScroll: true });
}

/**
 * The stage half of Home's carousel (section 7.4), loaded only where the stage applies.
 * One number rules: `position`, from useCarousel. Each change marks the active project
 * and tweens a continuous value from the old position to the new one in --dur-slow,
 * placing every cover from it on each frame. With reduced motion the covers fade out
 * and in at their new places instead. Unmounting hands the markup back to the stack.
 * A default export, because Canvas loads it with React.lazy.
 */
export default function Carousel({ root, announce, names }: Props) {
  const total = names.length;
  const describe = useCallback(
    (position: number) =>
      announce
        .replace("{n}", String(position))
        .replace("{total}", String(total))
        .replace("{name}", names[position - 1] ?? ""),
    [announce, names, total],
  );
  const { position, announcement } = useCarousel({ root, total, describe });

  const parts = useRef<Parts | null>(null);
  const geometry = useRef<(CanvasGeometry & { coverWidth: number }) | null>(null);
  const shown = useRef({ value: position });
  const tween = useRef<gsap.core.Tween | null>(null);
  const isFirstPosition = useRef(true);

  const paint = useCallback(() => {
    const covers = parts.current?.covers ?? [];
    const box = geometry.current;
    if (!box) return;
    const placements = placeCovers(shown.current.value, covers.length, box);
    covers.forEach((cover, index) => {
      const { x, y, rotation, scale, opacity, visible } = placements[index];
      cover.toggleAttribute("data-near", visible);
      if (!visible) return;
      const left = x - box.coverWidth / 2;
      const top = y - box.coverHeight / 2;
      cover.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(${rotation}deg) scale(${scale})`;
      cover.style.opacity = String(opacity);
    });
  }, []);

  // Find the parts and measure the canvas, again on every resize.
  useLayoutEffect(() => {
    const canvas = root.current;
    if (!canvas) return;
    const found = findParts(canvas);
    parts.current = found;

    const measure = () => {
      const tokens = getComputedStyle(canvas);
      const cover = found.covers[0];
      if (!cover) return;
      geometry.current = {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        margin: parseFloat(tokens.getPropertyValue("--margin")),
        gap: parseFloat(tokens.getPropertyValue("--gap")),
        coverWidth: cover.offsetWidth,
        coverHeight: cover.offsetHeight,
      };
      paint();
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(canvas);

    return () => {
      resize.disconnect();
      tween.current?.kill();
      clearPosition(canvas, found);
    };
  }, [paint, root]);

  useLayoutEffect(() => {
    const canvas = root.current;
    const found = parts.current;
    if (!canvas || !found) return;
    const focused = document.activeElement;
    markPosition(canvas, found, position);
    keepFocus(canvas, found, position, focused);
    tween.current?.kill();

    if (isFirstPosition.current) {
      // Opening, or coming back from a case: already there, nothing travels.
      isFirstPosition.current = false;
      shown.current.value = position;
      paint();
      // The head script hid the cover screen for this load; the canvas now says where it is.
      document.documentElement.removeAttribute(HOME_POSITION_ATTR);
      return;
    }

    const nearCovers = () => found.covers.filter((cover) => cover.hasAttribute("data-near"));
    if (prefersReducedMotion()) {
      tween.current = gsap.to(nearCovers(), {
        opacity: 0,
        duration: REDUCED_FADE / 2,
        onComplete: () => {
          shown.current.value = position;
          paint();
          tween.current = gsap.from(nearCovers(), { opacity: 0, duration: REDUCED_FADE / 2 });
        },
      });
      return;
    }

    for (const cover of found.covers) cover.style.setProperty("will-change", "transform, opacity");
    tween.current = gsap.to(shown.current, {
      value: position,
      duration: DUR.slow,
      ease: EASE,
      onUpdate: paint,
      onComplete: () => {
        for (const cover of found.covers) cover.style.removeProperty("will-change");
      },
    });
  }, [paint, position, root]);

  return (
    <p aria-live="polite" className="sr-only">
      {announcement}
    </p>
  );
}
