"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MQ } from "@/lib/motion";
import { Character } from "./Character";
import { usePreloader } from "./PreloaderContext";
import { hasNavigated } from "@/lib/navigation";
import { INTRO_ATTR, INTRO_KEY } from "./intro";

const CHARACTER_WIDTH = 300;
/** The whole opening never runs longer than this (section 7.2). */
const MAX_MS = 2600;
/** When the character, having arrived, starts pushing the curtain off. */
const PUSH_AT = DUR.base + 0.2;

/**
 * The head script already ruled on this load, and its mark is read once, here, while
 * this module first runs in the browser. Reading it inside the effect would miss:
 * React mounts twice in development, and the first departure clears the mark.
 */
const openedWithIntro = typeof document !== "undefined" && document.documentElement.hasAttribute(INTRO_ATTR);

/** A brief, skippable signature moment. Never hides the page without JavaScript. */
export function Preloader({ label, skipLabel }: { label: string; skipLabel: string }) {
  const root = useRef<HTMLDivElement>(null);
  const skip = useRef<() => void>(() => {});
  const { finish } = usePreloader();
  const [mounted, setMounted] = useState(true);

  useGSAP(() => {
    const el = root.current;
    if (!openedWithIntro || hasNavigated() || !el) {
      document.documentElement.removeAttribute(INTRO_ATTR);
      setMounted(false);
      finish();
      return;
    }
    // Put the mark back: the curtain is on screen from the first paint and stays there.
    document.documentElement.setAttribute(INTRO_ATTR, "");
    const group = el.querySelector<HTMLElement>("[data-group]")!;
    const char = el.querySelector<HTMLElement>("[data-char]")!;
    const counter = el.querySelector<HTMLElement>("[data-counter]")!;
    const motion = window.matchMedia(MQ.motion);
    const state = { n: 0 };
    const loops: gsap.core.Animation[] = [];
    let completed = false;

    const complete = () => {
      if (completed) return;
      completed = true;
      window.clearTimeout(safety);
      timeline?.kill();
      loops.forEach((animation) => animation.kill());
      try { window.sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* The intro still finishes. */ }
      document.documentElement.removeAttribute(INTRO_ATTR);
      el.style.visibility = "hidden";
      finish();
      setMounted(false);
    };
    skip.current = complete;
    const onKey = (event: KeyboardEvent) => {
      // Keyboard visitors can get straight to the page without a focus trap.
      if (event.key === "Escape" || event.key === "Tab") complete();
    };
    const onVisibility = () => { if (document.hidden) complete(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", complete);
    const safety = window.setTimeout(complete, MAX_MS);

    loops.push(
      gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 0.22, ease: "sine.inOut" } })
        .fromTo("[data-leg-back]", { rotation: -14, svgOrigin: "150 262" }, { rotation: 20, svgOrigin: "150 262" }, 0)
        .fromTo("[data-leg-front]", { rotation: 16, svgOrigin: "182 268" }, { rotation: -14, svgOrigin: "182 268" }, 0),
      gsap.to("[data-body]", { y: -5, rotation: 1.5, svgOrigin: "170 270", duration: 0.13, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      gsap.fromTo("[data-sweat]", { scale: 0.4, autoAlpha: 0, svgOrigin: "300 72" }, { scale: 1, autoAlpha: 1, svgOrigin: "300 72", duration: 0.35, repeat: -1, repeatDelay: 0.5, ease: "back.out(2)" }),
    );

    // Every beat is a token (section 7.2); only the character's own nudge keeps its timing.
    const showCount = () => { counter.textContent = String(Math.round(state.n)).padStart(3, "0"); };
    const timeline = gsap.timeline({ defaults: { ease: EASE }, onComplete: complete });
    timeline.set(group, { x: -CHARACTER_WIDTH })
      .to(state, { n: 100, duration: DUR.slow, onUpdate: showCount }, 0)
      .to(group, { x: 0, duration: DUR.base }, 0)
      .to(char, { rotate: -3, y: 4, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: "50% 100%" },
        DUR.base)
      .to(group, { x: () => window.innerWidth + CHARACTER_WIDTH, duration: DUR.slow }, PUSH_AT)
      .to(char, { rotate: -8, duration: DUR.base, transformOrigin: "50% 100%" }, PUSH_AT)
      .to("[data-hud], [data-skip]", { autoAlpha: 0, duration: DUR.fast }, PUSH_AT)
      .to(el, { autoAlpha: 0, duration: DUR.fast }, PUSH_AT + DUR.slow - DUR.fast);

    return () => {
      window.clearTimeout(safety);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", complete);
      document.documentElement.removeAttribute(INTRO_ATTR);
      loops.forEach((animation) => animation.kill());
      timeline?.kill();
      skip.current = () => {};
    };
  }, { scope: root });

  if (!mounted) return null;

  return (
    <div ref={root} data-preloader className="fixed inset-0 z-(--z-preloader) overflow-hidden bg-bg">
      {/* Parked exactly where the timeline starts it, so the painted frame is frame one. */}
      <div data-group aria-hidden="true" className="absolute inset-y-0 left-0 flex" style={{ width: `calc(100vw + ${CHARACTER_WIDTH}px)`, transform: `translateX(-${CHARACTER_WIDTH}px)` }}>
        <div className="relative flex shrink-0 items-center justify-end" style={{ width: CHARACTER_WIDTH }}>
          <div data-char className="w-[230px] translate-x-2 stage:w-[290px]">
            <Character className="h-auto w-full" />
          </div>
        </div>
        <div className="h-full grow bg-ink" />
      </div>
      {/* Section 7.2: count and label in text-ui, bottom left on column 1's line. */}
      <div data-hud aria-hidden="true" className="absolute bottom-(--margin) left-(--margin) text-ui text-bg">
        <p>{label}</p>
        <p data-counter className="tabular-nums">000</p>
      </div>
      <button
        data-skip
        type="button"
        onClick={() => skip.current()}
        className="absolute right-(--margin) bottom-(--margin) min-h-11 min-w-11 text-right text-ui text-bg"
      >
        {skipLabel}
      </button>
    </div>
  );
}
