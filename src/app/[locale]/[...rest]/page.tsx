import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { NotFoundScreen } from "@/components/chrome/NotFoundScreen";

export async function generateMetadata({ params }: PageProps<"/[locale]/[...rest]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return { title: "404", robots: { index: false, follow: false } };
}

/**
 * Any path under a language that no page claims (section 6.6). It draws the 404 itself,
 * inside the language's layout, instead of calling notFound(): with a dynamic root
 * layout Next answers notFound() with an empty shell and the browser then has to build
 * the page without the layout's fonts, language and scripts. The cost is the status:
 * this answers 200, kept out of search by `noindex`.
 *
 * shortcut: 200 instead of 404 for unmatched paths; upgrade with experimental
 * `globalNotFound` and a shared document component once that flag is stable.
 */
export default async function UnmatchedPath({ params }: PageProps<"/[locale]/[...rest]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <NotFoundScreen locale={locale} />;
}
