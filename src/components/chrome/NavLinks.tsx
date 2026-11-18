"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { shouldHandleNavigation } from "@/lib/navigation";
import { enterStep } from "@/components/ui/enterStep";
import { useCurtain } from "./Curtain";
import type { NavItem } from "./navItems";

interface Props {
  items: NavItem[];
  /** The home path, which is current only on itself, not on every page below it. */
  home: string;
  /** Serif 24/28 in the frame; title size in the menu layer, where the links also enter in turn. */
  size: "frame" | "layer";
  /** Runs before navigating, e.g. to close the layer that holds the links. */
  onNavigate?: () => void;
}

const LINK_SIZE = {
  frame: "min-h-7 text-lead leading-7",
  layer: "min-h-11 text-title",
} as const;

/**
 * The four links of the menu. The current page carries an arrow and aria-current;
 * hovering or focusing one blurs the others (the data-siblings rule in globals.css).
 * Every link goes through the curtain, which handles same-page links on its own.
 */
export function NavLinks({ items, home, size, onNavigate }: Props) {
  const pathname = usePathname();
  const { go } = useCurtain();
  const entersInTurn = size === "layer";

  return (
    // Each item hugs its link, so only the words are a target and blur their neighbours.
    <ul data-siblings className="grid justify-items-start">
      {items.map((item, index) => {
        const [path] = item.href.split("#");
        const isCurrent = path === home ? pathname === home : pathname.startsWith(path);
        return (
          <li
            key={item.href}
            data-enter={entersInTurn ? "" : undefined}
            style={entersInTurn ? enterStep(index) : undefined}
          >
            <Link
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex items-center font-display ${LINK_SIZE[size]}`}
              onClick={(event) => {
                if (!shouldHandleNavigation(event)) return;
                event.preventDefault();
                onNavigate?.();
                go(item.href, item.label);
              }}
            >
              {isCurrent && <span aria-hidden>→&nbsp;</span>}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
