import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Observer } from "gsap/Observer";
import { gsap } from "@/lib/gsap";
import {
  destinationHash,
  forgetLinkHash,
  hasNavigated,
  HOME_POSITION_KEY,
  shouldHandleNavigation,
  wasTraversed,
  WORK_ANCHOR,
} from "@/lib/navigation";

gsap.registerPlugin(Observer);

/** Gestures are ignored this long after one moves the carousel: inertia skips nothing (7.4). */
const GESTURE_LOCK_MS = 700;
/** Least wheel, touch or pointer travel, in px, that counts as a gesture. */
const TOLERANCE = 12;

const KEY_STEPS: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  PageDown: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
  PageUp: -1,
};

function readStoredPosition(total: number) {
  try {
    const stored = Number(window.sessionStorage.getItem(HOME_POSITION_KEY));
    return Number.isInteger(stored) ? Math.min(total, Math.max(0, stored)) : 0;
  } catch {
    return 0;
  }
}

/**
 * Where Home opens: the menu's "Trabajo" (#work) on the last project, at least the first;
 * a back, a forward or a reload on the last position; any other arrival, the mark included,
 * on the cover. introScript applies the same rule to a document load: change both together.
 */
function entryPosition(total: number) {
  const stored = readStoredPosition(total);
  if (destinationHash() === `#${WORK_ANCHOR}`) return Math.max(1, stored);
  const [load] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  const isFirstRoute = !hasNavigated();
  const isLoadReturn = isFirstRoute && (load?.type === "back_forward" || load?.type === "reload");
  const isReturn = wasTraversed() || isLoadReturn;
  return isReturn ? stored : 0;
}

/** True while something else owns the screen: a layer, the opening or the page curtain. */
function isScreenBusy() {
  const html = document.documentElement;
  return html.hasAttribute("data-intro") || html.hasAttribute("data-curtain")
    || document.querySelector("dialog[open]") !== null;
}

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

interface Options {
  /** The canvas: its names list buttons carry `data-go`, its own links to Home move it. */
  root: RefObject<HTMLElement | null>;
  /** The number of projects; positions run from 0 (the cover screen) to `total`. */
  total: number;
  /** The announcement for a project position, e.g. "Proyecto 2 de 9: Attendance". */
  describe: (position: number) => string;
}

/**
 * The carousel's state and input (section 7.4), for the stage only. The wheel, a vertical
 * swipe or a pointer drag move one position per gesture through GSAP's Observer; the
 * arrows, Re Pág / Av Pág, Inicio and Fin move it from anywhere on Home but a field; a
 * name in the list, or a link to Home on Home, jumps. The position is remembered for the
 * tab, and `announcement` describes each move for a live region (empty until one).
 */
export function useCarousel({ root, total, describe }: Options) {
  const [position, setPosition] = useState(() => entryPosition(total));
  const [hasMoved, setHasMoved] = useState(false);
  const lockedUntil = useRef(0);

  const move = useCallback(
    (next: (current: number) => number) => {
      setHasMoved(true);
      setPosition((current) => Math.min(total, Math.max(0, next(current))));
    },
    [total],
  );

  useEffect(forgetLinkHash, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(HOME_POSITION_KEY, String(position));
    } catch {
      // Storage can be blocked; the carousel works the same, it only forgets on reload.
    }
  }, [position]);

  useEffect(() => {
    const step = (direction: number) => {
      const now = performance.now();
      if (now < lockedUntil.current) return;
      lockedUntil.current = now + GESTURE_LOCK_MS;
      move((current) => current + direction);
    };
    const gestures = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      tolerance: TOLERANCE,
      preventDefault: true,
      // Judge each event as it comes rather than once a frame: the lock is cheap to check.
      debounce: false,
      // Wheel down and a swipe up both read as "up" here, and both mean the next project.
      wheelSpeed: -1,
      onUp: () => step(1),
      onDown: () => step(-1),
      ignoreCheck: isScreenBusy,
    });

    const onKeyDown = (event: KeyboardEvent) => {
      const hasModifier = event.altKey || event.ctrlKey || event.metaKey;
      if (event.defaultPrevented || hasModifier || isTypingTarget(event.target) || isScreenBusy()) return;
      const isKnown = event.key in KEY_STEPS || event.key === "Home" || event.key === "End";
      if (!isKnown) return;
      event.preventDefault();
      // A held key moves once, not once per repeat.
      if (event.repeat) return;
      if (event.key === "Home") move(() => 0);
      else if (event.key === "End") move(() => total);
      else move((current) => current + KEY_STEPS[event.key]);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const name = target?.closest<HTMLElement>("[data-go]");
      if (name && root.current?.contains(name)) {
        move(() => Number(name.dataset.go));
        return;
      }
      const link = target?.closest("a");
      if (!link) return;
      const { defaultPrevented, metaKey, ctrlKey, shiftKey, altKey, button } = event;
      const isPlainClick = shouldHandleNavigation({
        defaultPrevented, metaKey, ctrlKey, shiftKey, altKey, button, currentTarget: link,
      });
      if (!isPlainClick) return;
      const url = new URL(link.href);
      if (url.pathname !== window.location.pathname) return;
      // Home's own links on Home: the mark opens the cover screen, "Trabajo" the work.
      const toWork = url.hash === `#${WORK_ANCHOR}`;
      move((current) => (toWork ? Math.max(1, current) : 0));
      if (root.current?.contains(link)) event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      gestures.kill();
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [move, root, total]);

  const announcement = hasMoved && position > 0 ? describe(position) : "";
  return { position, announcement };
}
