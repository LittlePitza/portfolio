import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getBuild } from "@/lib/build";

interface Props {
  locale: Locale;
  footer: Dictionary["footer"];
  className?: string;
}

/**
 * The build stamp (section 6.7): "build a1b2c3d · 17 nov 2026", the deployed commit and
 * the day it was built, or "build local" where there is no commit.
 */
export function BuildStamp({ locale, footer, className = "" }: Props) {
  const build = getBuild(locale);
  const text = build
    ? footer.build.replace("{sha}", build.commit).replace("{date}", build.date)
    : footer.buildLocal;

  return <span className={`text-ui tabular-nums text-muted ${className}`}>{text}</span>;
}
