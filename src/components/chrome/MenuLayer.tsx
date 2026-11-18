"use client";

import { useId, type RefObject } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { enterStep } from "@/components/ui/enterStep";
import { Clock } from "./Clock";
import { EmailButton } from "./EmailButton";
import { LocaleSwitch } from "./LocaleSwitch";
import { NavLinks } from "./NavLinks";
import { getNavItems } from "./navItems";

interface Props {
  /** The caller opens it with showModal(); Escape, "Cerrar" and every link close it. */
  dialog: RefObject<HTMLDialogElement | null>;
  locale: Locale;
  nav: Dictionary["nav"];
  frame: Dictionary["frame"];
}

/**
 * The full-screen menu (section 5.3): the four links at title size, then the clock,
 * the email, the résumé and the language. A native modal dialog, so focus stays inside,
 * Escape closes it and focus returns to the button that opened it.
 */
export function MenuLayer({ dialog, locale, nav, frame }: Props) {
  const titleId = useId();
  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="layer-sheet"
    >
      <div className="flex items-start justify-between px-(--margin) pt-(--margin) text-ui">
        <p id={titleId} className="flex min-h-11 items-center text-muted">
          {nav.menu}
        </p>
        <button type="button" onClick={close} className="min-h-11 min-w-11 text-right">
          {nav.close}
        </button>
      </div>

      <nav aria-label={nav.label} className="px-(--margin) py-12">
        <NavLinks items={getNavItems(locale, nav)} home={`/${locale}`} size="layer" onNavigate={close} />
      </nav>

      <div
        data-enter
        style={enterStep(4)}
        className="grid gap-4 px-(--margin) pb-12 text-ui"
      >
        <div>
          <p className="text-muted">{frame.workingFrom}</p>
          <p className="tabular-nums">
            {frame.city} · <Clock locale={locale} timeZone={site.location.timeZone} />
          </p>
        </div>
        <EmailButton
          email={site.email}
          labels={{ idle: frame.inquiries, copied: frame.copied, failed: frame.copyFailed }}
        />
        <div className="flex items-center gap-6">
          <a href={site.cv[locale]} download className="inline-flex min-h-11 items-center">
            {frame.cv} ↓
          </a>
          <LocaleSwitch current={locale} label={frame.language} size="layer" />
        </div>
      </div>
    </dialog>
  );
}
