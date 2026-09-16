"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Character } from "@/components/preloader/Character";
import { Mark } from "@/components/ui/Mark";
import type { Locale } from "@/i18n/config";

export const CONTACT_OPEN_EVENT = "contact:open";

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
  locale: Locale;
  credits: { title: string; rows: { label: string; value: string; href?: string }[] };
}

/** A native modal supplies focus containment, focus return, and an inert background. */
export function ContactOverlay({ title, lead, email, groups, close, credits, locale }: Props) {
  const root = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyLabel = locale === "es" ? "Copiar correo" : "Copy email";
  const copiedLabel = locale === "es" ? "Correo copiado" : "Email copied";

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(CONTACT_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONTACT_OPEN_EVENT, onOpen);
      window.clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    const dialog = root.current;
    if (!dialog) return;
    const cards = dialog.querySelectorAll("[data-card]");
    const reduce = prefersReducedMotion();
    let animation: gsap.core.Tween | undefined;

    if (open) {
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
      closeButton.current?.focus({ preventScroll: true });
      animation = gsap.fromTo(cards,
        { y: reduce ? 0 : 32, rotate: 0, opacity: 0 },
        { y: 0, rotate: (i: number) => reduce ? 0 : i === 0 ? 1 : -2, opacity: 1, duration: reduce ? 0 : 0.45, stagger: reduce ? 0 : 0.06, ease: "power3.out" },
      );
    } else if (dialog.open) {
      animation = gsap.to(cards, {
        y: reduce ? 0 : 16, opacity: 0, duration: reduce ? 0 : 0.18,
        ease: "power2.in", onComplete: () => dialog.close(),
      });
    }

    return () => { animation?.kill(); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = originalOverflow; };
  }, [open]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // The mail link remains usable when clipboard permission is unavailable.
      root.current?.querySelector<HTMLAnchorElement>("[data-email]")?.focus();
    }
  }

  return (
    <dialog
      ref={root}
      id="contact-dialog"
      aria-labelledby="contact-title"
      aria-describedby="contact-lead"
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-transparent p-0 text-ink backdrop:bg-ink/45 backdrop:backdrop-blur-sm"
      data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); setOpen(false); }}
      onClose={() => setOpen(false)}
      onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
    >
      <div
        className="flex min-h-full items-center justify-center px-6 py-10 sm:px-10"
        onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
      >
        <div className="relative w-full max-w-lg">
          <div data-card className="brutal-accent relative z-10 bg-ink p-5 text-bg sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 id="contact-title" className="display text-4xl sm:text-5xl">{title}</h2>
              <button ref={closeButton} type="button" className="btn btn-square btn-ink shrink-0" onClick={() => setOpen(false)} aria-label={close}>
                <span aria-hidden>×</span>
              </button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="min-w-0 sm:col-span-2">
                <p id="contact-lead" className="label text-bg/65">{lead}</p>
                <a data-email href={`mailto:${email}`} className="link-draw mt-2 inline-block break-all font-display text-[clamp(1.25rem,5vw,1.75rem)] leading-tight">
                  {email}
                </a>
                <button type="button" className="label mt-3 flex min-h-11 items-center gap-2 text-bg/70 transition-colors hover:text-bg" onClick={() => void copyEmail()}>
                  <span aria-hidden>{copied ? "✓" : "⧉"}</span>
                  <span role="status" aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
                </button>
              </div>
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="label text-bg/65">{group.title}</p>
                  <ul className="mt-2 space-y-1">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className="link-draw display inline-block py-1 text-2xl" target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} download={link.download}>
                          {link.label} <span aria-hidden className="inline-block text-sm">{link.download ? "↓" : "↗"}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div data-card className="brutal relative ml-auto mt-3 w-[96%] bg-paper p-5 sm:-mr-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="display text-3xl">{credits.title}</h3>
              <Mark className="h-8 w-8 shrink-0" />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:pr-16">
              {credits.rows.map((row) => (
                <div key={row.label} className="min-w-0">
                  <dt className="label text-muted">{row.label}</dt>
                  <dd className="mt-1 break-words text-xs sm:text-sm">
                    {row.href ? <a href={row.href} className="link-draw" target="_blank" rel="noopener noreferrer">{row.value}</a> : row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="absolute -bottom-2 right-3 hidden w-20 sm:block" aria-hidden>
              <Character className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

