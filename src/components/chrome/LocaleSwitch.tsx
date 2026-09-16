"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { shouldHandleNavigation } from "@/lib/navigation";
import { useTransition } from "./PageTransition";

/** EN / ES toggle that keeps the current path and remembers the choice in a cookie. */
export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();
  const { go } = useTransition();
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");

  return (
    <span className="label flex gap-1" role="group" aria-label={current === "es" ? "Idioma" : "Language"}>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden>/</span>}
          <Link
            href={`/${locale}${rest}`}
            hrefLang={locale}
            lang={locale}
            aria-label={locale === "es" ? "Cambiar a español" : "Switch to English"}
            aria-current={locale === current ? "true" : undefined}
            onClick={(e) => {
              if (!shouldHandleNavigation(e)) return;
              e.preventDefault();
              if (locale === current) return;
              document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
              go(`/${locale}${rest}${window.location.search}${window.location.hash}`, locale === "es" ? "Español" : "English");
            }}
            className={`inline-flex min-h-11 min-w-8 items-center justify-center transition-opacity ${locale === current ? "opacity-100 underline underline-offset-4" : "opacity-50 hover:opacity-100"}`}
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </span>
  );
}
