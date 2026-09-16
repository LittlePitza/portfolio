import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { Clock } from "./Clock";
import { LocaleSwitch } from "./LocaleSwitch";
import { NavLinks } from "./NavLinks";
import { Mark } from "@/components/ui/Mark";
import { ContactOverlay } from "./ContactOverlay";
import { TransitionLink } from "./PageTransition";

interface Props {
  locale: Locale;
  t: Dictionary;
}

/**
 * Fixed chrome around every page: the mark, a stacked menu, the local clock,
 * the inquiries email, and a bottom row with the résumé and the language toggle.
 * Text is white under `mix-blend-difference`, so it reads dark on the light page
 * and light on black headers. The mark sits in its own layer so its colours
 * stay true.
 */
export function Frame({ locale, t }: Props) {
  const base = `/${locale}`;
  const nav = [
    { href: `${base}#work`, label: t.nav.work, anchor: "work" },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/contact`, label: t.nav.contact, overlay: "contact" as const },
  ];

  const contactGroups = [
    { title: t.contact.groups.career, links: [{ label: "LinkedIn", href: site.links.linkedin }] },
    { title: t.contact.groups.code, links: [{ label: "GitHub", href: site.links.github }] },
    {
      title: t.contact.groups.cv,
      links: [
        { label: "English PDF", href: site.cv.en, download: true },
        { label: "PDF en español", href: site.cv.es, download: true },
      ],
    },
  ];
  const credits = {
    title: t.footer.credits,
    rows: [
      { label: "Type", value: "Instrument Serif · Geist" },
      { label: "Motion", value: "GSAP · Lenis" },
      { label: "Stack", value: "Next.js 16 · TypeScript" },
      { label: t.footer.source, value: "LittlePitza/portfolio", href: site.links.source },
    ],
  };

  return (
    <>
      <ContactOverlay title={t.contact.title} lead={t.contact.lead} email={site.email} groups={contactGroups} close={t.about.close} credits={credits} />

      {/* Unblended layer: the mark keeps its orange. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 p-4 md:p-6">
        <TransitionLink href={base} label={site.name} aria-label={`${site.name}, home`} className="pointer-events-auto inline-block">
          <Mark className="h-10 w-10 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:rotate-[-6deg] md:h-11 md:w-11" />
        </TransitionLink>
      </div>

      {/* Blended layer: everything typographic. */}
      <div className="pointer-events-none fixed inset-0 z-40 text-white mix-blend-difference [&_.text-muted]:text-white/55">
        <div className="absolute inset-x-0 top-0 grid grid-cols-[auto_1fr] items-start gap-x-4 p-4 md:grid-cols-12 md:gap-4 md:p-6">
          <div className="label ml-14 hidden whitespace-nowrap md:col-span-3 md:block">
            {site.name}
            <br />
            <span className="text-muted">{t.frame.city}</span>
          </div>
          <div className="w-10 md:hidden" aria-hidden />

          <nav className="pointer-events-auto justify-self-end md:col-span-3 md:justify-self-start" aria-label="Primary">
            <p className="label hidden text-muted md:block">{t.nav.menu}</p>
            <div className="md:mt-1">
              <NavLinks items={nav} home={base} />
            </div>
          </nav>

          <div className="hidden md:col-span-3 md:block">
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

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
          <p className="label text-muted" data-scroll-hint>
            {t.frame.scroll} <span className="blink">▼</span>
          </p>
          <div className="pointer-events-auto flex items-center gap-5">
            <a href={site.cv[locale]} download className="link-draw label">
              {t.frame.cv} ↓
            </a>
            <LocaleSwitch current={locale} />
          </div>
        </div>
      </div>
    </>
  );
}
