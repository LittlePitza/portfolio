import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { StageShell } from "@/components/chrome/StageShell";

/** Home, About and Contact: composed screens on the stage (section 4). */
export default async function StageLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <StageShell locale={locale}>{children}</StageShell>;
}
