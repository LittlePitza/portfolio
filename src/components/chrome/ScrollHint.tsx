"use client";

import { useEffect, useRef } from "react";

/** Retires the invitation once the visitor has started exploring. */
export function ScrollHint({ label }: { label: string }) {
  const hint = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let wasHidden: boolean | undefined;
    const update = () => {
      const hidden = window.scrollY > 100;
      if (hint.current && hidden !== wasHidden) hint.current.style.opacity = hidden ? "0" : "1";
      wasHidden = hidden;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <p ref={hint} className="label text-muted transition-opacity duration-300" data-scroll-hint aria-hidden>{label} <span>↓</span></p>;
}
