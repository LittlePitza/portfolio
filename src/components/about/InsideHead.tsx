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
  hint: string;
  close: string;
  left: { value: string; label: string };
  right: { value: string; label: string };
}

/** Where each object settles once it has floated out, relative to the head's centre. */
const SPOTS = [
  { x: -240, y: -60, r: -24 },
  { x: -160, y: -205, r: -16 },
  { x: -120, y: -245, r: -8 },
  { x: -20, y: -280, r: 6 },
  { x: 85, y: -262, r: 12 },
  { x: 175, y: -200, r: 18 },
  { x: 232, y: -100, r: 22 },
  { x: 236, y: 0, r: 10 },
  { x: -110, y: -120, r: -6 },
  { x: 110, y: -110, r: 5 },
];

/**
 * A big illustrated head. Hover (or tap) and the top of the skull lifts with
 * the cap while the objects that occupy his mind float out and the face
 * lights up. Click one and it tells its own story on a tilted card.
 */
export function InsideHead({ items, question, hint, close, left, right }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState<number | null>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const d = (n: number) => (reduce ? 0 : n);
      const objects = gsap.utils.toArray<HTMLElement>("[data-object]");
      const face = { calm: "[data-eyes-calm], [data-mouth-calm]", lit: "[data-eyes-spark], [data-mouth-grin], [data-inside], [data-lines], [data-underside]" };

      if (open) {
        gsap.to("[data-lid]", { y: -118, x: -16, rotate: -12, duration: d(0.8), ease: "back.out(1.6)", transformOrigin: "30% 100%" });
        gsap.to(face.calm, { autoAlpha: 0, duration: d(0.2) });
        gsap.to(face.lit, { autoAlpha: 1, duration: d(0.35), delay: d(0.2) });
        gsap.to("[data-brows]", { y: -10, duration: d(0.5), ease: "back.out(2)", delay: d(0.15) });
        objects.forEach((el, i) => {
          const spot = SPOTS[i % SPOTS.length]!;
          gsap.killTweensOf(el);
          gsap.fromTo(
            el,
            { x: 0, y: -40, scale: 0.2, rotate: 0, autoAlpha: 0 },
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
                if (!reduce) gsap.to(el, { y: spot.y - 12, rotate: spot.r + 3, duration: 1.8 + (i % 3) * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1 });
              },
            },
          );
        });
      } else {
        gsap.to("[data-lid]", { y: 0, x: 0, rotate: 0, duration: d(0.55), ease: "power3.inOut", transformOrigin: "30% 100%" });
        gsap.to(face.lit, { autoAlpha: 0, duration: d(0.2) });
        gsap.to(face.calm, { autoAlpha: 1, duration: d(0.3), delay: d(0.2) });
        gsap.to("[data-brows]", { y: 0, duration: d(0.4), ease: "power3.inOut" });
        objects.forEach((el) => {
          gsap.killTweensOf(el);
          gsap.to(el, { x: 0, y: -40, scale: 0.2, autoAlpha: 0, duration: d(0.4), ease: "power3.in" });
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
    <div ref={root} className="relative grid min-h-[90svh] grid-cols-1 items-center gap-8 overflow-hidden px-4 py-20 md:grid-cols-[1fr_auto_1fr] md:px-6 md:py-28">
      {/* Left figure */}
      <div className="hidden md:block md:self-end">
        <p className="display outline text-[14vw] leading-[0.8]">{left.value}</p>
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
          className="brutal absolute -top-24 left-1/2 z-10 w-max max-w-[17rem] -translate-x-1/2 -rotate-2 bg-ink px-5 py-4 text-left text-bg lg:-left-72 lg:-top-6 lg:translate-x-0"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          data-cursor="?"
        >
          <span className="display block text-2xl md:text-3xl">{question}</span>
          <span className="label mt-2 block text-bg/60">{hint}</span>
        </button>

        <div className="relative mt-24 h-[380px] w-[310px] md:mt-8 md:h-[480px] md:w-[390px]">
          {/* Objects, start hidden inside the head */}
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              data-object
              data-cursor={item.title}
              onClick={() => setCard(i)}
              aria-label={item.title}
              className="absolute left-1/2 top-1/2 flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-[3px] border-ink bg-paper text-ink opacity-0 shadow-[5px_5px_0_var(--ink)] transition-colors hover:bg-accent"
              style={{ zIndex: 5 }}
            >
              <Icon name={item.icon} className="h-11 w-11 [&_*]:stroke-[3]" />
            </button>
          ))}

          <Head className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      {/* Right figure */}
      <div className="hidden text-right md:block md:self-end">
        <p className="display outline text-[14vw] leading-[0.8]">{right.value}</p>
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
