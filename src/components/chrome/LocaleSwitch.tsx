"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { isStale } from "@/lib/version";

/** EN / ES toggle that keeps the current path and remembers the choice in a cookie. */
export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");

  return (
    <span className="label flex gap-2">
      {locales.map((locale, i) => (
        <span key={locale} className="flex gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          <Link
            href={`/${locale}${rest}`}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            onClick={(e) => {
              document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
              if (isStale()) {
                e.preventDefault();
                // A newer deployment is live: load the page for real, not inside this old copy.
                window.location.assign(new URL(`/${locale}${rest}`, window.location.origin));
              }
            }}
            className={locale === current ? "text-ink" : "text-muted hover:text-ink"}
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </span>
  );
}
