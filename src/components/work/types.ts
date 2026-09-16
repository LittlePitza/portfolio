/** A project already resolved to one locale, safe to hand to client components. */
export interface Slide {
  slug: string;
  href: string;
  name: string;
  category: string;
  role: string[];
  stack: string[];
  launch: string;
  status: string;
  numbers: { value: string; label: string }[];
  summary: string;
  color: string;
  cover?: string;
}

export interface WorkLabels {
  selected: string;
  role: string;
  stack: string;
  launch: string;
  numbers: string;
  view: string;
}
