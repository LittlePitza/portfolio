/** A role's start or end month, as profile.ts writes it: "2025-07". */
type YearMonth = string;

const yearOf = (month: YearMonth) => month.slice(0, 4);

/**
 * A role's years at a glance, for the Journey column: "2026–hoy", "2025–26" or "2025".
 * `now` closes a role that has not ended.
 */
export function formatYears(from: YearMonth, to: YearMonth | null, now: string): string {
  const start = yearOf(from);
  if (to === null) return `${start}–${now}`;
  const end = yearOf(to);
  if (end === start) return start;
  return `${start}–${end.slice(2)}`;
}

/** A role's full range for the Journey layer, e.g. "jul 2025 — dic 2025", in `locale`. */
export function formatRange(from: YearMonth, to: YearMonth | null, locale: string, present: string): string {
  const format = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" });
  const toDate = (month: YearMonth) => new Date(`${month}-01T12:00:00Z`);
  const end = to === null ? present : format.format(toDate(to));
  return `${format.format(toDate(from))} — ${end}`;
}
