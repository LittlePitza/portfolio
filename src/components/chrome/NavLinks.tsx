"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollTo } from "@/lib/scroll";
import { useTransition } from "./PageTransition";
import { openContact } from "./ContactOverlay";

interface Item {
  href: string;
  label: string;
  /** Element id to scroll to when the link points at the current page. */
  anchor?: string;
  /** Open the contact cards instead of navigating. */
  overlay?: "contact";
}

/**
 * Primary navigation. The current page carries an arrow; hovering one item
 * softly blurs the others; the Work link scrolls in place on the home page;
 * Contact opens the floating cards; everything else goes through the curtain.
 */
export function NavLinks({ items, home }: { items: Item[]; home: string }) {
  const pathname = usePathname();
  const { go } = useTransition();

  return (
    <ul className="nav flex gap-4 md:block md:space-y-1">
      {items.map((item) => {
        const path = item.href.split("#")[0]!;
        const isHome = path === home;
        const current = !item.overlay && (isHome ? pathname === home : pathname.startsWith(path));
        return (
          <li key={item.href} className="nav-item" aria-current={current ? "page" : undefined}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className="display flex items-center text-xl leading-none md:text-2xl"
              onClick={(e) => {
                if (item.overlay === "contact") {
                  e.preventDefault();
                  openContact();
                  return;
                }
                if (item.anchor && pathname === home) {
                  const el = document.getElementById(item.anchor);
                  if (el) {
                    e.preventDefault();
                    scrollTo(el);
                  }
                  return;
                }
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                go(item.href, item.label);
              }}
            >
              <span aria-hidden className="nav-arrow">
                →
              </span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
