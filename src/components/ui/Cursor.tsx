"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** A pointer companion that yields immediately to touch, keyboard and reduced motion. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = dot.current;
    const caption = text.current;
    if (!el || !caption) return;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const x = gsap.quickTo(el, "x", { duration: 0.2, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.2, ease: "power3.out" });
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      let shown = false;
      let currentTarget: Element | null = null;
      let activeDialog: HTMLDialogElement | null = null;

      const hide = () => {
        shown = false;
        document.documentElement.classList.remove("has-cursor");
        gsap.set(el, { autoAlpha: 0 });
      };
      const syncDialog = () => {
        activeDialog = document.querySelector<HTMLDialogElement>("dialog[open]");
        // Native dialogs occupy the top layer, above any z-index on this dot.
        if (activeDialog) hide();
      };
      const dialogObserver = new MutationObserver(syncDialog);
      dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
      syncDialog();

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        if (activeDialog?.isConnected && activeDialog.open) return;
        if (!shown) {
          shown = true;
          gsap.set(el, { x: event.clientX, y: event.clientY, autoAlpha: 1 });
          document.documentElement.classList.add("has-cursor");
        }
        x(event.clientX);
        y(event.clientY);
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-cursor], a, button") : null;
        if (target === currentTarget) return;
        currentTarget = target;
        const label = target?.dataset.cursor ?? "";
        caption.textContent = label;
        const size = label ? 82 : target ? 28 : 10;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") hide();
      };
      const onOut = (event: PointerEvent) => {
        if (!event.relatedTarget) hide();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerout", onOut);
      window.addEventListener("blur", hide);
      window.addEventListener("keydown", onKeyDown);
      return () => {
        dialogObserver.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerout", onOut);
        window.removeEventListener("blur", hide);
        window.removeEventListener("keydown", onKeyDown);
        document.documentElement.classList.remove("has-cursor");
        x.tween.kill();
        y.tween.kill();
      };
    });
    return () => media.revert();
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full mix-blend-difference"
      style={{
        width: 10,
        height: 10,
        opacity: 0,
        visibility: "hidden",
        background: "#fff",
        transition: "width 0.25s var(--ease-out-expo), height 0.25s var(--ease-out-expo)",
      }}
    >
      <span ref={text} className="label text-[0.6rem] text-black" />
    </div>
  );
}
