import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { projects as content } from "@/content/projects";
import { Cover } from "@/components/work/Cover";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { galleryLabels, projectDetails } from "@/components/work/slides";
import styles from "@/components/work/gallery.module.css";
import { localizedPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/playground">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return localizedPageMetadata({ locale, path: "/playground", title: t.playground.title, description: t.playground.description });
}

/** The projects and nothing else: all of them at once, any one of them in full. */
export default async function PlaygroundPage({ params }: PageProps<"/[locale]/playground">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);
  const projects = projectDetails(locale);
  const count = String(projects.length).padStart(2, "0");

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headTop}>
          <p className="label">{t.playground.kicker}</p>
          <p className="label text-muted">
            {count} {t.playground.projects}
          </p>
        </div>
        <h1 className={styles.title}>{t.playground.title}</h1>
        <div className={styles.headBottom}>
          <p className={styles.lead}>{t.playground.lead}</p>
          <p className={`label ${styles.hint}`}>{t.playground.hint}</p>
        </div>
      </header>

      <ProjectGallery
        projects={projects}
        covers={content.map((project, index) => <Cover key={project.slug} project={project} index={index} locale={locale} />)}
        labels={galleryLabels(t)}
      />
    </div>
  );
}
