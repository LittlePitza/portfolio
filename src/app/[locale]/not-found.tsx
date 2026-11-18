import { locale as rootLocale } from "next/root-params";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { NotFoundScreen } from "@/components/chrome/NotFoundScreen";

/**
 * Answers a `notFound()` thrown inside a language, such as an unknown project. Next
 * renders this file without the language's layout around it when the layout is the
 * root one, so it only holds until the browser takes over; the unmatched paths, which
 * are the common case, never come here (see [...rest]/page.tsx).
 */
export default async function NotFound() {
  const requested = await rootLocale();
  return <NotFoundScreen locale={requested && hasLocale(requested) ? requested : defaultLocale} />;
}
