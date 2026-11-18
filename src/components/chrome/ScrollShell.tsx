import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BuildStamp } from "./BuildStamp";
import { ChromeBottom } from "./ChromeBottom";
import { ChromeTop } from "./ChromeTop";
import { CompactBar } from "./CompactBar";

/**
 * Reading mode (section 4): the index and the case studies always scroll. On the stage
 * the frame's top row sits in the flow and leaves with the scroll, the compact bar comes
 * back when scrolling up past it, and the bottom row closes the page with the credits
 * and the build stamp. Below the stage the compact bar is the whole frame and the
 * credits close the page on their own.
 */
export function ScrollShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getDictionary(locale);
  const credits = (
    <>
      {t.frame.copyright} · {t.footer.made} · <BuildStamp locale={locale} footer={t.footer} />
    </>
  );

  return (
    <>
      <CompactBar locale={locale} nav={t.nav} frame={t.frame} />
      <ChromeTop locale={locale} t={t} />
      <main data-scroll-shell id="main-content" tabIndex={-1} className="pt-14 stage:pt-0">
        {children}
      </main>
      <ChromeBottom locale={locale} t={t} hint={credits} className="mt-24" />
      <footer className="page-grid mt-24 pb-(--margin) text-ui text-muted stage:hidden">
        <p className="col-span-4">{credits}</p>
      </footer>
    </>
  );
}
