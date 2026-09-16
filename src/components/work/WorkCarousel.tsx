"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { Cover } from "./Cover";
import { TransitionLink } from "@/components/chrome/PageTransition";
import type { Slide, WorkLabels } from "./types";

const ITEM_H = 168; // px, height of one item in the right-hand wheel

interface Props {
  slides: Slide[];
  labels: WorkLabels;
}

/**
 * Desktop: a pinned, scroll-driven stage. Scroll, arrow keys, the buttons or a
 * click on the wheel select the active project; GSAP animates covers, metadata
 * and the wheel between states, and a progress bar shows where you are. Below
 * `lg` and for reduced motion the same data renders as a plain vertical list.
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
  const trigger = useRef<ScrollTrigger | null>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = slides.length;
  const slide = slides[active]!;

  const goTo = useCallback(
    (i: number) => {
      const st = trigger.current;
      if (!st) return;
      const clamped = Math.min(n - 1, Math.max(0, i));
      scrollTo(st.start + ((st.end - st.start) * clamped) / (n - 1));
    },
    [n],
  );

  // Scroll → active index.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!desktop || !motion) return;
        trigger.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${(n - 1) * 100}%`,
          pin: true,
          anticipatePin: 1,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, ease: "power2.inOut" },
          onUpdate: (self) => {
            const i = Math.min(n - 1, Math.max(0, Math.round(self.progress * (n - 1))));
            setActive((prev) => (prev === i ? prev : i));
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
          },
        });
        return () => {
          trigger.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Keyboard while the stage is pinned.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = trigger.current;
      if (!st || !st.isActive) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goTo(active + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

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
    <section ref={root} className="relative hidden h-svh overflow-hidden lg:block" aria-label={labels.selected} aria-roledescription="carousel">
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
            <Cover slide={s} index={i} sizes="20vw" brutal={false} className="aspect-[4/3] border-2 border-ink opacity-90" />
          </div>
        );
      })}

      {/* Left column: metadata */}
      <div className="absolute left-6 top-[36%] w-[22vw] max-w-xs space-y-5">
        <Row label={labels.role} lines={slide.role} />
        <Row label={labels.stack} lines={slide.stack} />
        <Row label={labels.launch} lines={[slide.launch, slide.status]} />
        <Row label={labels.numbers} lines={slide.numbers.map((m) => `${m.value} ${m.label}`)} />
      </div>

      {/* Centre: covers stacked, one visible */}
      <div className="absolute left-1/2 top-1/2 aspect-[4/3] w-[38vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2">
        {slides.map((s, i) => (
          <TransitionLink
            key={s.slug}
            href={s.href}
            label={s.name}
            data-cover
            data-cursor={labels.open}
            className="group absolute inset-0 block"
            tabIndex={i === active ? 0 : -1}
            aria-label={`${s.name}: ${labels.view}`}
            aria-hidden={i !== active}
          >
            <Cover slide={s} index={i} priority={i === 0} stamp className="h-full w-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0_var(--ink)]" />
          </TransitionLink>
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
              <TransitionLink
                href={s.href}
                label={s.name}
                className="display mt-1 text-3xl transition-colors hover:text-accent"
                tabIndex={i === active ? 0 : -1}
                data-cursor={i === active ? labels.open : undefined}
                onClick={(e) => {
                  if (i !== active) {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
              >
                {s.name}
              </TransitionLink>
              <p className="mx-auto mt-2 max-w-[28ch] text-xs leading-relaxed text-muted">{s.summary}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Swatches double as a dot navigation */}
      <ul className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-1.5" aria-label={labels.selected}>
        {slides.map((s, i) => (
          <li key={s.slug}>
            <button
              type="button"
              aria-label={`${String(i + 1).padStart(2, "0")} ${s.name}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
              className="block h-2.5 w-2.5 border-2 border-ink transition-all duration-500"
              style={{ background: s.color, opacity: i === active ? 1 : 0.35, transform: i === active ? "scale(1.4)" : "none" }}
            />
          </li>
        ))}
      </ul>

      {/* Bottom-left: counter */}
      <div className="absolute bottom-16 left-6 flex items-start gap-3">
        <p className="label text-muted">{labels.selected}</p>
        <div className="flex items-start">
          <span className="display overflow-hidden text-[9vw] leading-[0.8]">
            <span data-counter className="block">
              {String(active + 1).padStart(2, "0")}
            </span>
          </span>
          <span className="display outline mt-2 text-[4vw] leading-[0.8]">/{String(n).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Bottom-right: controls */}
      <div className="absolute bottom-16 right-6 flex flex-col items-end gap-3">
        <div className="flex gap-3">
          <button type="button" className="btn btn-square" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={labels.prev}>
            ←
          </button>
          <button type="button" className="btn btn-square btn-ink" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label={labels.next}>
            →
          </button>
        </div>
        <p className="label text-muted">{labels.hint}</p>
      </div>

      {/* Progress */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-line">
        <div ref={progress} className="h-full w-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </section>
  );
}

function Row({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div data-meta className="grid grid-cols-[5.5rem_1fr] gap-3 border-t-2 border-ink pt-2">
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
    <section className="grid-paper px-4 pb-24 pt-10 lg:hidden motion-reduce:lg:block" aria-label={labels.selected}>
      <p className="label mb-8 text-muted">{labels.selected}</p>
      <ul className="space-y-16">
        {slides.map((s, i) => (
          <li key={s.slug}>
            <Link href={s.href} className="block">
              <Cover slide={s} index={i} sizes="100vw" stamp className="aspect-[4/3] w-full" />
            </Link>
            <div className="mt-6 flex items-baseline justify-between gap-4">
              <p className="label text-muted">{s.category}</p>
              <p className="label text-muted">
                {String(i + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
              </p>
            </div>
            <TransitionLink href={s.href} label={s.name} className="display mt-1 block text-4xl">
              {s.name}
            </TransitionLink>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.summary}</p>
            <ul className="label mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {s.numbers.map((m) => (
                <li key={m.label}>
                  <span className="text-ink">{m.value}</span> <span className="text-muted">{m.label}</span>
                </li>
              ))}
            </ul>
            <TransitionLink href={s.href} label={s.name} className="btn mt-5">
              {labels.open} <span aria-hidden>→</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
