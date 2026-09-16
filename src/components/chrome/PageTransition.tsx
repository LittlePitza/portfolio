"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { markNavigated } from "@/lib/navigation";
import { checkForUpdate, isStale } from "@/lib/version";
import { Character } from "@/components/preloader/Character";

interface Ctx {
  /** Run the transition to `href`, showing `label` as the destination's name. */
  go: (href: string, label: string) => void;
}

const TransitionContext = createContext<Ctx>({ go: () => {} });

export function useTransition() {
  return useContext(TransitionContext);
}

/** Panel travel, in percent of the viewport. Far enough that the tilted edges never linger on screen. */
const OFF = 135;
/** If the route never arrives, lift the panel anyway after this long. */
const SAFETY_MS = 6000;

/**
 * Page to page, in two acts.
 *
 * Leaving: the page dims, a tilted orange slab with hard ink edges sweeps up
 * from the bottom, the destination's address types in, its name rises in big
 * serif with a hollow echo, and the character walks in pushing a loading bar.
 *
 * Arriving: as soon as the new route has rendered and the first act has
 * landed, he pushes the bar to the end, the words leave upward, the slab
 * keeps travelling out through the top and the new page rises into place.
 * If the route is slow, the bar keeps creeping and he keeps walking.
 *
 * Only transforms set by GSAP itself are animated, so nothing is parsed from
 * CSS and the panel is never offset twice.
 */
export function PageTransition({ children, domain }: { children: React.ReactNode; domain: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [route, setRoute] = useState("");

  const pending = useRef<string | null>(null);
  const entered = useRef(false);
  const routeReady = useRef(false);
  const lastPath = useRef(pathname);
  const walk = useRef<gsap.core.Timeline | null>(null);
  const creep = useRef<gsap.core.Tween | null>(null);
  const progress = useRef({ value: 0 });
  const trackWidth = useRef(0);
  const safety = useRef<number | undefined>(undefined);

  /** Draw the loading bar and move the character to its leading edge. */
  const paint = useCallback(() => {
    const el = panel.current;
    if (!el) return;
    const p = progress.current.value;
    const fill = el.querySelector<HTMLElement>("[data-t-fill]");
    const walker = el.querySelector<HTMLElement>("[data-t-walker]");
    if (fill) fill.style.transform = `scaleX(${p})`;
    if (walker) walker.style.transform = `translateX(${p * trackWidth.current}px)`;
  }, []);

  const reveal = useCallback(() => {
    const el = panel.current;
    if (!el || !pending.current) return;
    const href = pending.current;
    pending.current = null;
    entered.current = false;
    routeReady.current = false;
    window.clearTimeout(safety.current);
    creep.current?.kill();

    const sel = gsap.utils.selector(el);
    const main = document.querySelector("main");
    const hash = href.includes("#") ? href.split("#")[1] : "";
    scrollTo(0, { immediate: true });

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        walk.current?.kill();
        walk.current = null;
        gsap.set(el, { visibility: "hidden", pointerEvents: "none" });
        progress.current.value = 0;
        paint();
        ScrollTrigger.refresh();
        if (hash) {
          const target = document.getElementById(hash);
          if (target) scrollTo(target);
        }
      },
    });

    tl.to(progress.current, { value: 1, duration: 0.3, ease: "power2.out", onUpdate: paint }, 0)
      .to(sel("[data-t-route]"), { yPercent: -120, autoAlpha: 0, duration: 0.35, ease: "expo.in" }, 0.12)
      .to(sel("[data-t-label]"), { yPercent: -115, duration: 0.45, ease: "expo.in" }, 0.12)
      .to(sel("[data-t-progress]"), { y: -24, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 0.2)
      .to(el, { yPercent: -OFF, duration: 0.75 }, 0.22);
    if (main) {
      tl.fromTo(main, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 0.85, ease: "expo.out", clearProps: "opacity,transform" }, 0.42);
    }
  }, [paint]);

  /** Navigate inside the app, unless a newer deployment is live: then load it for real. */
  const navigate = useCallback(
    async (href: string, update: Promise<boolean>) => {
      const newer = await Promise.race([update, new Promise<boolean>((resolve) => window.setTimeout(() => resolve(isStale()), 700))]);
      if (newer) {
        window.clearTimeout(safety.current);
        window.location.assign(new URL(href, window.location.origin));
        return;
      }
      router.push(href);
    },
    [router],
  );

  const go = useCallback(
    (href: string, text: string) => {
      const el = panel.current;
      const path = href.split("#")[0]!;
      if (pending.current) return;
      if (path === pathname || !el || prefersReducedMotion()) {
        markNavigated();
        if (isStale()) window.location.assign(new URL(href, window.location.origin));
        else router.push(href);
        return;
      }
      // Ask the live site for its version while the panel comes up.
      const update = checkForUpdate();

      markNavigated();
      pending.current = href;
      entered.current = false;
      routeReady.current = false;
      setLabel(text);
      setRoute(`${domain}${path}`);

      const sel = gsap.utils.selector(el);
      const main = document.querySelector("main");
      trackWidth.current = el.querySelector<HTMLElement>("[data-t-track]")?.getBoundingClientRect().width ?? 0;
      progress.current.value = 0;
      paint();

      // He walks for as long as the panel is up.
      walk.current?.kill();
      const legs = gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { duration: 0.2, ease: "sine.inOut" } })
        .fromTo(sel("[data-leg-back]"), { rotation: -14, svgOrigin: "150 262" }, { rotation: 20, svgOrigin: "150 262" }, 0)
        .fromTo(sel("[data-leg-front]"), { rotation: 16, svgOrigin: "182 268" }, { rotation: -14, svgOrigin: "182 268" }, 0);
      const bob = gsap.to(sel("[data-body]"), { y: -5, rotation: 1.5, svgOrigin: "170 270", duration: 0.1, repeat: -1, yoyo: true, ease: "sine.inOut" });
      walk.current = gsap.timeline().add(legs, 0).add(bob, 0);

      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          entered.current = true;
          if (routeReady.current) {
            reveal();
          } else {
            // Still loading: keep the bar moving so the wait reads as progress.
            creep.current = gsap.to(progress.current, { value: 0.92, duration: 4, ease: "power1.out", onUpdate: paint });
          }
        },
      });

      tl.set(el, { visibility: "visible", pointerEvents: "auto", yPercent: OFF })
        .set(sel("[data-t-route]"), { yPercent: 120, autoAlpha: 0 })
        .set(sel("[data-t-label]"), { yPercent: 115 })
        .set(sel("[data-t-progress]"), { y: 24, autoAlpha: 0 })
        .to(el, { yPercent: 0, duration: 0.62 }, 0)
        .to(sel("[data-t-route]"), { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" }, 0.26)
        .to(sel("[data-t-label]"), { yPercent: 0, duration: 0.55, ease: "expo.out" }, 0.3)
        .to(sel("[data-t-progress]"), { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" }, 0.36)
        .to(progress.current, { value: 0.6, duration: 0.45, ease: "power1.out", onUpdate: paint }, 0.4)
        .call(() => void navigate(href, update), [], 0.42);
      if (main) tl.to(main, { opacity: 0.3, duration: 0.5, ease: "power2.out" }, 0);

      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => {
        routeReady.current = true;
        if (entered.current) reveal();
      }, SAFETY_MS);
    },
    [domain, navigate, pathname, paint, reveal, router],
  );

  // A route change finished rendering.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    markNavigated();
    if (!pending.current) return;
    routeReady.current = true;
    if (entered.current) reveal();
  }, [pathname, reveal]);

  useEffect(() => () => window.clearTimeout(safety.current), []);

  const size = "text-[clamp(3rem,12vw,12rem)]";

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div ref={panel} aria-hidden className="pointer-events-none fixed inset-0 z-[55]" style={{ visibility: "hidden" }}>
        {/* Tilted slab, taller and wider than the viewport, with hard ink edges. */}
        <div className="absolute -inset-x-[6vw] -bottom-[20vh] -top-[20vh] -skew-y-3 border-y-[6px] border-ink bg-accent" />

        <div className="relative flex h-full flex-col items-center justify-center px-4 text-ink">
          <div className="overflow-hidden pb-1">
            <p data-t-route className="label flex items-center gap-2 text-sm">
              <span aria-hidden>→</span>
              <span>{route}</span>
              <span aria-hidden className="blink inline-block h-3.5 w-2 bg-ink" />
            </p>
          </div>

          <div className="relative mt-4 max-w-[94vw] overflow-hidden pb-[0.08em] pt-[0.16em] text-center">
            <span data-t-label className="relative block">
              <span aria-hidden className={`display outline absolute inset-0 translate-x-[0.05em] translate-y-[0.05em] ${size}`}>
                {label}
              </span>
              <span className={`display relative block ${size}`}>{label}</span>
            </span>
          </div>

          <div data-t-progress className="relative mt-24 w-[min(70vw,34rem)]">
            <div data-t-walker className="absolute bottom-full left-0">
              <div className="w-24 md:w-28" style={{ marginLeft: "-6.2rem" }}>
                <Character className="h-auto w-full" />
              </div>
            </div>
            <div data-t-track className="h-2.5 w-full border-2 border-ink bg-transparent">
              <div data-t-fill className="h-full w-full origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { label: string; children: React.ReactNode };

/** A `next/link` that prefetches as usual but navigates through the transition. */
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
