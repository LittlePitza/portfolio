"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { site } from "@/content/site";
import { Head } from "@/components/about/Head";
import { usePreloader } from "@/components/preloader/PreloaderContext";
import { openContact } from "@/components/chrome/ContactOverlay";
import styles from "./Hero.module.css";

interface Props {
  eyebrow: string; tagline: string; sub: string; ctaWork: string; ctaContact: string;
  stamp: string; contactHref: string; aboutHref: string; aboutLabel: string; edition: string;
}

/** Readable immediately, then enhanced with a short typographic entrance. */
export function Hero({ eyebrow, tagline, sub, ctaWork, ctaContact, stamp, contactHref, aboutHref, aboutLabel, edition }: Props) {
  const root = useRef<HTMLElement>(null);
  const { done } = usePreloader();

  useGSAP(() => {
    if (!done) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-letter]", { yPercent: 110, rotation: 6, duration: 0.85, stagger: 0.025 })
        .from("[data-portrait]", { y: 36, rotation: -9, opacity: 0, duration: 0.8, clearProps: "transform,opacity" }, 0.18)
        .from("[data-fade]", { y: 18, opacity: 0, duration: 0.65, stagger: 0.07, clearProps: "all" }, 0.35);
      gsap.to("[data-orbit]", {
        rotation: 100, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [done], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.hero} aria-label={site.fullName}>
      <div className={styles.topline} data-fade>
        <p className="label">{eyebrow}</p>
        <p className="label text-muted">{edition} <span className={styles.statusDot} aria-hidden /></p>
      </div>
      <div className={styles.nameStage}>
        <h1 className={`display ${styles.name}`} aria-label={site.name}>
          {site.heroName.map((line, index) => (
            <span key={line} className={`${styles.line} ${index === 1 ? styles.surname : ""}`} aria-hidden="true">
              {Array.from(line).map((letter, i) => <span key={i} data-letter className={styles.letter}>{letter}</span>)}
            </span>
          ))}
        </h1>
        <div className={styles.aside}>
          <svg data-orbit className={styles.orbit} viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.6" />
            {[0, 30, 60, 90, 120, 150].map((angle) => <path key={angle} d="M50 5V95" stroke="currentColor" strokeWidth="1.2" transform={`rotate(${angle} 50 50)`} />)}
          </svg>
          <Link href={aboutHref} data-portrait className={styles.portrait} aria-label={aboutLabel}>
            <span className={`label ${styles.portraitIndex}`}>LH — 01</span>
            <Head className={styles.head} />
            <span className={styles.portraitCaption}><span className="label">{aboutLabel}</span><span aria-hidden>↗</span></span>
          </Link>
          <span className={`label ${styles.coordinate}`}>20°35′ N &nbsp; 100°23′ W</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <div data-fade className={styles.location}>
          <span className={styles.crosshair} aria-hidden>+</span><span className="label">{stamp}</span>
        </div>
        <p data-fade className={styles.tagline}>{tagline}</p>
        <div className={styles.description}>
          <p data-fade>{sub}</p>
          <div data-fade className={styles.actions}>
            <a href="#work" className="btn btn-accent" onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              const section = document.getElementById("work");
              if (section) {
                event.preventDefault();
                window.history.replaceState(window.history.state, "", "#work");
                section.focus({ preventScroll: true });
                scrollTo(section, { offset: -90 });
              }
            }}>{ctaWork}<span aria-hidden>↘</span></a>
            <Link href={contactHref} className={styles.contactLink} onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault(); openContact();
            }}>{ctaContact}<span aria-hidden>↗</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
