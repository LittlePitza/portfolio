import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { PreloaderProvider } from "@/components/preloader/PreloaderContext";
import { Preloader } from "@/components/preloader/Preloader";
import { DiscStage } from "@/components/work/DiscStage";
import { projectSlides, workLabels } from "@/components/work/slides";

/** One idea, like huyml: the opening, then the projects spinning past like records. */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

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
      <Preloader label={t.frame.loading} />
      <DiscStage slides={projectSlides(locale)} labels={workLabels(t)} deep={{ href: `/${locale}/playground`, label: t.work.deep }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PreloaderProvider>
  );
}
