import { enterStep } from "@/components/ui/enterStep";

interface Props {
  /** "Cifras", the list's accessible name. */
  label: string;
  numbers: readonly { value: string; label: string }[];
}

/**
 * The project's evidence (section 6.4): up to four figures at title size, two columns
 * each, with their label in muted underneath. No boxes. Each enters when it comes into
 * view (the page mounts EnterOnView).
 */
export function CaseNumbers({ label, numbers }: Props) {
  return (
    <ul aria-label={label} className="page-grid gap-y-8">
      {numbers.map((number, index) => (
        <li key={number.label} data-enter-view style={enterStep(index)} className="col-span-2">
          <span className="block font-display text-title tabular-nums">{number.value}</span>
          <span className="mt-2 block text-ui text-muted">{number.label}</span>
        </li>
      ))}
    </ul>
  );
}
