import type { Locale } from "@/i18n/config";
import { process } from "@/content/profile";
import { Layer } from "@/components/ui/Layer";

const ROW = "col-span-full grid grid-cols-subgrid gap-y-2 border-t border-line pt-4";

interface Props {
  id: string;
  title: string;
  closeLabel: string;
  locale: Locale;
}

/**
 * The "Cómo construyo" layer (section 6.2): one row per step, the step's number in muted
 * serif on column 1, its title on 2 to 5 and its text on 6 to 8.
 */
export function ProcessLayer({ id, title, closeLabel, locale }: Props) {
  return (
    <Layer id={id} title={title} closeLabel={closeLabel}>
      <ol className="col-span-full grid grid-cols-subgrid gap-y-12">
        {process[locale].map((step) => (
          <li key={step.step} className={ROW}>
            <span className="col-span-4 font-display text-heading text-muted stage:col-span-1">
              {step.step}
            </span>
            <h3 className="col-span-4 font-display text-heading">{step.title}</h3>
            <p className="col-span-4 max-w-[68ch] text-body stage:col-span-3">{step.text}</p>
          </li>
        ))}
      </ol>
    </Layer>
  );
}
