import type { CSSProperties } from "react";

interface Props {
  value: string;
  label: string;
  className?: string;
  /** Classes for the value, each of its characters (which a caller can roll in turn) and the label. */
  valueClassName?: string;
  charClassName?: string;
  labelClassName?: string;
}

/**
 * A figure at display size with its label pegged to its right, top-aligned (section 1, A).
 * The value is split into characters, each with its index in `--i` and the count in
 * `--chars`, so CSS can stagger them and shrink a long value to its room. Assistive
 * technology reads the whole value once, never the characters.
 */
export function Figure({
  value,
  label,
  className = "",
  valueClassName = "",
  charClassName = "",
  labelClassName = "",
}: Props) {
  const chars = Array.from(value);

  return (
    <p className={`flex items-start gap-3 ${className}`}>
      <span
        className={`inline-flex font-display text-figure tabular-nums ${valueClassName}`}
        style={{ "--chars": chars.length } as CSSProperties}
      >
        <span className="sr-only">{value}</span>
        {chars.map((char, index) => (
          <span key={index} aria-hidden className={charClassName} style={{ "--i": index } as CSSProperties}>
            {char}
          </span>
        ))}
      </span>
      <span className={`text-ui ${labelClassName}`}>{label}</span>
    </p>
  );
}
