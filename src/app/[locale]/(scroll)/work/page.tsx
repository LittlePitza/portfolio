import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { projects } from "@/content/projects";
import { PageTitle } from "@/components/ui/PageTitle";
import { enterStep } from "@/components/ui/enterStep";
import { Cover } from "@/components/work/Cover";
import { IndexPreview } from "@/components/work/IndexPreview";
import { IndexTable } from "@/components/work/IndexTable";
import { projectSlides } from "@/components/work/slides";
import { localizedPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return localizedPageMetadata({
    locale,
    path: "/work",
    title: t.index.title,
    description: t.index.description,
  });
}

/**
 * The index (section 6.5): the nine projects in one table, to compare them and open one.
 * It is also the way to every project without the Home carousel.
 */
export default async function IndexPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <article>
      <header className="page-grid gap-y-4 pt-8 stage:pt-12">
        <PageTitle className="col-span-4 stage:col-span-3">{t.index.title}</PageTitle>
        <p data-enter style={enterStep(1)} className="col-span-4 text-lead stage:col-start-5">
          {t.index.lead}
        </p>
      </header>

      <div data-enter style={enterStep(2)} className="mt-8 stage:mt-12">
        <IndexPreview
          covers={projects.map((project, index) => (
            <Cover key={project.slug} project={project} index={index} locale={locale} />
          ))}
        >
          <IndexTable projects={projectSlides(locale)} columns={t.index.cols} caption={t.index.title} />
        </IndexPreview>
      </div>
    </article>
  );
}
