"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Flip } from "gsap/Flip";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { shouldHandleNavigation } from "@/lib/navigation";
import { TransitionLink } from "@/components/chrome/PageTransition";
import { CountUp } from "@/components/ui/CountUp";
import { Cover } from "./Cover";
import type { Detail, GalleryLabels } from "./types";
import styles from "./gallery.module.css";

// Flip travels with this route alone; no other page pays for it.
gsap.registerPlugin(Flip);

const pad = (value: number) => String(value).padStart(2, "0");

interface Props {
  projects: Detail[];
  labels: GalleryLabels;
}

/**
 * Every project at once, and the whole of one.
 *
 * The grid holds every cover. Click one and it takes the full width of the
 * row: the cover grows, the name grows with it, and the case unfolds
 * underneath — role, stack, numbers, and the story. The other covers stay on
 * screen and slide to their new places, so nothing is ever hidden behind a
 * modal. Without JavaScript each cover is still a plain link to its case study.
 */
export function ProjectGallery({ projects, labels }: Props) {
  const root = useRef<HTMLOListElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const previous = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const fade = useRef<gsap.core.Tween | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  const n = projects.length;

  /** Photograph the grid, then let React lay it out again; the layout effect animates the difference. */
  const commit = useCallback((next: number | null) => {
    // A click that lands while a case is fading out wins over that fade.
    fade.current?.kill();
    fade.current = null;
    const el = root.current;
    if (el && !prefersReducedMotion()) previous.current = Flip.getState(el.querySelectorAll("[data-flip]"));
    setOpen(next);
  }, []);

  /** The case fades before the covers travel back, so the grid never snaps shut. */
  const collapse = useCallback(
    (index: number, focus = false) => {
      const done = () => {
        fade.current = null;
        commit(null);
        if (focus) cards.current[index]?.focus({ preventScroll: true });
      };
      const panel = items.current[index]?.querySelector<HTMLElement>("[data-panel]");
      // A hidden tab has no animation frames, and the close would wait for one.
      if (!panel || prefersReducedMotion() || document.hidden) {
        done();
        return;
      }
      fade.current = gsap.to(panel, { autoAlpha: 0, y: -10, duration: 0.25, ease: "power2.in", onComplete: done });
    },
    [commit],
  );

  // The grid re-flows: every card travels from where it was to where it is now.
  useGSAP(
    () => {
      const from = previous.current;
      previous.current = null;
      if (!from) return;
      Flip.from(from, { duration: 0.7, ease: "expo.out", nested: true, stagger: 0.015 });
      if (open === null) return;
      gsap.from("[data-reveal]", {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.04,
        delay: 0.12,
        ease: "expo.out",
        clearProps: "opacity,visibility,transform",
      });
    },
    { dependencies: [open], scope: root },
  );

  // The open project settles under the fixed chrome, whichever row it came from.
  useEffect(() => {
    if (open === null) return;
    const item = items.current[open];
    if (item) scrollTo(item, { offset: -96 });
  }, [open]);

  // Escape closes, arrows walk the gallery while a project is open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], dialog")) return;
      if (event.key === "Escape") {
        collapse(open, true);
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        commit((open + 1) % n);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        commit((open - 1 + n) % n);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collapse, commit, n, open]);

  return (
    <ol ref={root} className={styles.grid} data-open={open !== null}>
      {projects.map((project, index) => {
        const isOpen = index === open;
        const panelId = `${base}-${project.slug}`;
        return (
          <li
            key={project.slug}
            ref={(el) => {
              items.current[index] = el;
            }}
            className={styles.item}
            data-open={isOpen}
            style={{ "--project-color": project.color } as CSSProperties}
          >
            <div className={styles.topline}>
              <span className="label">
                <span className={styles.index}>{pad(index + 1)}</span> / {project.category}
              </span>
              <span className={styles.status}>
                <span aria-hidden />
                {project.status}
              </span>
            </div>

            <a
              ref={(el) => {
                cards.current[index] = el;
              }}
              href={project.href}
              data-flip
              data-art
              className={styles.card}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={`${project.name}: ${isOpen ? labels.close : labels.view}`}
              data-cursor={isOpen ? labels.close : labels.open}
              onClick={(event) => {
                if (!shouldHandleNavigation(event)) return;
                event.preventDefault();
                if (isOpen) collapse(index, true);
                else commit(index);
              }}
            >
              <span data-flip className={styles.artwork}>
                <Cover
                  slide={project}
                  index={index}
                  brutal={false}
                  className={styles.cover}
                  sizes={isOpen ? "(min-width: 900px) 55vw, 100vw" : "(min-width: 1180px) 33vw, (min-width: 720px) 50vw, 100vw"}
                />
                <span className={styles.toggle} aria-hidden>
                  +
                </span>
              </span>
              <span className={styles.caption}>
                <h2 className={styles.name}>{project.name}</h2>
                <p className={styles.summary}>{project.summary}</p>
                <span className={styles.tech}>{project.stack.slice(0, 3).join(" · ")}</span>
              </span>
            </a>

            {isOpen && (
              <div id={panelId} data-panel className={styles.detail} role="region" aria-label={project.name}>
                <span className={styles.ghost} aria-hidden>
                  {pad(index + 1)}
                </span>

                <div className={styles.detailGrid}>
                  <dl className={styles.meta}>
                    <Row label={labels.role} lines={project.role} />
                    <Row label={labels.stack} lines={project.stack} />
                    <Row label={labels.launch} lines={[project.launch]} />
                    <Row label={labels.status} lines={[project.status]} />
                    {project.links.length > 0 && (
                      <Row label={labels.links} lines={project.links.map((link) => link.label)} hrefs={project.links.map((link) => link.href)} />
                    )}
                  </dl>

                  <div className={styles.story}>
                    <h3 data-reveal className="label text-muted">
                      {labels.about}
                    </h3>
                    {project.body.map((paragraph) => (
                      <p key={paragraph} data-reveal className={styles.paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <ul className={styles.numbers} aria-label={labels.numbers}>
                  {project.numbers.map((metric) => (
                    <li key={metric.label} data-reveal>
                      <CountUp value={metric.value} className={styles.number} />
                      <span className="label text-muted">{metric.label}</span>
                    </li>
                  ))}
                </ul>

                <div data-reveal className={styles.foot}>
                  <div className={styles.steps}>
                    <button type="button" className={styles.step} onClick={() => commit((index - 1 + n) % n)}>
                      <span aria-hidden>←</span> {labels.prev}
                    </button>
                    <button type="button" className={styles.step} onClick={() => commit((index + 1) % n)}>
                      {labels.next} <span aria-hidden>→</span>
                    </button>
                  </div>
                  <div className={styles.footEnd}>
                    <button type="button" className={styles.step} onClick={() => collapse(index, true)}>
                      {labels.close} <span aria-hidden>×</span>
                    </button>
                    <TransitionLink href={project.href} label={project.name} className="btn btn-accent" data-cursor={labels.open}>
                      {labels.view} <span aria-hidden>↗</span>
                    </TransitionLink>
                  </div>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Row({ label, lines, hrefs }: { label: string; lines: string[]; hrefs?: string[] }) {
  return (
    <div data-reveal className={styles.row}>
      <dt className="label text-muted">{label}</dt>
      <dd className="label">
        {lines.map((line, index) =>
          hrefs?.[index] ? (
            <a key={line} href={hrefs[index]} className="link-draw block" target="_blank" rel="noreferrer">
              {line} ↗
            </a>
          ) : (
            <span key={line} className="block">
              {line}
            </span>
          ),
        )}
      </dd>
    </div>
  );
}
