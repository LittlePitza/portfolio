"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Character } from "./Character";
import { usePreloader } from "./PreloaderContext";
import { hasNavigated } from "@/lib/navigation";

const SESSION_KEY = "portfolio:preloaded";
const CHARACTER_WIDTH = 300;

/**
 * Black curtain that the character walks in and pushes off-screen to the right,
 * revealing the hero underneath, while a counter runs to 100. Plays once per
 * session; skipped for reduced motion.
 */
export function Preloader({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { finish } = usePreloader();
  const [mounted, setMounted] = useState(true);

  useGSAP(
    () => {
      // Play only on a real page load of the home, once per session.
      const skip = hasNavigated() || prefersReducedMotion() || window.sessionStorage.getItem(SESSION_KEY) === "1";
      if (skip) {
        setMounted(false);
        finish();
        return;
      }

      document.documentElement.classList.add("is-loading");
      const group = root.current!.querySelector<HTMLElement>("[data-group]")!;
      const char = root.current!.querySelector<HTMLElement>("[data-char]")!;
      const counter = root.current!.querySelector<HTMLElement>("[data-counter]")!;
      const state = { n: 0 };

      // Walk cycle: legs swing from the hips, the body bobs, sweat keeps popping.
      // Runs for the whole opening, so he walks in and then keeps pushing.
      gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { duration: 0.26, ease: "sine.inOut" } })
        .fromTo("[data-leg-back]", { rotation: -14, svgOrigin: "150 262" }, { rotation: 20, svgOrigin: "150 262" }, 0)
        .fromTo("[data-leg-front]", { rotation: 16, svgOrigin: "182 268" }, { rotation: -14, svgOrigin: "182 268" }, 0);
      gsap.to("[data-body]", { y: -5, rotation: 1.5, svgOrigin: "170 270", duration: 0.13, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.fromTo("[data-sweat]", { scale: 0.4, autoAlpha: 0, svgOrigin: "300 72" }, { scale: 1, autoAlpha: 1, svgOrigin: "300 72", duration: 0.35, repeat: -1, repeatDelay: 0.5, ease: "back.out(2)" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          window.sessionStorage.setItem(SESSION_KEY, "1");
          document.documentElement.classList.remove("is-loading");
          finish();
          setMounted(false);
        },
      });

      tl.set(group, { x: -CHARACTER_WIDTH })
        // Counter climbs while the character walks in and gets set.
        .to(state, { n: 100, duration: 1.7, ease: "power2.out", onUpdate: () => (counter.textContent = String(Math.round(state.n)).padStart(3, "0")) }, 0)
        .to(group, { x: 0, duration: 0.9, ease: "power2.out", delay: 0.2 }, 0)
        .to(char, { rotate: -3, y: 4, duration: 0.18, ease: "power1.inOut", yoyo: true, repeat: 3, transformOrigin: "50% 100%" })
        .to(group, { x: () => window.innerWidth + CHARACTER_WIDTH, duration: 1.5 }, "push")
        .to(char, { rotate: -8, duration: 0.5, transformOrigin: "50% 100%" }, "push")
        .to("[data-hud]", { autoAlpha: 0, duration: 0.3 }, "push")
        .to(root.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
    },
    { scope: root },
  );

  if (!mounted) return null;

  return (
    <div ref={root} className="fixed inset-0 z-50 overflow-hidden bg-bg" aria-hidden>
      {/* Runs while the HTML is parsed: if this session already saw the opening, hide the curtain before the first paint. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem(${JSON.stringify(SESSION_KEY)})==="1"){document.currentScript.parentElement.style.display="none"}}catch(e){}`,
        }}
      />
      <div data-group className="absolute inset-y-0 left-0 flex" style={{ width: `calc(100vw + ${CHARACTER_WIDTH}px)` }}>
        <div className="relative flex shrink-0 items-center justify-end" style={{ width: CHARACTER_WIDTH }}>
          <div data-char className="w-[230px] translate-x-2 md:w-[290px]">
            <Character className="h-auto w-full" />
          </div>
        </div>
        <div className="h-full grow bg-ink" />
      </div>
      <div data-hud className="absolute bottom-6 right-6 text-right text-bg">
        <p className="label text-bg/60">{label}</p>
        <p data-counter className="font-display text-7xl leading-none tabular-nums md:text-8xl">
          000
        </p>
      </div>
    </div>
  );
}
