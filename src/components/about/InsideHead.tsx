"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icons";
import type { HeadIcon } from "@/content/head";

export interface HeadItemView {
  icon: HeadIcon;
  title: string;
  story: string;
  signature: string;
}

interface Props {
  items: HeadItemView[];
  question: string;
  hint: string;
  close: string;
  left: { value: string; label: string };
  right: { value: string; label: string };
}

/** Where each object settles once it has floated out, relative to the head's centre. */
const SPOTS = [
  { x: -160, y: -150, r: -14 },
  { x: -50, y: -215, r: 6 },
  { x: 80, y: -205, r: 12 },
  { x: 190, y: -120, r: 18 },
  { x: -215, y: -40, r: -22 },
  { x: 175, y: -10, r: 9 },
  { x: -100, y: -90, r: -6 },
  { x: 40, y: -120, r: 4 },
];

/**
 * A big head with a cap. Hover (or tap) and the cap lifts while the objects
 * that occupy his mind float out. Click one and it tells its own story on a
 * tilted card. Two giant figures flank the scene.
 */
export function InsideHead({ items, question, hint, close, left, right }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState<number | null>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const cap = "[data-cap]";
      const objects = gsap.utils.toArray<HTMLElement>("[data-object]");
      if (open) {
        gsap.to(cap, { y: -56, rotate: -10, x: -12, duration: reduce ? 0 : 0.7, ease: "back.out(1.8)", transformOrigin: "20% 100%" });
        objects.forEach((el, i) => {
          const spot = SPOTS[i % SPOTS.length]!;
          gsap.killTweensOf(el);
          gsap.fromTo(
            el,
            { x: 0, y: 0, scale: 0.2, rotate: 0, autoAlpha: 0 },
            { x: spot.x, y: spot.y, scale: 1, rotate: spot.r, autoAlpha: 1, duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.05 * i, ease: "back.out(1.4)",
              onComplete: () => {
                if (!reduce) gsap.to(el, { y: spot.y - 10, duration: 1.6 + (i % 3) * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
              } },
          );
        });
      } else {
        gsap.to(cap, { y: 0, rotate: 0, x: 0, duration: reduce ? 0 : 0.5, ease: "power3.inOut", transformOrigin: "20% 100%" });
        objects.forEach((el) => {
          gsap.killTweensOf(el);
          gsap.to(el, { x: 0, y: 0, scale: 0.2, autoAlpha: 0, duration: reduce ? 0 : 0.4, ease: "power3.in" });
        });
      }
    },
    { scope: root, dependencies: [open] },
  );

  useEffect(() => {
    if (card === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCard(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card]);

  const current = card !== null ? items[card] : null;

  return (
    <div ref={root} className="relative grid min-h-[80svh] grid-cols-1 items-center gap-8 overflow-hidden px-4 py-16 md:grid-cols-[1fr_auto_1fr] md:px-6">
      {/* Left figure */}
      <div className="hidden md:block">
        <p className="display outline text-[15vw] leading-[0.8]">{left.value}</p>
        <p className="label mt-3 text-muted">{left.label}</p>
      </div>

      {/* The head */}
      <div
        className="relative mx-auto flex flex-col items-center"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          if (card === null) setOpen(false);
        }}
      >
        <button
          type="button"
          className="brutal absolute -top-20 left-1/2 z-10 w-max max-w-[17rem] -translate-x-1/2 -rotate-2 bg-ink px-5 py-4 text-left text-bg lg:-left-72 lg:top-10 lg:translate-x-0"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          data-cursor="?"
        >
          <span className="display block text-2xl md:text-3xl">{question}</span>
          <span className="label mt-2 block text-bg/60">{hint}</span>
        </button>

        <div className="relative mt-16 h-[320px] w-[280px] md:mt-0">
          {/* Objects, start hidden at the centre of the head */}
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              data-object
              data-cursor={item.title}
              onClick={() => setCard(i)}
              aria-label={item.title}
              className="brutal absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-paper text-ink opacity-0 transition-colors hover:bg-accent"
              style={{ zIndex: 5 }}
            >
              <Icon name={item.icon} className="h-9 w-9" />
            </button>
          ))}

          {/* Head */}
          <svg viewBox="0 0 280 320" className="absolute inset-0 h-full w-full" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {/* neck and shoulders */}
            <path d="M110 250v30M170 250v30" />
            <path d="M40 320c10-30 40-40 100-40s90 10 100 40" fill="var(--accent)" />
            {/* face */}
            <path d="M70 150c0-70 30-100 70-100s70 30 70 100c0 55-30 100-70 100s-70-45-70-100z" fill="var(--bg)" />
            {/* ears */}
            <path d="M70 160c-12-4-18 6-14 16s12 12 18 8M210 160c12-4 18 6 14 16s-12 12-18 8" fill="var(--bg)" />
            {/* glasses */}
            <rect x="88" y="150" width="40" height="30" rx="4" />
            <rect x="152" y="150" width="40" height="30" rx="4" />
            <path d="M128 162h24M70 160l18-6M210 160l-18-6" />
            <circle cx="108" cy="165" r="3" fill="var(--ink)" />
            <circle cx="172" cy="165" r="3" fill="var(--ink)" />
            {/* nose and mouth */}
            <path d="M140 172v18l-8 4" />
            <path d="M118 212c10 10 34 10 44 0" />
            {/* hair sides */}
            <path d="M70 140c0-20 5-40 20-52M210 140c0-20-5-40-20-52" strokeWidth="6" />
            {/* cap, its own group so it can lift */}
            <g data-cap>
              <path d="M62 110c0-45 35-78 78-78s78 33 78 78v6H62z" fill="var(--ink)" />
              <path d="M56 116h180l30 12H40z" fill="var(--ink)" />
              <path d="M140 32v84" stroke="var(--bg)" strokeWidth="3" />
              <circle cx="140" cy="30" r="6" fill="var(--accent)" stroke="none" />
            </g>
          </svg>
        </div>
      </div>

      {/* Right figure */}
      <div className="hidden text-right md:block">
        <p className="display outline text-[15vw] leading-[0.8]">{right.value}</p>
        <p className="label mt-3 text-muted">{right.label}</p>
      </div>

      {/* Mobile figures */}
      <div className="flex justify-between md:hidden">
        <div>
          <p className="display outline text-6xl">{left.value}</p>
          <p className="label mt-2 text-muted">{left.label}</p>
        </div>
        <div className="text-right">
          <p className="display outline text-6xl">{right.value}</p>
          <p className="label mt-2 text-muted">{right.label}</p>
        </div>
      </div>

      {/* Story card */}
      {current && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={current.title}>
          <button type="button" className="absolute inset-0 bg-bg/70" aria-label={close} onClick={() => setCard(null)} />
          <div className="brutal relative w-full max-w-md -rotate-2 bg-paper p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="brutal flex h-20 w-20 shrink-0 items-center justify-center bg-accent">
                <Icon name={current.icon} className="h-12 w-12" />
              </div>
              <button type="button" className="btn btn-square" onClick={() => setCard(null)} aria-label={close}>
                ×
              </button>
            </div>
            <h3 className="display mt-6 text-4xl">{current.title}</h3>
            <p className="mt-4 text-sm leading-relaxed">{current.story}</p>
            <p className="label mt-5 text-muted">— {current.signature}</p>
          </div>
        </div>
      )}
    </div>
  );
}
