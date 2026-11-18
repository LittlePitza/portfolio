import styles from "./carousel.module.css";

export interface NameEntry {
  name: string;
  category: string;
  summary: string;
}

interface Props {
  /** "Proyectos". */
  label: string;
  projects: readonly NameEntry[];
}

/**
 * The projects by name, on the stage only (section 6.1): category and name per button,
 * and for the active one a rule and its summary. Each button carries its position in
 * `data-go`, which the carousel reads; the summary repeats the article's own, so it is
 * hidden from assistive technology.
 */
export function NamesList({ label, projects }: Props) {
  return (
    <nav data-names aria-label={label} className={styles.names}>
      <ol data-siblings className={styles.namesList}>
        {projects.map((project, index) => (
          <li key={project.name} data-name-item className={styles.nameItem}>
            <button type="button" data-go={index + 1} className={styles.nameButton}>
              <span className="block text-ui text-muted">{project.category}</span>
              <span className="block font-display text-lead leading-7">{project.name}</span>
            </button>
            <p aria-hidden className={`${styles.nameSummary} text-ui`}>
              {project.summary}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
