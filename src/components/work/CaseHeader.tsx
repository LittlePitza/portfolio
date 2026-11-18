import { PageTitle } from "@/components/ui/PageTitle";
import { enterStep } from "@/components/ui/enterStep";

interface Props {
  /** "Plataforma interna · En producción". */
  eyebrow: string;
  name: string;
  /** The project's one-paragraph summary, set as the lead. */
  summary: string;
}

/**
 * What the project is and where it stands (section 6.4): the eyebrow over the title in
 * columns 1 to 4 and the summary in columns 5 to 8. Stacked on a phone. The title is the
 * page's `<h1>` and the first step of its entrance.
 */
export function CaseHeader({ eyebrow, name, summary }: Props) {
  return (
    <header className="page-grid gap-y-4 pt-8 stage:pt-12">
      <p data-enter style={enterStep(0)} className="col-span-4 text-ui text-muted stage:col-span-8">
        {eyebrow}
      </p>
      <PageTitle className="col-span-4">{name}</PageTitle>
      <p data-enter style={enterStep(1)} className="col-span-4 text-lead stage:col-start-5">
        {summary}
      </p>
    </header>
  );
}
