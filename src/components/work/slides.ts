import type { Locale } from "@/i18n/config";
import { projects, type Project } from "@/content/projects";
import type { Detail, Slide } from "./types";

function toSlide(p: Project, locale: Locale): Slide {
  return {
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
  };
}

/** Projects resolved to one language, ready for Home's list and carousel and for the index. */
export function projectSlides(locale: Locale): Slide[] {
  return projects.map((p) => toSlide(p, locale));
}

/** One project with its full copy, for its case study. */
export function projectDetail(project: Project, locale: Locale): Detail {
  return { ...toSlide(project, locale), body: project.body[locale], links: project.links ?? [] };
}
