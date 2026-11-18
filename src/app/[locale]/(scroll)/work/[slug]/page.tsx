import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProject, projects } from "@/content/projects";
import { EnterOnView } from "@/components/ui/EnterOnView";
import { MetaList, type MetaGroup } from "@/components/ui/MetaList";
import { enterStep } from "@/components/ui/enterStep";
import { CaseHeader } from "@/components/work/CaseHeader";
import { CaseNav } from "@/components/work/CaseNav";
import { CaseNumbers } from "@/components/work/CaseNumbers";
import { Cover } from "@/components/work/Cover";
import { projectDetail, projectSlides } from "@/components/work/slides";
import { localizedPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// An unknown slug is not rendered here: it falls through to the catch-all, which draws the
// 404 inside the full layout instead of the bare shell notFound() would answer with.
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) return {};
  return localizedPageMetadata({
    locale,
    path: `/work/${slug}`,
    title: project.name,
    description: project.summary[locale],
  });
}

/**
 * A case study (section 6.4): what the project is, its figures, its cover large enough to
 * read, the technical text beside a metadata column that stays put, and on to the next
 * project. Everything under the header enters as it comes into view.
 */
export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const t = getDictionary(locale);
  const detail = projectDetail(project, locale);
  const slides = projectSlides(locale);
  const previous = slides[(index - 1 + slides.length) % slides.length]!;
  const next = slides[(index + 1) % slides.length]!;

  const meta: MetaGroup[] = [
    { label: t.work.role, values: detail.role },
    { label: t.work.stack, values: detail.stack },
    { label: t.work.launchShort, values: [detail.launch] },
    { label: t.work.status, values: [detail.status] },
    ...(detail.links.length > 0 ? [{ label: t.work.links, values: detail.links }] : []),
  ];

  return (
    <article>
      <EnterOnView />
      <CaseHeader
        eyebrow={`${detail.category} · ${detail.status}`}
        name={detail.name}
        summary={detail.summary}
      />

      <div data-enter-view style={enterStep(2)} className="page-grid mt-8 stage:mt-12">
        <div className="col-span-4 aspect-[4/3] w-full stage:col-span-8 stage:aspect-video stage:max-h-[72svh]">
          <Cover project={project} index={index} locale={locale} />
        </div>
      </div>

      <div className="mt-12 stage:mt-24">
        <CaseNumbers label={t.work.numbers} numbers={detail.numbers} />
      </div>

      <section className="page-grid mt-24 stage:mt-40">
        <div
          data-enter-view
          className="col-span-4 stage:sticky stage:top-24 stage:col-span-2 stage:self-start"
        >
          <MetaList groups={meta} />
        </div>
        <div
          data-enter-view
          style={enterStep(1)}
          className="col-span-4 mt-8 stage:col-span-3 stage:col-start-4 stage:mt-0"
        >
          <h2 className="text-ui text-muted">{t.work.about}</h2>
          <div className="mt-2 grid max-w-[68ch] gap-4 text-body">
            {detail.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-24 stage:mt-40">
        <CaseNav
          label={t.work.projects}
          previous={previous}
          next={next}
          labels={{ previous: t.work.prev, next: t.work.next }}
        />
      </div>
    </article>
  );
}
