import { CurtainLink } from "@/components/chrome/Curtain";
import { enterStep } from "@/components/ui/enterStep";

interface Neighbour {
  name: string;
  href: string;
}

interface Props {
  /** "Proyectos", the navigation's accessible name. */
  label: string;
  previous: Neighbour;
  next: Neighbour;
  labels: { previous: string; next: string };
}

/**
 * On to the next project (section 6.4): previous on the left, next on the right, each a
 * link with the neighbour's name at heading size. Hovering one blurs the other (the
 * data-siblings rule in globals.css).
 */
export function CaseNav({ label, previous, next, labels }: Props) {
  return (
    <nav
      aria-label={label}
      data-siblings
      data-enter-view
      style={enterStep(0)}
      className="page-grid gap-y-8"
    >
      <CurtainLink href={previous.href} label={previous.name} className="col-span-4 block py-4">
        <span className="block text-ui text-muted">← {labels.previous}</span>
        <span className="block font-display text-heading">{previous.name}</span>
      </CurtainLink>
      <CurtainLink
        href={next.href}
        label={next.name}
        className="col-span-4 block py-4 stage:col-start-5 stage:text-right"
      >
        <span className="block text-ui text-muted">{labels.next} →</span>
        <span className="block font-display text-heading">{next.name}</span>
      </CurtainLink>
    </nav>
  );
}
