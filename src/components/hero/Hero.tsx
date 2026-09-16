"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { site } from "@/content/site";
import { Character } from "@/components/preloader/Character";
import { usePreloader } from "@/components/preloader/PreloaderContext";
import { openContact } from "@/components/chrome/ContactOverlay";

interface Props {
  eyebrow: string;
  tagline: string;
  sub: string;
  ctaWork: string;
  ctaContact: string;
  stamp: string;
  contactHref: string;
}

/** Giant serif name in the accent colour, the character resting against its edge, and two clear ways forward. */
export function Hero({ eyebrow, tagline, sub, ctaWork, ctaContact, stamp, contactHref }: Props) {
  const root = useRef<HTMLElement>(null);
  const { done } = usePreloader();

  useGSAP(
    () => {
      if (!done) return;
      if (prefersReducedMotion()) {
        gsap.set("[data-line], [data-fade], [data-char]", { clearProps: "all" });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-line]", { yPercent: 110, duration: 1.2, stagger: 0.08 })
        .from("[data-char]", { x: -60, autoAlpha: 0, duration: 0.9 }, "-=0.9")
        .from("[data-fade]", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
        .from("[data-stamp]", { scale: 1.6, autoAlpha: 0, rotate: 8, duration: 0.5, ease: "back.out(2)" }, "-=0.4");

      // Idle: the character breathes against the name.
      gsap.to("[data-char] svg", { y: -4, rotate: -1.5, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%", delay: 1.5 });
    },
    { scope: root, dependencies: [done] },
  );

  return (
    <section ref={root} className="relative flex min-h-svh flex-col justify-center px-4 pb-24 pt-32 md:px-6" aria-label={site.fullName}>
      <div className="mx-auto flex w-full max-w-[1600px] items-end justify-center gap-2 md:gap-6">
        {/* Sized to leave room for the character beside it, so "HERNÁNDEZ" never breaks onto two lines. */}
        <h1 className="display text-accent" style={{ fontSize: "clamp(4.5rem, min(19vw, calc(20.7vw - 20px)), 21rem)" }}>
          {site.heroName.map((line) => (
            <span key={line} className="-mt-[0.14em] block overflow-hidden whitespace-nowrap pb-[0.06em] pt-[0.14em]">
              <span data-line className="block">
                {Array.from(line).map((ch, i) => (
                  <span key={i} className="inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-[0.06em] hover:text-ink">
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <div data-char className="mb-1 hidden w-[11vw] max-w-[190px] shrink-0 md:block" style={{ visibility: done ? undefined : "hidden" }}>
          <Character className="h-auto w-full" />
        </div>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-[1600px] gap-6 md:mt-14 md:grid-cols-12 md:gap-4">
        <div data-fade className="md:col-span-3">
          <p className="label text-muted">{eyebrow}</p>
          <span data-stamp className="stamp mt-4 text-accent">
            {stamp}
          </span>
        </div>
        <p data-fade className="font-display text-3xl leading-tight md:col-span-5 md:text-4xl lg:text-5xl">
          {tagline}
        </p>
        <div className="md:col-span-4">
          <p data-fade className="max-w-md text-sm leading-relaxed text-muted">
            {sub}
          </p>
          <div data-fade className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => {
                const el = document.getElementById("work");
                if (el) scrollTo(el);
              }}
            >
              {ctaWork} <span aria-hidden>↓</span>
            </button>
            <Link
              href={contactHref}
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                openContact();
              }}
            >
              {ctaContact} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
