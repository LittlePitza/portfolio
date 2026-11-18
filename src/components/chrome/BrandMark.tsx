import { Mark } from "@/components/ui/Mark";

/** The monogram as the frame shows it: a 28 px ink square with LH in the page colour (section 5.1). */
export function BrandMark() {
  return <Mark className="size-7 shrink-0" field="var(--color-ink)" ink="var(--color-bg)" />;
}
