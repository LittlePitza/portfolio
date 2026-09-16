import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { Marquee } from "@/components/ui/Marquee";
import { Mark } from "@/components/ui/Mark";

/** Black closing band: ticker, a big invitation, the email as a button, and the links. */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="bg-ink text-bg">
      <Marquee items={t.ticker} lang={locale} className="label border-y-2 border-ink bg-accent py-3 text-sm text-ink" duration={35} />

      <div className="grid gap-12 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24">
        <div className="md:col-span-7">
          <Mark className="h-12 w-12" />
          <p className="display mt-8 max-w-[14ch] text-[clamp(2.5rem,6vw,6rem)]">{t.footer.tagline}</p>
          <a href={`mailto:${site.email}`} className="btn btn-accent mt-10" data-cursor="Mail">
            {t.footer.cta} <span aria-hidden>→</span>
          </a>
        </div>

        <div className="grid gap-8 md:col-span-5 md:grid-cols-2">
          <div>
            <p className="label text-bg/50">{t.contact.groups.code}</p>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={site.links.github} className="link-draw display text-3xl" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.links.source} className="link-draw display text-3xl" target="_blank" rel="noreferrer">
                  {t.footer.source}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="label text-bg/50">{t.contact.groups.career}</p>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={site.links.linkedin} className="link-draw display text-3xl" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.cv[locale]} className="link-draw display text-3xl" download>
                  {t.frame.cv} ↓
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t border-bg/15 px-4 py-6 md:grid-cols-3 md:px-6">
        <p className="label text-bg/50">{t.footer.made}</p>
        <p className="label text-bg/50 md:text-center">{t.footer.builtWith}</p>
        <p className="label text-bg/50 md:text-right">
          {site.domain} · {t.frame.copyright}
        </p>
      </div>
    </footer>
  );
}
