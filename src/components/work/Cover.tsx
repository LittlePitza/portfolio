import type { Locale } from "@/i18n/config";
import type { Project } from "@/content/projects";
import { drawings } from "./covers";
import { Plate } from "./covers/Plate";
import frame from "./covers/plate.module.css";

interface Props {
  project: Project;
  index: number;
  locale: Locale;
}

/**
 * A project's cover: its app recreated in HTML and CSS, with demo data, on a
 * mat of the project's colour. It fills whatever box it is put in. Rendered on
 * the server; the wheel and the gallery receive it already drawn, so none of
 * the drawings ship as JavaScript.
 */
export function Cover({ project, index, locale }: Props) {
  const Drawing = drawings[project.slug];
  return (
    <Plate
      caption={`${project.slug} · ${project.coverCaption[locale]}`}
      figure={`Fig. ${String(index + 1).padStart(2, "0")}`}
      color={project.color}
      alt={project.coverAlt[locale]}
    >
      {Drawing ? <Drawing locale={locale} /> : <span className={frame.fallback}>{project.name}</span>}
    </Plate>
  );
}
