import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { ScrollShell } from "@/components/chrome/ScrollShell";

/** The index and the case studies: pages that always scroll (section 4). */
export default async function ScrollLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <ScrollShell locale={locale}>{children}</ScrollShell>;
}
