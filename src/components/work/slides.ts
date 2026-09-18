import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { projects, type Project } from "@/content/projects";
import type { Detail, GalleryLabels, Slide, WorkLabels } from "./types";

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

/** Projects resolved to one language, ready for the home discs. */
export function projectSlides(locale: Locale): Slide[] {
  return projects.map((p) => toSlide(p, locale));
}

/** The same projects with their full copy, for the Playground gallery. */
export function projectDetails(locale: Locale): Detail[] {
  return projects.map((p) => ({ ...toSlide(p, locale), body: p.body[locale], links: p.links ?? [] }));
}

export function workLabels(t: Dictionary): WorkLabels {
  return {
    selected: t.work.selected,
    role: t.work.role,
    stack: t.work.stack,
    launch: t.work.launch,
    numbers: t.work.numbers,
    view: t.work.view,
    open: t.work.open,
    prev: t.work.prev,
    next: t.work.next,
    hint: t.work.hint,
    hintStatic: t.work.hintStatic,
  };
}

export function galleryLabels(t: Dictionary): GalleryLabels {
  return {
    role: t.work.role,
    stack: t.work.stack,
    launch: t.work.launch,
    numbers: t.work.numbers,
    status: t.work.status,
    about: t.work.about,
    links: t.work.links,
    view: t.work.view,
    open: t.work.open,
    close: t.playground.close,
    prev: t.work.prev,
    next: t.work.next,
    hint: t.playground.hint,
  };
}
