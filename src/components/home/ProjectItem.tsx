import type { CSSProperties, ReactNode } from "react";
import { CurtainLink } from "@/components/chrome/Curtain";
import { Figure } from "@/components/ui/Figure";
import { MetaList } from "@/components/ui/MetaList";
import type { Slide } from "@/components/work/types";
import styles from "./carousel.module.css";

export interface ProjectItemLabels {
  /** "Trabajo seleccionado", after the counter on the stage. */
  counter: string;
  role: string;
  stack: string;
  launch: string;
  status: string;
  view: string;
}

interface Props {
  project: Slide;
  /** 1 to `total`, the project's place in the list and in the carousel. */
  position: number;
  total: number;
  /** The project's cover, drawn on the server. */
  cover: ReactNode;
  labels: ProjectItemLabels;
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * One project of Home's single list (section 6.1), rendered on the server: counter,
 * cover, name, main figure with the rest of the numbers, summary, metadata and the link
 * to the case. Stacked, it reads top to bottom; on the stage carousel.module.css lays
 * the same nodes out around the canvas, and the carousel only moves `data-active`.
 */
export function ProjectItem({ project, position, total, cover, labels }: Props) {
  const [figure, ...more] = project.numbers;
  const counter = `${pad(position)} / ${pad(total)}`;
  const titleId = `project-${project.slug}`;
  // The figure's size depends on its length, and the rest of the numbers align to it.
  const figureRoom = { "--chars": Array.from(figure?.value ?? "").length } as CSSProperties;

  return (
    <li data-item data-enter-view className={styles.item}>
      <article aria-labelledby={titleId} className={styles.article}>
        <p className={`${styles.kicker} text-ui text-muted tabular-nums`}>
          {counter} · {project.category}
        </p>
        <CurtainLink data-cover href={project.href} label={project.name} className={styles.cover}>
          {cover}
        </CurtainLink>
        <h3 id={titleId} className={`${styles.title} font-display text-heading`}>
          {project.name}
        </h3>

        <div className={styles.figures} style={figureRoom}>
          <p className={`${styles.counter} text-ui text-muted tabular-nums`}>
            {counter} · {labels.counter}
          </p>
          {figure && (
            <Figure
              value={figure.value}
              label={figure.label}
              className={styles.figure}
              valueClassName={styles.figureValue}
              charClassName={styles.figureChar}
              labelClassName={styles.figureLabel}
            />
          )}
          {more.length > 0 && (
            <ul className={`${styles.more} text-ui`}>
              {more.map((number) => (
                <li key={number.label}>
                  <span className="tabular-nums">{number.value}</span>{" "}
                  <span className="text-muted">{number.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={`${styles.summary} text-body`}>{project.summary}</p>
        <MetaList
          className={styles.meta}
          groups={[
            { label: labels.role, values: project.role },
            { label: labels.stack, values: project.stack },
            { label: labels.launch, values: [project.launch] },
            { label: labels.status, values: [project.status] },
          ]}
        />
        <CurtainLink href={project.href} label={project.name} className={`${styles.open} text-ui`}>
          {labels.view} <span aria-hidden>→</span>
        </CurtainLink>
      </article>
    </li>
  );
}
