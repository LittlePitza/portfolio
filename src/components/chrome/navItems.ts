import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { WORK_ANCHOR } from "@/lib/navigation";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * The menu's four destinations, in order (section 5.1). "Trabajo" points at Home's
 * project list: stacked it scrolls there, on the stage it opens on a project, never on
 * the cover screen, which is the mark's destination (section 6.1).
 */
export function getNavItems(locale: Locale, nav: Dictionary["nav"]): NavItem[] {
  const home = `/${locale}`;
  return [
    { href: `${home}#${WORK_ANCHOR}`, label: nav.work },
    { href: `${home}/about`, label: nav.about },
    { href: `${home}/work`, label: nav.index },
    { href: `${home}/contact`, label: nav.contact },
  ];
}
