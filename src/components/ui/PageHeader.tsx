"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Full-bleed black opener with a giant serif title that slides up on load. */
export function PageHeader({ title, kicker, children }: { title: string; kicker?: string; children?: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("[data-title]", { yPercent: 110, duration: 1.1 })
        .from("[data-kicker], [data-body] > *", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.6");
    },
    { scope: root },
  );

  return (
    <header ref={root} className="flex min-h-[70svh] flex-col justify-end bg-ink px-4 pb-10 pt-32 text-bg md:px-6 md:pb-14">
      {kicker && (
        <p data-kicker className="label mb-4 text-bg/60">
          {kicker}
        </p>
      )}
      <h1 className="display -mt-[0.14em] overflow-hidden pt-[0.14em] text-[clamp(3.5rem,14vw,14rem)]">
        <span data-title className="block">
          {title}
        </span>
      </h1>
      <div data-body>{children}</div>
    </header>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="label mb-8 flex items-center gap-3 text-muted">
      <span aria-hidden className="h-2 w-2 bg-accent" />
      {children}
    </h2>
  );
}
