import type { Locale } from "@/i18n/config";

/** Characters of the commit hash the stamp shows. */
const COMMIT_LENGTH = 7;

export interface Build {
  /** The first characters of the deployed commit. */
  commit: string;
  /** The day the build ran, written in the visitor's language. */
  date: string;
}

/**
 * The commit and date next.config.ts inlines at build time, or null when there is no
 * commit (a local build). Read on the server only: the pages are static, so the stamp is
 * fixed into the HTML of the deployment it describes.
 */
export function getBuild(locale: Locale): Build | null {
  const commit = process.env.BUILD_COMMIT;
  const builtAt = process.env.BUILD_DATE;
  if (!commit || !builtAt) return null;

  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(builtAt));
  return { commit: commit.slice(0, COMMIT_LENGTH), date };
}
