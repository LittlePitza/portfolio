"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { TransitionLink } from "@/components/chrome/PageTransition";
import { usePreloader } from "@/components/preloader/PreloaderContext";
import { Cover } from "./Cover";
import type { Slide, WorkLabels } from "./types";
import styles from "./disc.module.css";

/** Degrees of wheel between two neighbouring discs. */
const STEP = 12;
/** Resting tilt of the disc in front. */
const TILT = -2;
/** Scroll distance for each project, as a share of the viewport height. */
const SCROLL_PER_PROJECT = 0.85;
/** Height of one name in the right-hand list, in px. Must match the CSS. */
const TITLE_H = 150;
/** Where there is room for the wheel at all. Below it, the simple stack. */
const WHEEL_MEDIA = "(min-width: 900px)";
/** Scroll drives the wheel only where movement is welcome. */
const SCROLL_WHEEL = `${WHEEL_MEDIA} and (prefers-reduced-motion: no-preference)`;
/** The same wheel, placed straight to its resting position and moved by the controls. */
const STATIC_WHEEL = `${WHEEL_MEDIA} and (prefers-reduced-motion: reduce)`;

interface Props {
  slides: Slide[];
  labels: WorkLabels;
  /** Link to the long version of every project. */
  deep: { href: string; label: string };
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The projects as records on a wheel. The wheel's hub sits far off the
 * bottom-right corner, so as you scroll each disc rolls in from the bottom
 * left, settles in front almost upright, and rolls away to the top right,
 * tilting as it goes. Around it: the active project's details, the list of
 * names, a big counter, controls and progress. Scroll, arrow keys, the
 * buttons, the colour dots, a name or a background disc all move the wheel.
 * Asked for reduced motion, the wheel stays and the scrolling goes: the same
 * stage, placed straight to each project, moved only by the controls.
 */
export function DiscStage({ slides, labels, deep }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const entrance = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  /** Which of the two wheels is running. Nothing rendered depends on it, so it never
      disagrees with the server; it only tells the effects below how to move. */
  const [driven, setDriven] = useState<"scroll" | "controls">("scroll");
  /** The project in front, readable from a media context that does not re-run on a new one. */
  const activeRef = useRef(0);
  const { done } = usePreloader();
  const n = slides.length;
  const slide = slides[active]!;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /** Put every disc on the wheel for a continuous position `p` between 0 and n - 1. */
  const place = useCallback((p: number) => {
    const el = stage.current;
    if (!el) return;
    const radius = Math.max(el.clientWidth, el.clientHeight) * 1.35;
    const hub = radius * Math.SQRT1_2;
    el.querySelectorAll<HTMLElement>("[data-disc]").forEach((disc, i) => {
      const d = i - p;
      const distance = Math.abs(d);
      const angle = ((225 - d * STEP) * Math.PI) / 180;
      const x = hub + radius * Math.cos(angle);
      const y = hub + radius * Math.sin(angle);
      const scale = 1 - Math.min(distance, 3) * 0.05;
      disc.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(-d * STEP + TILT).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      disc.style.opacity = String(Math.max(0, Math.min(1, 3 - distance)));
      disc.style.zIndex = String(50 - Math.round(distance * 10));
    });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      if (n < 2) return;
      const clamped = Math.max(0, Math.min(n - 1, i));
      const st = trigger.current;
      // Scrolling is what turns the wheel; without it the controls set the project directly.
      if (st) scrollTo(st.start + ((st.end - st.start) * clamped) / (n - 1));
      else setActive(clamped);
    },
    [n],
  );

  // Scroll drives the wheel where motion is welcome; everywhere else the controls do.
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(SCROLL_WHEEL, () => {
        setDriven("scroll");
        if (n < 2) {
          place(0);
          return;
        }
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${Math.round((n - 1) * window.innerHeight * SCROLL_PER_PROJECT)}`,
          pin: stage.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.55 }, delay: 0.08, ease: "power2.inOut" },
          onUpdate: (self) => {
            if (self.progress > 0) entrance.current?.kill();
            const p = self.progress * (n - 1);
            place(p);
            const i = Math.round(p);
            setActive((previous) => (previous === i ? previous : i));
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
          onRefresh: (self) => place(self.progress * (n - 1)),
        });
        trigger.current = st;
        place(st.progress * (n - 1));
        return () => {
          trigger.current = null;
        };
      });
      media.add(STATIC_WHEEL, () => {
        setDriven("controls");
        place(activeRef.current);
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [n, place] },
  );

  // The hero comes first, so the wheel holds its discs back and spins them in when the stage arrives.
  useGSAP(
    () => {
      const st = trigger.current;
      if (!done || !st || st.progress > 0) return;
      const proxy = { p: -2.4 };
      place(proxy.p);
      const enter = ScrollTrigger.create({
        trigger: root.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          entrance.current = gsap.to(proxy, { p: 0, duration: 1.5, ease: "expo.out", onUpdate: () => place(proxy.p) });
          gsap.from("[data-enter]", { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.07, delay: 0.15, ease: "power3.out", clearProps: "opacity,visibility,transform" });
        },
      });
      return () => enter.kill();
    },
    { scope: root, dependencies: [done] },
  );

  // Without a scroll trigger the wheel is placed outright, and it has to survive a resize.
  useEffect(() => {
    if (driven !== "controls") return;
    const paint = () => {
      place(active);
      if (bar.current) bar.current.style.transform = `scaleX(${n < 2 ? 1 : active / (n - 1)})`;
    };
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [driven, active, n, place]);

  // A new project in front: its details swap in, the names roll, the counter ticks.
  useGSAP(
    () => {
      if (driven === "controls") {
        // The same end state the tweens below reach, arrived at without the journey.
        gsap.set("[data-titles]", { y: -active * TITLE_H });
        gsap.set("[data-meta-row], [data-count]", { clearProps: "all" });
        return;
      }
      if (!trigger.current) return;
      gsap.fromTo("[data-meta-row]", { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.04, ease: "power3.out", overwrite: true });
      gsap.fromTo("[data-count]", { yPercent: 45, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out", overwrite: true });
      gsap.to("[data-titles]", { y: -active * TITLE_H, duration: 0.7, ease: "expo.out", overwrite: true });
    },
    { scope: root, dependencies: [active, driven] },
  );

  // Arrow keys while the wheel is on screen, or, with no pin to hold it there, while it has focus.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const listening = trigger.current?.isActive ?? stage.current?.contains(document.activeElement);
      if (!listening || event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], dialog")) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        goTo(active + 1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  /** A disc or name that is not in front brings itself to the front instead of opening. */
  const spinTo = (i: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (i !== active && n > 1) {
      event.preventDefault();
      goTo(i);
    }
  };

  return (
    <section ref={root} id="work" tabIndex={-1} className={styles.root} aria-labelledby="disc-stage-title" aria-roledescription="carousel">
      <h2 id="disc-stage-title" className="sr-only">
        {labels.selected}
      </h2>

      <div ref={stage} className={styles.stage}>
        <div className={styles.wheel}>
          {slides.map((s, i) => (
            <TransitionLink
              key={s.slug}
              href={s.href}
              label={s.name}
              data-disc
              className={styles.disc}
              style={i === 0 ? undefined : { opacity: 0 }}
              data-cursor={i === active ? labels.open : undefined}
              tabIndex={i === active ? 0 : -1}
              aria-hidden={i !== active}
              aria-label={`${s.name}: ${labels.view}`}
              onClick={spinTo(i)}
            >
              <Cover slide={s} index={i} brutal={false} className={styles.cover} sizes="34vw" priority={i === 0} />
            </TransitionLink>
          ))}
        </div>

        <dl className={styles.meta} data-enter>
          <Row label={labels.role} lines={slide.role} />
          <Row label={labels.stack} lines={slide.stack} />
          <Row label={labels.launch} lines={[slide.launch, slide.status]} />
          <Row label={labels.numbers} lines={slide.numbers.map((m) => `${m.value} ${m.label}`)} />
        </dl>

        <div className={styles.titles} data-enter>
          <ol data-titles className={styles.titleList} style={{ paddingTop: TITLE_H }}>
            {slides.map((s, i) => (
              <li key={s.slug} className={styles.title} data-active={i === active} style={{ height: TITLE_H }}>
                <p className="label text-muted">{s.category}</p>
                <TransitionLink href={s.href} label={s.name} className={styles.titleName} tabIndex={i === active ? 0 : -1} onClick={spinTo(i)}>
                  {s.name}
                </TransitionLink>
                <p className={styles.titleSummary}>{s.summary}</p>
              </li>
            ))}
          </ol>
        </div>

        <ol className={styles.swatches} data-enter aria-label={labels.selected}>
          {slides.map((s, i) => (
            <li key={s.slug}>
              <button
                type="button"
                className={styles.swatch}
                style={{ background: s.color }}
                aria-label={`${pad(i + 1)} ${s.name}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
              />
            </li>
          ))}
        </ol>

        <div className={styles.counter} data-enter aria-hidden>
          <p className="label">{labels.selected}</p>
          <p className={styles.count}>
            <span className={styles.countClip}>
              <span data-count className={styles.countNumber}>
                {pad(active + 1)}
              </span>
            </span>
            <span className={styles.total}>/{pad(n)}</span>
          </p>
        </div>

        <div className={styles.controls} data-enter>
          <TransitionLink href={deep.href} label={deep.label} className={styles.deep}>
            {deep.label} <span aria-hidden>↗</span>
          </TransitionLink>
          <div className={styles.buttons}>
            <button type="button" className={styles.arrow} onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={labels.prev}>
              <span aria-hidden>←</span>
            </button>
            <button type="button" className={styles.arrow} onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label={labels.next}>
              <span aria-hidden>→</span>
            </button>
          </div>
          <p className={`label text-muted ${styles.hintScroll}`}>{labels.hint}</p>
          <p className={`label text-muted ${styles.hintStatic}`}>{labels.hintStatic}</p>
        </div>

        <span className={styles.progress} aria-hidden>
          <span ref={bar} className={styles.progressFill} />
        </span>
      </div>

      {/* Phones and narrow windows: the same discs as a simple stack. */}
      <ol className={styles.list}>
        {slides.map((s, i) => (
          <li key={s.slug} className={styles.item}>
            <TransitionLink href={s.href} label={s.name} className={styles.itemLink}>
              <Cover slide={s} index={i} brutal={false} className={styles.itemCover} sizes="(min-width: 640px) 50vw, 100vw" />
              <span className={styles.itemMeta}>
                <span className="label text-muted">
                  {pad(i + 1)} / {s.category}
                </span>
                <span className="label text-muted">{s.status}</span>
              </span>
              <span className={styles.itemName}>{s.name}</span>
              <span className={styles.itemOpen}>
                {labels.open} <span aria-hidden>↗</span>
              </span>
            </TransitionLink>
          </li>
        ))}
        <li className={styles.deepItem}>
          <TransitionLink href={deep.href} label={deep.label} className={styles.deep}>
            {deep.label} <span aria-hidden>↗</span>
          </TransitionLink>
        </li>
      </ol>
    </section>
  );
}

function Row({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div data-meta-row className={styles.row}>
      <dt className="label text-muted">{label}</dt>
      <dd className="label">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </dd>
    </div>
  );
}
