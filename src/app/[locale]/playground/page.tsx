import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Hero } from "@/components/hero/Hero";
import { WorkCarousel } from "@/components/work/WorkCarousel";
import { Marquee } from "@/components/ui/Marquee";
import { projectSlides, workLabels } from "@/components/work/slides";
import { localizedPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/playground">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return localizedPageMetadata({ locale, path: "/playground", title: t.playground.title, description: t.playground.description });
}

/** The long, editorial version: the hero with the portrait, then every project in depth. */
export default async function PlaygroundPage({ params }: PageProps<"/[locale]/playground">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <Hero
        eyebrow={t.hero.eyebrow}
        tagline={t.hero.tagline}
        sub={t.hero.sub}
        ctaWork={t.hero.ctaWork}
        ctaContact={t.hero.ctaContact}
        stamp={t.hero.stamp}
        contactHref={`/${locale}/contact`}
        aboutHref={`/${locale}/about`}
        aboutLabel={locale === "es" ? "Detrás del código" : "Behind the code"}
        edition={locale === "es" ? "Playground / 2026" : "Playground / 2026"}
      />
      <Marquee items={t.ticker} lang={locale} className="label border-y-2 border-ink bg-ink py-3 text-sm text-bg" />
      <div id="work" tabIndex={-1}>
        <WorkCarousel slides={projectSlides(locale)} labels={workLabels(t)} />
      </div>
    </>
  );
}
