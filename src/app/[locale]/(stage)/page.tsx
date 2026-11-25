import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { WORK_ANCHOR } from "@/lib/navigation";
import { PreloaderProvider } from "@/components/preloader/PreloaderContext";
import { Preloader } from "@/components/preloader/Preloader";
import { Canvas } from "@/components/home/Canvas";
import { NamesList } from "@/components/home/NamesList";
import { Portada } from "@/components/home/Portada";
import { ProjectItem } from "@/components/home/ProjectItem";
import styles from "@/components/home/carousel.module.css";
import { EnterOnView } from "@/components/ui/EnterOnView";
import { Cover } from "@/components/work/Cover";
import { projectSlides } from "@/components/work/slides";

/** Home (section 6.1): the cover screen and the nine projects, one DOM for both layouts. */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);
  const slides = projectSlides(locale);

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

  const itemLabels = {
    counter: t.work.counter,
    role: t.work.role,
    stack: t.work.stack,
    launch: t.work.launchShort,
    status: t.work.status,
    view: t.work.view,
  };

  return (
    <PreloaderProvider>
      <Preloader label={t.frame.loading} skipLabel={t.frame.skip} />
      <Canvas announce={t.work.announce} names={slides.map((slide) => slide.name)}>
        <Portada
          eyebrow={t.hero.eyebrow}
          tagline={t.hero.tagline}
          sub={t.hero.sub}
          cta={t.hero.ctaWork}
          portrait={{ href: `/${locale}/about`, label: t.hero.portrait, destination: t.nav.about }}
        />
        <h2 id="work-title" className="sr-only">
          {t.work.selected}
        </h2>
        <ol id={WORK_ANCHOR} tabIndex={-1} aria-labelledby="work-title" className={styles.list}>
          {slides.map((slide, index) => (
            <ProjectItem
              key={slide.slug}
              project={slide}
              position={index + 1}
              total={slides.length}
              cover={<Cover project={projects[index]} index={index} locale={locale} />}
              labels={itemLabels}
            />
          ))}
        </ol>
        <NamesList label={t.work.projects} projects={slides} />
      </Canvas>
      <EnterOnView />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PreloaderProvider>
  );
}
