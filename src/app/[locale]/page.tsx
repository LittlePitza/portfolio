import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { PreloaderProvider } from "@/components/preloader/PreloaderContext";
import { Preloader } from "@/components/preloader/Preloader";
import { Hero } from "@/components/hero/Hero";
import { WorkCarousel } from "@/components/work/WorkCarousel";
import type { Slide } from "@/components/work/types";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  const slides: Slide[] = projects.map((p) => ({
    slug: p.slug,
    href: `/${locale}/work/${p.slug}`,
    name: p.name,
    category: p.category[locale],
    role: p.role[locale],
    stack: p.stack,
    launch: p.launch[locale],
    status: p.status[locale],
    numbers: p.numbers.map((m) => ({ value: m.value, label: m.label[locale] })),
    summary: p.summary[locale],
    color: p.color,
    cover: p.cover,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    alternateName: site.name,
    email: `mailto:${site.email}`,
    url: site.url,
    jobTitle: t.hero.eyebrow,
    address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.country },
    sameAs: [site.links.github, site.links.linkedin],
  };

  return (
    <PreloaderProvider>
      <Preloader />
      <Hero eyebrow={t.hero.eyebrow} tagline={t.hero.tagline} sub={t.hero.sub} />
      <WorkCarousel
        slides={slides}
        labels={{
          selected: t.work.selected,
          role: t.work.role,
          stack: t.work.stack,
          launch: t.work.launch,
          numbers: t.work.numbers,
          view: t.work.view,
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PreloaderProvider>
  );
}
