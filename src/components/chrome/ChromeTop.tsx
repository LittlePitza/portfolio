import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { Clock } from "./Clock";
import { CurtainLink } from "./Curtain";
import { EmailButton } from "./EmailButton";
import { NavLinks } from "./NavLinks";
import { BrandMark } from "./BrandMark";
import { getNavItems } from "./navItems";

interface Props {
  locale: Locale;
  t: Dictionary;
}

/**
 * The frame's top row on the stage (section 5.1): mark and name, the menu, the local
 * time and the email, each on its own grid columns. It is not drawn below the stage
 * breakpoint, where the compact bar is the whole frame. `data-chrome-top` lets the
 * compact bar tell when this row is on screen.
 */
export function ChromeTop({ locale, t }: Props) {
  const home = `/${locale}`;

  return (
    <header
      data-chrome-top
      className="page-grid relative z-(--z-chrome) hidden items-start pt-(--margin) text-ui stage:grid"
    >
      <CurtainLink
        href={home}
        label={t.nav.work}
        aria-label={`${site.name}, ${t.nav.home}`}
        className="flex gap-2"
      >
        <BrandMark />
        <span>
          {site.name}
          <br />
          <span className="text-muted">{t.frame.identity}</span>
        </span>
      </CurtainLink>

      <nav aria-label={t.nav.label} className="col-span-2">
        <p className="mb-2 text-muted">{t.nav.menu}</p>
        <NavLinks items={getNavItems(locale, t.nav)} home={home} size="frame" />
      </nav>

      <div className="col-span-2 col-start-5">
        <p className="text-muted">{t.frame.workingFrom}</p>
        <p className="tabular-nums">
          {t.frame.city} · <Clock locale={locale} timeZone={site.location.timeZone} />
        </p>
      </div>

      <EmailButton
        email={site.email}
        labels={{ idle: t.frame.inquiries, copied: t.frame.copied, failed: t.frame.copyFailed }}
        className="col-span-2 col-start-7 text-right"
      />
    </header>
  );
}
