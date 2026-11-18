import type { CSSProperties } from "react";

export interface AboutColumn {
  title: string;
  /** The detail layer the heading opens, when the column has one. */
  layer?: { id: string; label: string };
  rows: readonly { text: string; aside?: string }[];
}

/** The lists enter after the title, statement, portrait and figures (section 7.1). */
const FIRST_STEP = 4;
const HEADING_ROW = "flex min-h-11 items-center stage:min-h-6";
const HEADING_LINK = "transition-colors duration-(--dur-fast) ease-(--ease) hover:text-ink";

/**
 * About's four lists (section 6.2): a muted heading over rows in ink, two by two below the
 * stage and side by side on it, two grid columns each. A heading with a layer is a link
 * to its anchor, which opens the layer, or without scripts jumps to it.
 */
export function AboutColumns({ columns }: { columns: readonly AboutColumn[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-(--gap) gap-y-8 text-ui stage:grid-cols-4">
      {columns.map((column, index) => (
        <section key={column.title} data-enter style={{ "--i": FIRST_STEP + index } as CSSProperties}>
          <h2 className="mb-2 flex text-muted">
            {column.layer ? (
              <a
                href={`#${column.layer.id}`}
                aria-label={column.layer.label}
                className={`${HEADING_ROW} ${HEADING_LINK}`}
              >
                {column.title}&nbsp;<span aria-hidden>+</span>
              </a>
            ) : (
              <span className={HEADING_ROW}>{column.title}</span>
            )}
          </h2>
          <ul>
            {column.rows.map((row) => (
              <li key={row.text} className="flex justify-between gap-4">
                <span>{row.text}</span>
                {row.aside && <span className="shrink-0 text-muted tabular-nums">{row.aside}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
