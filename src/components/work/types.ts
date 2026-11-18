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
}

/** A project with its full case-study copy. */
export interface Detail extends Slide {
  body: string[];
  links: { label: string; href: string }[];
}
