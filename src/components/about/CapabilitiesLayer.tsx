import type { Locale } from "@/i18n/config";
import { capabilities } from "@/content/profile";
import { Layer } from "@/components/ui/Layer";
import { MetaList } from "@/components/ui/MetaList";

/** Three columns of two capabilities, starting on grid lines 1, 4 and 7 (section 6.2). */
const PER_COLUMN = 2;
const COLUMN_START = ["stage:col-start-1", "stage:col-start-4", "stage:col-start-7"] as const;

interface Props {
  id: string;
  title: string;
  closeLabel: string;
  locale: Locale;
}

/** The Capabilities layer: each capability with its description and its groups of tools. */
export function CapabilitiesLayer({ id, title, closeLabel, locale }: Props) {
  const columns = COLUMN_START.map((start, index) => ({
    start,
    items: capabilities.slice(index * PER_COLUMN, (index + 1) * PER_COLUMN),
  }));

  return (
    <Layer id={id} title={title} closeLabel={closeLabel}>
      {columns.map((column) => (
        <div
          key={column.start}
          className={`col-span-4 grid content-start gap-12 stage:col-span-2 ${column.start}`}
        >
          {column.items.map((capability) => (
            <article key={capability.id} className="grid gap-4 border-t border-line pt-4">
              <h3 className="text-lead">{capability.title[locale]}</h3>
              <p className="text-body text-muted">{capability.description[locale]}</p>
              <MetaList
                groups={capability.groups.map((group) => ({
                  label: group.label[locale],
                  values: group.items[locale],
                }))}
              />
            </article>
          ))}
        </div>
      ))}
    </Layer>
  );
}
