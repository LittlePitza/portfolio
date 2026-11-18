import { CurtainLink } from "@/components/chrome/Curtain";
import type { Slide } from "./types";

interface Props {
  projects: readonly Slide[];
  /** The seven column titles, in order: number, project, category, stack, year, status, figure. */
  columns: readonly string[];
  /** The table's accessible name. */
  caption: string;
}

/** Stack entries shown per row. */
const STACK_SHOWN = 3;

/** Where each column starts on the stage's 8-column grid (section 6.5). */
const STAGE_COLUMN = [
  "stage:col-span-1 stage:col-start-1",
  "stage:col-span-1 stage:col-start-2",
  "stage:col-span-1 stage:col-start-3",
  "stage:col-span-2 stage:col-start-4",
  "stage:col-span-1 stage:col-start-6",
  "stage:col-span-1 stage:col-start-7",
  "stage:col-span-1 stage:col-start-8",
] as const;

/** One row's cells on a phone (4 columns): number and category, name, figure and status. */
const PHONE_CELL = {
  number: "col-start-1 row-start-1 text-muted",
  name: "col-span-4 row-start-2",
  category: "col-span-3 col-start-2 row-start-1 text-muted stage:text-ink",
  stack: "hidden stage:block",
  year: "hidden stage:block",
  status: "col-span-2 col-start-3 row-start-3",
  figure: "col-span-2 col-start-1 row-start-3",
} as const;

const pad = (value: number) => String(value).padStart(2, "0");

/** A body cell's classes: where it sits on a phone, its stage column and its extras. */
const cell = (phone: string, column: number, extra = "text-ui") =>
  `${phone} ${STAGE_COLUMN[column]} stage:row-start-1 ${extra}`;

/**
 * The nine projects as a table (section 6.5): one row each, the whole row a link to the
 * case study. Table parts are laid on the page grid so every column starts on a grid
 * line, which is why they carry their roles explicitly: a display other than table
 * would otherwise drop the semantics in some browsers. On a phone each row is a block
 * of three lines and the stack and year are left out. Rows are `data-row`, which
 * IndexPreview reads to know which project the pointer is on.
 */
export function IndexTable({ projects, columns, caption }: Props) {
  return (
    <table role="table" className="page-grid">
      <caption className="sr-only">{caption}</caption>
      <thead role="rowgroup" className="col-span-full grid grid-cols-subgrid">
        <tr
          role="row"
          className="col-span-full grid grid-cols-subgrid border-line text-ui text-muted stage:border-b stage:pb-2"
        >
          {columns.map((title, index) => (
            <th
              key={title}
              role="columnheader"
              scope="col"
              className={`sr-only text-left font-normal stage:not-sr-only ${STAGE_COLUMN[index]}`}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup" data-siblings className="col-span-full grid grid-cols-subgrid">
        {projects.map((project, index) => {
          const [figure] = project.numbers;
          return (
            <tr
              key={project.slug}
              role="row"
              data-row={index}
              className="relative col-span-full grid grid-cols-subgrid content-center gap-y-1 border-b
                border-line py-4 stage:min-h-16 stage:items-center stage:py-0"
            >
              <td role="cell" className={cell(PHONE_CELL.number, 0, "text-ui tabular-nums")}>
                {pad(index + 1)}
              </td>
              <td role="cell" className={cell(PHONE_CELL.name, 1, "font-display text-lead leading-7")}>
                <CurtainLink
                  href={project.href}
                  label={project.name}
                  className="block after:absolute after:inset-0"
                >
                  {project.name}
                </CurtainLink>
              </td>
              <td role="cell" className={cell(PHONE_CELL.category, 2)}>
                {project.category}
              </td>
              <td role="cell" className={cell(PHONE_CELL.stack, 3)}>
                {project.stack.slice(0, STACK_SHOWN).join(" · ")}
              </td>
              <td role="cell" className={cell(PHONE_CELL.year, 4, "text-ui tabular-nums")}>
                {project.launch}
              </td>
              <td role="cell" className={cell(PHONE_CELL.status, 5)}>
                {project.status}
              </td>
              <td role="cell" className={cell(PHONE_CELL.figure, 6, "text-ui tabular-nums")}>
                {figure && (
                  <>
                    <span>{figure.value}</span> <span className="text-muted">{figure.label}</span>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
