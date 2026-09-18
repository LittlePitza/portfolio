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
  coverAlt?: string;
}

export interface WorkLabels {
  selected: string;
  role: string;
  stack: string;
  launch: string;
  numbers: string;
  view: string;
  open: string;
  prev: string;
  next: string;
  hint: string;
  /** The same invitation for a wheel that scrolling does not drive. */
  hintStatic: string;
}

/** A project with its full case-study copy, for the Playground gallery. */
export interface Detail extends Slide {
  body: string[];
  links: { label: string; href: string }[];
}

export interface GalleryLabels {
  role: string;
  stack: string;
  launch: string;
  numbers: string;
  status: string;
  about: string;
  links: string;
  view: string;
  open: string;
  close: string;
  prev: string;
  next: string;
  hint: string;
}
