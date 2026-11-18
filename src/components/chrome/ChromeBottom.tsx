import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { LocaleSwitch } from "./LocaleSwitch";

interface Props {
  locale: Locale;
  t: Dictionary;
  /** The bottom-left slot, which each page decides (section 5.1). */
  hint: React.ReactNode;
  className?: string;
}

/**
 * The frame's bottom row on the stage: the page's hint on the left, the résumé in the
 * active language and the language switch on the right. Below the stage breakpoint
 * both links live in the menu layer instead.
 */
export function ChromeBottom({ locale, t, hint, className = "" }: Props) {
  return (
    <footer
      className={`page-grid relative z-(--z-chrome) hidden items-center pb-(--margin) text-ui stage:grid
        ${className}`}
    >
      <p className="col-span-4 text-muted">{hint}</p>
      <div className="col-span-2 col-start-7 flex items-center justify-end gap-6">
        <a href={site.cv[locale]} download className="inline-flex min-h-6 items-center">
          {t.frame.cv} ↓
        </a>
        <LocaleSwitch current={locale} label={t.frame.language} size="frame" />
      </div>
    </footer>
  );
}
