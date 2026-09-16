"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import { Character } from "@/components/preloader/Character";
import { usePreloader } from "@/components/preloader/PreloaderContext";

interface Props {
  eyebrow: string;
  tagline: string;
  sub: string;
}

/** Giant serif name in the accent colour, with the character resting against its edge. */
export function Hero({ eyebrow, tagline, sub }: Props) {
  const root = useRef<HTMLElement>(null);
  const { done } = usePreloader();

  useGSAP(
    () => {
      if (!done) return;
      if (prefersReducedMotion()) {
        gsap.set("[data-line], [data-fade]", { clearProps: "all" });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-line]", { yPercent: 110, duration: 1.2, stagger: 0.08 })
        .from("[data-char]", { x: -60, autoAlpha: 0, duration: 0.9 }, "-=0.9")
        .from("[data-fade]", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.7");
    },
    { scope: root, dependencies: [done] },
  );

  return (
    <section ref={root} className="relative flex min-h-svh flex-col justify-center px-4 pb-24 pt-32 md:px-6" aria-label={site.fullName}>
      <div className="mx-auto flex w-full max-w-[1600px] items-end justify-center gap-2 md:gap-6">
        <h1 className="display text-accent" style={{ fontSize: "clamp(4.5rem, 19vw, 21rem)" }}>
          {site.heroName.map((line) => (
            <span key={line} className="-mt-[0.14em] block overflow-hidden pb-[0.06em] pt-[0.14em]">
              <span data-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>
        <div data-char className="mb-1 hidden w-[9vw] max-w-[150px] shrink-0 md:block" style={{ visibility: done ? undefined : "hidden" }}>
          <Character className="h-auto w-full" />
        </div>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-[1600px] gap-4 md:mt-14 md:grid-cols-12">
        <p data-fade className="label text-muted md:col-span-3">
          {eyebrow}
        </p>
        <p data-fade className="font-display text-2xl leading-tight md:col-span-5 md:text-4xl">
          {tagline}
        </p>
        <p data-fade className="max-w-md text-sm leading-relaxed text-muted md:col-span-4">
          {sub}
        </p>
      </div>
    </section>
  );
}
