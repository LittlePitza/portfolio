"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Cover } from "./Cover";
import type { Slide, WorkLabels } from "./types";

const ITEM_H = 168; // px, height of one item in the right-hand wheel

interface Props {
  slides: Slide[];
  labels: WorkLabels;
}

/**
 * Desktop: a pinned, scroll-driven stage in the spirit of huyml.co. The scroll
 * position selects the active project; GSAP animates covers, the metadata
 * columns and the vertical wheel between states. Below `lg` and for reduced
 * motion the same data renders as a plain vertical list.
 */
export function WorkCarousel({ slides, labels }: Props) {
  return (
    <>
      <Stage slides={slides} labels={labels} />
      <List slides={slides} labels={labels} />
    </>
  );
}

function Stage({ slides, labels }: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const n = slides.length;
  const slide = slides[active]!;

  // Scroll → active index.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!desktop || !motion) return;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${(n - 1) * 100}%`,
          pin: true,
          anticipatePin: 1,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, ease: "power2.inOut" },
          onUpdate: (self) => {
            const i = Math.min(n - 1, Math.max(0, Math.round(self.progress * (n - 1))));
            setActive((prev) => (prev === i ? prev : i));
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Active index → animated state.
  useGSAP(
    () => {
      const covers = gsap.utils.toArray<HTMLElement>("[data-cover]");
      covers.forEach((el, i) => {
        const dir = i < active ? -1 : 1;
        gsap.to(el, {
          autoAlpha: i === active ? 1 : 0,
          y: i === active ? 0 : dir * 40,
          rotate: i === active ? 0 : dir * 4,
          scale: i === active ? 1 : 0.94,
          duration: 0.8,
          ease: "expo.out",
          overwrite: true,
        });
      });
      gsap.to("[data-wheel]", { y: -active * ITEM_H, duration: 0.8, ease: "expo.out", overwrite: true });
      gsap.utils.toArray<HTMLElement>("[data-wheel-item]").forEach((el, i) => {
        gsap.to(el, { opacity: i === active ? 1 : 0.22, duration: 0.5, overwrite: true });
      });
      gsap.fromTo("[data-meta]", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: "expo.out", overwrite: true });
      gsap.fromTo("[data-counter]", { yPercent: 35, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out", overwrite: true });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section ref={root} className="relative hidden h-svh overflow-hidden lg:block" aria-label={labels.selected}>
      {/* Fan of the other covers, top-right (upcoming) and bottom-left (previous). */}
      {slides.map((s, i) => {
        const offset = (i - active + n) % n;
        if (offset === 0) return null;
        const ahead = offset <= Math.floor((n - 1) / 2) + (n % 2 === 0 ? 1 : 0);
        const k = ahead ? offset : n - offset;
        const style: React.CSSProperties = ahead
          ? { top: `${-6 + k * 1.5}vh`, right: `${-4 + k * 5}vw`, transform: `rotate(${-8 - k * 6}deg)`, zIndex: 10 - k }
          : { bottom: `${-8 + k * 1.5}vh`, left: `${-6 + k * 5}vw`, transform: `rotate(${8 + k * 6}deg)`, zIndex: 10 - k };
        return (
          <div key={s.slug} className="pointer-events-none absolute w-[20vw] transition-all duration-700 ease-[var(--ease-out-expo)]" style={style} aria-hidden>
            <Cover slide={s} index={i} sizes="20vw" className="aspect-[4/3] opacity-90" />
          </div>
        );
      })}

      {/* Left column: metadata */}
      <div className="absolute left-6 top-[38%] w-[22vw] max-w-xs space-y-5">
        <Row label={labels.role} lines={slide.role} />
        <Row label={labels.stack} lines={slide.stack} />
        <Row label={labels.launch} lines={[slide.launch, slide.status]} />
        <Row label={labels.numbers} lines={slide.numbers.map((m) => `${m.value} ${m.label}`)} />
      </div>

      {/* Centre: covers stacked, one visible */}
      <div className="absolute left-1/2 top-1/2 aspect-[4/3] w-[38vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2">
        {slides.map((s, i) => (
          <Link key={s.slug} href={s.href} data-cover className="absolute inset-0 block" tabIndex={i === active ? 0 : -1} aria-label={`${s.name}: ${labels.view}`}>
            <Cover slide={s} index={i} priority={i === 0} className="h-full w-full" />
          </Link>
        ))}
      </div>

      {/* Right column: the wheel */}
      <div
        className="absolute right-6 top-1/2 w-[24vw] max-w-sm -translate-y-1/2 overflow-hidden"
        style={{ height: ITEM_H * 3, maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)" }}
      >
        <ul data-wheel style={{ paddingTop: ITEM_H }}>
          {slides.map((s, i) => (
            <li key={s.slug} data-wheel-item className="flex flex-col justify-center text-center" style={{ height: ITEM_H }}>
              <p className="label text-muted">{s.category}</p>
              <Link href={s.href} className="display mt-1 text-3xl" tabIndex={i === active ? 0 : -1}>
                {s.name}
              </Link>
              <p className="mx-auto mt-2 max-w-[28ch] text-xs leading-relaxed text-muted">{s.summary}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Swatch */}
      <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-1.5" aria-hidden>
        {slides.map((s, i) => (
          <span key={s.slug} className="h-2 w-2 rounded-full transition-opacity duration-500" style={{ background: s.color, opacity: i === active ? 1 : 0.25 }} />
        ))}
      </div>

      {/* Bottom-left: counter */}
      <div className="absolute bottom-16 left-6 flex items-start gap-3">
        <p className="label text-muted">{labels.selected}</p>
        <div className="flex items-start">
          <span className="display overflow-hidden text-[9vw] leading-[0.8]">
            <span data-counter className="block">
              {String(active + 1).padStart(2, "0")}
            </span>
          </span>
          <span className="label mt-3 text-muted">/{String(n).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}

function Row({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div data-meta className="grid grid-cols-[5.5rem_1fr] gap-3">
      <p className="label text-muted">{label}</p>
      <ul className="label space-y-0.5">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

/** Plain stacked version for small screens and reduced motion. */
function List({ slides, labels }: Props) {
  return (
    <section className="px-4 pb-24 pt-8 lg:hidden motion-reduce:lg:block" aria-label={labels.selected}>
      <p className="label mb-6 text-muted">{labels.selected}</p>
      <ul className="space-y-14">
        {slides.map((s, i) => (
          <li key={s.slug}>
            <Link href={s.href} className="block">
              <Cover slide={s} index={i} sizes="100vw" className="aspect-[4/3] w-full" />
            </Link>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <p className="label text-muted">{s.category}</p>
              <p className="label text-muted">
                {String(i + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
              </p>
            </div>
            <Link href={s.href} className="display mt-1 block text-4xl">
              {s.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.summary}</p>
            <ul className="label mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {s.numbers.map((m) => (
                <li key={m.label}>
                  <span className="text-ink">{m.value}</span> <span className="text-muted">{m.label}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
