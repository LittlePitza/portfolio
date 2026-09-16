import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { Clock } from "./Clock";
import { LocaleSwitch } from "./LocaleSwitch";
import { Avatar } from "@/components/preloader/Character";

interface Props {
  locale: Locale;
  t: Dictionary;
}

/**
 * Fixed chrome around every page, in the spirit of huyml.co: logo and avatar,
 * stacked menu, local clock, inquiries email, and a bottom row with the CV link.
 */
export function Frame({ locale, t }: Props) {
  const base = `/${locale}`;
  const nav = [
    { href: base, label: t.nav.work },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/contact`, label: t.nav.contact },
  ];

  return (
    // White text under `mix-blend-difference` reads dark on the light page and
    // light on the black headers, so the chrome never disappears.
    <div className="pointer-events-none fixed inset-0 z-40 text-white mix-blend-difference [&_.text-muted]:text-white/55 [&_.text-ink]:text-white">
      {/* Top row */}
      <div className="absolute inset-x-0 top-0 grid grid-cols-2 items-start gap-4 p-4 md:grid-cols-12 md:p-6">
        <Link href={base} className="pointer-events-auto col-span-1 flex items-start gap-3 md:col-span-3" aria-label="Home">
          <span className="display text-3xl leading-none">{site.initials}</span>
          <span className="hidden md:block">
            <Avatar className="h-9 w-9" />
          </span>
          <span className="label hidden whitespace-nowrap text-muted lg:block">
            {t.frame.city}
            <br />
            {t.frame.copyright}
          </span>
        </Link>

        <nav className="pointer-events-auto col-span-1 justify-self-end md:col-span-2 md:justify-self-start" aria-label="Primary">
          <p className="label text-muted">{t.nav.menu}</p>
          <ul className="mt-1 flex gap-3 md:block md:space-y-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw display text-lg leading-none">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:col-span-4 md:block">
          <p className="label text-muted">{t.frame.workingFrom}</p>
          <p className="label mt-1">
            {t.frame.city}, <Clock locale={locale} timeZone={site.location.timeZone} />
          </p>
        </div>

        <div className="pointer-events-auto hidden md:col-span-3 md:block md:text-right">
          <p className="label text-muted">{t.frame.inquiries}</p>
          <a href={`mailto:${site.email}`} className="link-draw label mt-1 inline-block">
            {site.email}
          </a>
        </div>
      </div>

      {/* Bottom row */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
        <p className="label text-muted" data-scroll-hint>
          {t.frame.scroll}
        </p>
        <div className="pointer-events-auto flex items-center gap-5">
          <a href={site.cv[locale]} download className="link-draw label">
            {t.frame.cv} ↓
          </a>
          <LocaleSwitch current={locale} />
        </div>
      </div>
    </div>
  );
}
