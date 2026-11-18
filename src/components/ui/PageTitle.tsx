import type { CSSProperties, ReactNode } from "react";

/**
 * The page's one `<h1>` at title size (section 3.2). It is the first step of the page's
 * entrance (section 7.1), so whatever follows starts its `--i` at 1.
 */
export function PageTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1 data-enter style={{ "--i": 0 } as CSSProperties} className={`font-display text-title ${className}`}>
      {children}
    </h1>
  );
}
