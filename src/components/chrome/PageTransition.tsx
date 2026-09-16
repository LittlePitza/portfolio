"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";

interface Ctx {
  /** Cover the screen with the destination's name, then navigate. */
  go: (href: string, label: string) => void;
}

const TransitionContext = createContext<Ctx>({ go: () => {} });

export function useTransition() {
  return useContext(TransitionContext);
}

/**
 * A black curtain rises from the bottom carrying the name of where you are
 * going, the route changes underneath, and the curtain lifts away.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const pending = useRef<string | null>(null);

  const go = useCallback(
    (href: string, text: string) => {
      const path = href.split("#")[0]!;
      if (path === pathname || prefersReducedMotion() || !overlay.current) {
        router.push(href);
        return;
      }
      setLabel(text);
      pending.current = href;
      gsap
        .timeline()
        .set(overlay.current, { pointerEvents: "auto" })
        .fromTo(overlay.current, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "expo.inOut" })
        .fromTo("[data-transition-label]", { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: "expo.out" }, "-=0.25")
        .call(() => router.push(href), [], "-=0.1");
    },
    [pathname, router],
  );

  // The new route has rendered: reveal it.
  useEffect(() => {
    if (!pending.current || !overlay.current) return;
    pending.current = null;
    scrollTo(0, { immediate: true });
    // Label and curtain leave together, so the screen is never plain black.
    gsap
      .timeline({ delay: 0.05 })
      .to("[data-transition-label]", { yPercent: -110, duration: 0.45, ease: "expo.in" })
      .to(overlay.current, { yPercent: -100, duration: 0.55, ease: "expo.inOut" }, "-=0.4")
      .set(overlay.current, { pointerEvents: "none", yPercent: 100 });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div
        ref={overlay}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center bg-ink text-bg"
        style={{ transform: "translateY(100%)" }}
      >
        <span className="display overflow-hidden px-4 text-center text-[clamp(3rem,14vw,14rem)]">
          <span data-transition-label className="block">
            {label}
          </span>
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { label: string; children: React.ReactNode };

/** A `next/link` that prefetches as usual but navigates through the curtain. */
export function TransitionLink({ label, onClick, href, children, ...rest }: Props) {
  const { go } = useTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(typeof href === "string" ? href : String(href), label);
      }}
    >
      {children}
    </Link>
  );
}
