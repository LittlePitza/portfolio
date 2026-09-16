"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icons";
import type { HeadIcon } from "@/content/head";
import { Head } from "./Head";

export interface HeadItemView {
  icon: HeadIcon;
  title: string;
  story: string;
  signature: string;
}

interface Props {
  items: HeadItemView[];
  question: string;
  /** Shown while the head is closed. */
  hint: string;
  /** Shown while the head is open. */
  hintOpen: string;
  openLabel: string;
  close: string;
  left: { value: string; label: string };
  right: { value: string; label: string };
}

/** Wide screens: a big arc around a 390px head, clear of the speech bubble on its left. */
const WIDE_SPOTS = [
  { x: -235, y: -70, r: -18 },
  { x: -165, y: -200, r: -10 },
  { x: -80, y: -275, r: -4 },
  { x: 30, y: -295, r: 6 },
  { x: 140, y: -255, r: 10 },
  { x: 220, y: -160, r: 16 },
  { x: 245, y: -40, r: 20 },
];

/** Phones and tablets: an arc drawn for a 260px head, scaled to the real width, that stays inside the screen. */
const NARROW_SPOTS = [
  { x: -140, y: -130, r: -16 },
  { x: -121, y: -192, r: -8 },
  { x: -70, y: -236, r: -4 },
  { x: 0, y: -252, r: 5 },
  { x: 70, y: -236, r: 8 },
  { x: 121, y: -192, r: 12 },
  { x: 140, y: -130, r: 18 },
];
const NARROW_BASE = 260;

/**
 * A big illustrated head that opens only when you ask it to. Click or tap the
 * head (or the speech bubble) and the top of the skull lifts while the things
 * on his mind float out and the face lights up; it stays open until you click
 * again or press Escape. Each object tells its own story on a tilted card.
 * While closed, the head gives a little knock every few seconds so it reads
 * as something to press.
 */
export function InsideHead({ items, question, hint, hintOpen, openLabel, close, left, right }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const idle = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const [card, setCard] = useState<number | null>(null);

  const toggle = () => setOpen((o) => !o);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const d = (n: number) => (reduce ? 0 : n);
      const objects = gsap.utils.toArray<HTMLElement>("[data-object]");
      const box = root.current!.querySelector<HTMLElement>("[data-head-box]");
      const s = wide ? 1 : (box?.offsetWidth ?? NARROW_BASE) / NARROW_BASE;
      const spots = (wide ? WIDE_SPOTS : NARROW_SPOTS).map((p) => ({ x: p.x * s, y: p.y * s, r: p.r }));
      const startY = -40 * s;
      const face = { calm: "[data-eyes-calm], [data-mouth-calm]", lit: "[data-eyes-spark], [data-mouth-grin], [data-inside], [data-lines], [data-underside]" };

      idle.current?.kill();
      idle.current = null;

      if (open) {
        gsap.to("[data-lid]", { y: -118, x: -16, rotate: -12, duration: d(0.8), ease: "back.out(1.6)", transformOrigin: "30% 100%", overwrite: true });
        gsap.to(face.calm, { autoAlpha: 0, duration: d(0.2) });
        gsap.to(face.lit, { autoAlpha: 1, duration: d(0.35), delay: d(0.2) });
        gsap.to("[data-brows]", { y: -10, duration: d(0.5), ease: "back.out(2)", delay: d(0.15) });
        gsap.to("[data-arrow]", { autoAlpha: 0, y: 12, duration: d(0.25) });
        objects.forEach((el, i) => {
          const spot = spots[i % spots.length]!;
          gsap.killTweensOf(el);
          gsap.fromTo(
            el,
            { x: 0, y: startY, scale: 0.2, rotate: 0, autoAlpha: 0 },
            {
              x: spot.x,
              y: spot.y,
              scale: 1,
              rotate: spot.r,
              autoAlpha: 1,
              duration: d(1),
              delay: d(0.12 + 0.06 * i),
              ease: "back.out(1.5)",
              onComplete: () => {
                if (!reduce) gsap.to(el, { y: spot.y - 10 * s, rotate: spot.r + 3, duration: 1.8 + (i % 3) * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1 });
              },
            },
          );
        });
      } else {
        gsap.to("[data-lid]", { y: 0, x: 0, rotate: 0, duration: d(0.55), ease: "power3.inOut", transformOrigin: "30% 100%", overwrite: true });
        gsap.to(face.lit, { autoAlpha: 0, duration: d(0.2) });
        gsap.to(face.calm, { autoAlpha: 1, duration: d(0.3), delay: d(0.2) });
        gsap.to("[data-brows]", { y: 0, duration: d(0.4), ease: "power3.inOut" });
        gsap.to("[data-arrow]", { autoAlpha: 1, y: 0, duration: d(0.4), delay: d(0.3) });
        objects.forEach((el) => {
          gsap.killTweensOf(el);
          gsap.to(el, { x: 0, y: startY, scale: 0.2, autoAlpha: 0, duration: d(0.4), ease: "power3.in" });
        });
        // A little knock now and then, so the head reads as something to press.
        if (!reduce) {
          idle.current = gsap
            .timeline({ repeat: -1, repeatDelay: 2.8, delay: 1.8 })
            .to("[data-lid]", { y: -12, rotate: -4, duration: 0.14, ease: "power2.out", transformOrigin: "30% 100%" })
            .to("[data-lid]", { y: 0, rotate: 0, duration: 0.6, ease: "bounce.out", transformOrigin: "30% 100%" });
        }
      }
    },
    { scope: root, dependencies: [open, wide] },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (card !== null) setCard(null);
      else if (open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, open]);

  const current = card !== null ? items[card] : null;
  const switchLabel = open ? close : openLabel;

  return (
    <div ref={root} className="relative grid grid-cols-1 items-center gap-12 overflow-hidden px-4 py-16 md:min-h-[90svh] md:grid-cols-[1fr_auto_1fr] md:px-6 md:py-28">
      {/* Left figure */}
      <div className="hidden md:block md:self-end">
        <p className="display outline text-[14vw] leading-[0.8]">{left.value}</p>
        <p className="label mt-3 text-muted">{left.label}</p>
      </div>

      {/* The head */}
      <div className="relative mx-auto flex flex-col items-center">
        <button
          type="button"
          className="brutal relative z-10 w-full max-w-[20rem] -rotate-2 bg-ink px-5 py-4 text-left text-bg lg:absolute lg:-left-72 lg:-top-6 lg:w-max lg:max-w-[17rem]"
          onClick={toggle}
          aria-expanded={open}
          data-cursor={switchLabel}
        >
          <span className="display block text-3xl">{question}</span>
          <span className="label mt-2 block text-bg/60">{open ? hintOpen : hint}</span>
        </button>

        <div data-head-box className="relative mt-36 h-[322px] w-[260px] md:mt-40 md:h-[372px] md:w-[300px] lg:mt-8 lg:h-[480px] lg:w-[390px]">
          {/* Hand-drawn arrow from the bubble to the head, on phones and tablets */}
          <svg
            data-arrow
            viewBox="0 0 60 110"
            className="pointer-events-none absolute -top-32 left-1/2 h-28 w-14 -translate-x-1/2 md:-top-36 lg:hidden"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M22 6 C44 24 8 44 30 62 C44 74 34 88 30 100" />
            <path d="M18 88 L30 102 L42 90" />
          </svg>

          <Head className="absolute inset-0 h-full w-full" />

          {/* The head itself is the switch */}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label={switchLabel}
            data-cursor={switchLabel}
            className="absolute inset-x-[14%] bottom-0 top-[4%] rounded-[45%]"
            style={{ zIndex: 1 }}
          />

          {/* Objects, start hidden inside the head */}
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              data-object
              data-cursor={item.title}
              onClick={() => setCard(i)}
              aria-label={item.title}
              tabIndex={open ? 0 : -1}
              className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-[3px] border-ink bg-paper text-ink opacity-0 shadow-[4px_4px_0_var(--ink)] transition-colors hover:bg-accent md:h-[60px] md:w-[60px] lg:h-[76px] lg:w-[76px] lg:rounded-2xl lg:shadow-[5px_5px_0_var(--ink)]"
              style={{ zIndex: 5 }}
            >
              <Icon name={item.icon} className="h-8 w-8 md:h-9 md:w-9 lg:h-11 lg:w-11 [&_*]:stroke-[3]" />
            </button>
          ))}
        </div>
      </div>

      {/* Right figure */}
      <div className="hidden text-right md:block md:self-end">
        <p className="display outline text-[14vw] leading-[0.8]">{right.value}</p>
        <p className="label mt-3 text-muted">{right.label}</p>
      </div>

      {/* Mobile figures */}
      <div className="flex justify-between gap-6 md:hidden">
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
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-accent shadow-[5px_5px_0_var(--ink)]">
                <Icon name={current.icon} className="h-12 w-12 [&_*]:stroke-[3]" />
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
