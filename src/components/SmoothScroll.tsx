"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import "lenis/dist/lenis.css";

/** Native scrolling on touch; enhanced scrolling only where it adds value. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let generation = 0;
    let dispose: (() => void) | undefined;

    const sync = () => {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;

      // Touch and reduced-motion visitors never download the scroll controller.
      void import("lenis").then(({ default: Lenis }) => {
        if (current !== generation) return;
        const lenis = new Lenis({
          autoRaf: false,
          lerp: 0.12,
          syncTouch: false,
          stopInertiaOnNavigate: true,
          prevent: (node) => node.getAttribute("role") === "dialog",
        });
        setLenis(lenis);
        lenis.on("scroll", ScrollTrigger.update);

        const tick = (time: number) => lenis.raf(time * 1000);
        const syncVisibility = () => {
          gsap.ticker.remove(tick);
          if (!document.hidden) {
            lenis.resize();
            gsap.ticker.add(tick);
          }
        };
        const syncLock = () => {
          const locked = document.documentElement.classList.contains("is-loading") ||
            document.documentElement.style.overflow === "hidden" || document.body.style.overflow === "hidden";
          if (locked && !lenis.isStopped) lenis.stop();
          else if (!locked && lenis.isStopped) lenis.start();
        };
        const lockObserver = new MutationObserver(syncLock);
        lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
        lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
        document.addEventListener("visibilitychange", syncVisibility);
        gsap.ticker.lagSmoothing(0);
        syncLock();
        syncVisibility();

        dispose = () => {
          lockObserver.disconnect();
          document.removeEventListener("visibilitychange", syncVisibility);
          gsap.ticker.remove(tick);
          lenis.off("scroll", ScrollTrigger.update);
          lenis.destroy();
          setLenis(null);
        };
      }).catch(() => {
        // Native scrolling remains fully usable if the optional chunk fails.
      });
    };

    sync();
    media.addEventListener("change", sync);
    return () => {
      generation++;
      media.removeEventListener("change", sync);
      dispose?.();
    };
  }, []);

  return <>{children}</>;
}
