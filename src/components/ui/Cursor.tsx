"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * A small orange dot that follows the pointer and grows into a labelled disc
 * over anything marked `data-cursor="Label"`. Fine pointers only; never on
 * touch devices or under reduced motion, where the native cursor stays.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const el = dot.current!;
    document.documentElement.classList.add("has-cursor");

    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
      }
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button");
      setLabel(target?.dataset.cursor ?? null);
      setActive(!!target);
    };
    const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    const onEnter = () => gsap.to(el, { autoAlpha: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  const size = label ? 84 : active ? 28 : 12;

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center rounded-full mix-blend-difference"
      style={{
        width: size,
        height: size,
        background: "#fff",
        transition: "width 0.25s var(--ease-out-expo), height 0.25s var(--ease-out-expo)",
      }}
    >
      {label && <span className="label text-[0.6rem] text-black">{label}</span>}
    </div>
  );
}
