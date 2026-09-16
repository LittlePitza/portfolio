import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { projects } from "@/content/projects";
import type { Slide, WorkLabels } from "./types";

/** Projects resolved to one language, ready for the home discs and the Playground catalogue. */
export function projectSlides(locale: Locale): Slide[] {
  return projects.map((p) => ({
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
  };
}
