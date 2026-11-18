export interface MetaLink {
  label: string;
  href: string;
}

export interface MetaGroup {
  label: string;
  /** Plain lines, or links that open in a new tab. */
  values: readonly (string | MetaLink)[];
}

interface Props {
  groups: readonly MetaGroup[];
  /** Where the caller lays the groups out; they stack one under another by default. */
  className?: string;
}

/**
 * Label and value pairs (section 6.1): each group is a 5.5rem label column in muted and
 * its values in ink, one per line, with 16 px between groups. A value given as a link
 * shows an arrow and opens in a new tab; on a phone it keeps a 44 px target.
 */
export function MetaList({ groups, className = "" }: Props) {
  return (
    <dl className={`grid content-start gap-4 text-ui ${className}`}>
      {groups.map((group) => (
        <div key={group.label} className="grid grid-cols-[5.5rem_1fr]">
          <dt className="text-muted">{group.label}</dt>
          <dd>
            {group.values.map((value) =>
              typeof value === "string" ? (
                <span key={value} className="block">
                  {value}
                </span>
              ) : (
                <a
                  key={value.href}
                  href={value.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center underline decoration-line underline-offset-4
                    transition-colors duration-(--dur-fast) ease-(--ease) hover:decoration-ink
                    stage:min-h-6"
                >
                  {value.label} ↗
                </a>
              ),
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
