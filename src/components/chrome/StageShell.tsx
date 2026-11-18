import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { ChromeBottom } from "./ChromeBottom";
import { ChromeTop } from "./ChromeTop";
import { CompactBar } from "./CompactBar";
import { StageHint } from "./StageHint";

/**
 * Screen mode (section 4): Home, About, Contact and the 404. On the stage the frame's
 * two rows hold the top and the bottom of a viewport-tall container; below it the page
 * stacks and scrolls under the compact bar. A page composed to fit one viewport marks
 * itself `data-fit`, and globals.css then holds the container to exactly one viewport.
 */
export function StageShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getDictionary(locale);
  const hint = { scroll: t.frame.scroll, keys: t.frame.keys, rest: t.frame.copyright };

  return (
    <div
      data-stage-shell
      className="stage:relative stage:grid stage:min-h-svh stage:grid-rows-[auto_1fr_auto]"
    >
      <CompactBar locale={locale} nav={t.nav} frame={t.frame} className="stage:hidden" />
      <ChromeTop locale={locale} t={t} />
      <main id="main-content" tabIndex={-1} className="pt-14 stage:pt-0">
        {children}
      </main>
      <ChromeBottom locale={locale} t={t} hint={<StageHint home={`/${locale}`} labels={hint} />} />
    </div>
  );
}
