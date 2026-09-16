"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

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
            onClick={() => {
              document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
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
