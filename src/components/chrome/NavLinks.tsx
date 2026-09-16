"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollTo } from "@/lib/scroll";
import { useTransition } from "./PageTransition";
import { openContact } from "./ContactOverlay";
import { prefersReducedMotion } from "@/lib/gsap";
import { shouldHandleNavigation } from "@/lib/navigation";

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
    <ul className="nav grid grid-cols-2 gap-x-4 md:block md:space-y-1">
      {items.map((item) => {
        const path = item.href.split("#")[0]!;
        const isHome = path === home;
        const current = !item.overlay && (isHome ? pathname === home : pathname.startsWith(path));
        return (
          <li key={item.href} className="nav-item" aria-current={current ? "page" : undefined}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              aria-haspopup={item.overlay ? "dialog" : undefined}
              aria-controls={item.overlay ? "contact-dialog" : undefined}
              className="display flex min-h-11 items-center whitespace-nowrap text-xl leading-none md:min-h-7 md:text-2xl"
              onClick={(e) => {
                if (!shouldHandleNavigation(e)) return;
                if (item.overlay === "contact") {
                  e.preventDefault();
                  openContact();
                  return;
                }
                if (item.anchor && pathname === home) {
                  const el = document.getElementById(item.anchor);
                  if (el) {
                    e.preventDefault();
                    window.history.replaceState(window.history.state, "", item.href);
                    scrollTo(el, { immediate: prefersReducedMotion() });
                    el.tabIndex = -1;
                    el.focus({ preventScroll: true });
                  }
                  return;
                }
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
