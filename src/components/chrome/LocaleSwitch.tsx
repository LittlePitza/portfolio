"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { shouldHandleNavigation } from "@/lib/navigation";
import { useCurtain } from "./Curtain";

/** How each language names itself, for the link's accessible name. */
const SWITCH_TO: Record<Locale, string> = { en: "Switch to English", es: "Cambiar a español" };

/** 24 px targets in the frame, which only exists on the stage; 44 px in the menu layer. */
const TARGET = { frame: "min-h-6 min-w-6", layer: "min-h-11 min-w-11" } as const;

interface Props {
  current: Locale;
  /** Accessible name of the group, e.g. "Idioma". */
  label: string;
  size: keyof typeof TARGET;
}

/**
 * EN / ES, the active one in ink and the other muted. Keeps the current path and
 * remembers the choice in a cookie. A language switch never raises the curtain.
 */
export function LocaleSwitch({ current, label, size }: Props) {
  const pathname = usePathname();
  const { jump } = useCurtain();
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");

  return (
    <span className="flex items-center" role="group" aria-label={label}>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span aria-hidden className="px-1 text-muted">/</span>}
          <Link
            href={`/${locale}${rest}`}
            hrefLang={locale}
            lang={locale}
            aria-label={SWITCH_TO[locale]}
            aria-current={locale === current ? "true" : undefined}
            onClick={(event) => {
              if (!shouldHandleNavigation(event)) return;
              event.preventDefault();
              if (locale === current) return;
              document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
              jump(`/${locale}${rest}${window.location.search}${window.location.hash}`);
            }}
            className={`inline-flex items-center justify-center ${TARGET[size]} ${
              locale === current ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </span>
  );
}
