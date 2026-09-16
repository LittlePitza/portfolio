"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Character } from "@/components/preloader/Character";
import { Mark } from "@/components/ui/Mark";

export const CONTACT_OPEN_EVENT = "contact:open";

/** Anyone can open the contact cards by dispatching this on `window`. */
export function openContact() {
  window.dispatchEvent(new CustomEvent(CONTACT_OPEN_EVENT));
}

interface Group {
  title: string;
  links: { label: string; href: string; download?: boolean }[];
}

interface Props {
  title: string;
  lead: string;
  email: string;
  groups: Group[];
  close: string;
  credits: { title: string; rows: { label: string; value: string; href?: string }[] };
}

/**
 * Two floating cards over the current page: a black one with every way to
 * reach me, and a paper one with the credits and the character waving.
 * Opens from the menu, closes with the button, the backdrop or Escape.
 */
export function ContactOverlay({ title, lead, email, groups, close, credits }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener(CONTACT_OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(CONTACT_OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current!;
      const reduce = prefersReducedMotion();
      if (open) {
        gsap.set(el, { pointerEvents: "auto" });
        gsap.to("[data-backdrop]", { autoAlpha: 1, duration: reduce ? 0 : 0.3 });
        gsap.fromTo(
          "[data-card]",
          { y: 80, rotate: (i: number) => (i === 0 ? 6 : -10), autoAlpha: 0 },
          { y: 0, rotate: (i: number) => (i === 0 ? 1 : -3), autoAlpha: 1, duration: reduce ? 0 : 0.7, stagger: 0.1, ease: "back.out(1.4)" },
        );
        el.querySelector<HTMLElement>("[data-first]")?.focus();
      } else {
        gsap.to("[data-card]", { y: 40, autoAlpha: 0, duration: reduce ? 0 : 0.3, ease: "power3.in", stagger: 0.05 });
        gsap.to("[data-backdrop]", { autoAlpha: 0, duration: reduce ? 0 : 0.3, delay: 0.1 });
        gsap.set(el, { pointerEvents: "none", delay: 0.4 });
      }
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-[52]" aria-hidden={!open}>
      <button type="button" data-backdrop className="absolute inset-0 bg-bg/60 opacity-0 backdrop-blur-[2px]" aria-label={close} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} />

      <div className="absolute inset-0 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
        <div className="relative w-full max-w-lg">
          {/* Black card */}
          <div data-card className="brutal-accent relative z-10 bg-ink p-6 text-bg opacity-0 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="display text-4xl md:text-5xl">{title}</h2>
              <button type="button" data-first className="btn btn-square bg-ink text-bg shadow-[4px_4px_0_var(--accent)]" onClick={() => setOpen(false)} aria-label={close} tabIndex={open ? 0 : -1}>
                ×
              </button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="label text-bg/50">{lead}</p>
                <a href={`mailto:${email}`} className="link-draw mt-1 inline-block font-display text-2xl" tabIndex={open ? 0 : -1}>
                  {email}
                </a>
              </div>
              {groups.map((g) => (
                <div key={g.title}>
                  <p className="label text-bg/50">{g.title}</p>
                  <ul className="mt-1 space-y-0.5">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          className="link-draw display text-2xl"
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          download={l.download}
                          tabIndex={open ? 0 : -1}
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Paper card with credits */}
          <div data-card className="brutal relative -mt-6 ml-auto w-[92%] bg-paper p-6 opacity-0 md:-mr-10 md:p-8">
            <div className="flex items-start justify-between">
              <h3 className="display text-3xl">{credits.title}</h3>
              <Mark className="h-8 w-8" />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 pr-24">
              {credits.rows.map((r) => (
                <div key={r.label}>
                  <dt className="label text-muted">{r.label}</dt>
                  <dd className="text-sm">
                    {r.href ? (
                      <a href={r.href} className="link-draw" target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
                        {r.value}
                      </a>
                    ) : (
                      r.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="absolute -bottom-2 right-4 w-20 md:w-24">
              <Character className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
