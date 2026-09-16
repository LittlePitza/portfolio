"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Character } from "./Character";
import { usePreloader } from "./PreloaderContext";

const SESSION_KEY = "portfolio:preloaded";
const CHARACTER_WIDTH = 220;

/**
 * Black curtain that the character walks in and pushes off-screen to the right,
 * revealing the hero underneath. Plays once per session; skipped for reduced motion.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const { finish } = usePreloader();
  const [mounted, setMounted] = useState(true);

  useGSAP(
    () => {
      const skip = prefersReducedMotion() || window.sessionStorage.getItem(SESSION_KEY) === "1";
      if (skip) {
        setMounted(false);
        finish();
        return;
      }

      document.documentElement.classList.add("is-loading");
      const group = root.current!.querySelector<HTMLElement>("[data-group]")!;
      const char = root.current!.querySelector<HTMLElement>("[data-char]")!;

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
        // 1. The character walks in; the curtain edge follows the hands.
        .to(group, { x: 0, duration: 0.9, ease: "power2.out", delay: 0.2 })
        // 2. Straining: a little bounce before the push.
        .to(char, { rotate: -3, y: 4, duration: 0.18, ease: "power1.inOut", yoyo: true, repeat: 3, transformOrigin: "50% 100%" })
        // 3. The push: everything slides off to the right.
        .to(group, { x: () => window.innerWidth + CHARACTER_WIDTH, duration: 1.5 }, "push")
        .to(char, { rotate: -8, duration: 0.5, transformOrigin: "50% 100%" }, "push")
        .to(root.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
    },
    { scope: root },
  );

  if (!mounted) return null;

  return (
    <div ref={root} className="fixed inset-0 z-50 overflow-hidden bg-bg" aria-hidden>
      <div data-group className="absolute inset-y-0 left-0 flex" style={{ width: `calc(100vw + ${CHARACTER_WIDTH}px)` }}>
        <div className="relative flex shrink-0 items-center justify-end" style={{ width: CHARACTER_WIDTH }}>
          <div data-char className="w-[180px] translate-x-3 md:w-[200px]">
            <Character className="h-auto w-full" />
          </div>
        </div>
        <div className="h-full grow bg-ink" />
      </div>
    </div>
  );
}
