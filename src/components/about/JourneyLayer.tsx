import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { education, experience, languages } from "@/content/profile";
import { Layer } from "@/components/ui/Layer";
import { MetaList, type MetaGroup } from "@/components/ui/MetaList";
import { formatRange } from "./dates";

interface Props {
  id: string;
  title: string;
  closeLabel: string;
  locale: Locale;
  labels: Pick<
    Dictionary["about"],
    "present" | "responsibilities" | "achievements" | "education" | "languages"
  >;
}

const ROW = "col-span-full grid grid-cols-subgrid gap-y-4 border-t border-line pt-4";
const SIDE = "col-span-4 text-ui stage:col-span-2";
const MAIN = "col-span-4 grid content-start gap-4 stage:col-span-6";

/** Education as metadata groups, one per status ("En curso"), each title with its school. */
function educationByStatus(locale: Locale): MetaGroup[] {
  const groups = new Map<string, string[]>();
  for (const item of education) {
    const status = item.status[locale];
    groups.set(status, [...(groups.get(status) ?? []), `${item.title[locale]} · ${item.institution}`]);
  }
  return Array.from(groups, ([label, values]) => ({ label, values }));
}

function BodyList({ heading, items }: { heading: string; items: readonly string[] }) {
  return (
    <div>
      <p className="mb-2 text-ui text-muted">{heading}</p>
      <ul className="grid gap-2 text-body">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The Journey layer (section 6.2): one row per role, dates and place on columns 1 and 2,
 * company, title, summary, then responsibilities and achievements side by side on 3 to 8;
 * education and languages close it as a metadata list.
 */
export function JourneyLayer({ id, title, closeLabel, locale, labels }: Props) {
  return (
    <Layer id={id} title={title} closeLabel={closeLabel}>
      <ol className="col-span-full grid grid-cols-subgrid gap-y-12">
        {experience.map((role) => (
          <li key={role.company + role.from} className={ROW}>
            <p className={SIDE}>
              <span className="block tabular-nums">
                {formatRange(role.from, role.to, locale, labels.present)}
              </span>
              <span className="block text-muted">{role.place[locale]}</span>
            </p>
            <div className={MAIN}>
              <div>
                <h3 className="font-display text-heading">{role.company}</h3>
                <p className="text-lead">{role.title[locale]}</p>
              </div>
              <p className="max-w-[68ch] text-body">{role.summary[locale]}</p>
              <div className="grid gap-8 stage:grid-cols-2 stage:gap-(--gap)">
                {role.responsibilities && (
                  <BodyList heading={labels.responsibilities} items={role.responsibilities[locale]} />
                )}
                {role.achievements && (
                  <BodyList heading={labels.achievements} items={role.achievements[locale]} />
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section aria-labelledby={`${id}-education`} className={ROW}>
        <h3 id={`${id}-education`} className={SIDE}>
          {labels.education}
        </h3>
        <MetaList
          className={MAIN}
          groups={[...educationByStatus(locale), { label: labels.languages, values: [languages[locale]] }]}
        />
      </section>
    </Layer>
  );
}
