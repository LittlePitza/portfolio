"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import {
  focusPageContent,
  markLinkNavigation,
  markNavigated,
  shouldHandleNavigation,
} from "@/lib/navigation";
import { checkForUpdate, isStale } from "@/lib/version";
import { Character } from "@/components/preloader/Character";
import { enterStep } from "@/components/ui/enterStep";
import styles from "./curtain.module.css";

interface CurtainApi {
  /** Navigate to `href` behind the curtain, which names the destination `title`. */
  go: (href: string, title: string) => void;
  /** Navigate straight away, with no curtain: language switches and same-page links. */
  jump: (href: string) => void;
}

/** Without a Curtain above (a page drawn outside the layout) links still navigate, plainly. */
const leave = (href: string) => window.location.assign(href);

const CurtainContext = createContext<CurtainApi>({ go: leave, jump: leave });

/** The navigation API of the nearest Curtain. */
export function useCurtain() {
  return useContext(CurtainContext);
}

/** Least time the curtain holds after rising, so the destination can be read (section 7.3). */
const MIN_WAIT = 0.35;
/** Share of the line drawn while the panel rises and holds. */
const LINE_HOLD = 0.7;
/** Where the line creeps to, and how slowly, while a late route is still on its way. */
const LINE_LATE = 0.92;
const LINE_LATE_S = 4;
/** If the route never arrives, lift the curtain anyway after this long. */
const SAFETY_MS = 6000;
/** How long a navigation waits for the version check before going ahead inside the app. */
const VERSION_WAIT_MS = 180;

/** Each leg's swing, in degrees, around its hip in the Character's viewBox. */
const LEGS = [
  { selector: "[data-leg-back]", from: -14, to: 20, svgOrigin: "150 262" },
  { selector: "[data-leg-front]", from: 16, to: -14, svgOrigin: "182 268" },
];

/** The character's walk: legs swinging and body bobbing, looped until killed. */
function walk(scope: HTMLElement) {
  const select = gsap.utils.selector(scope);
  const legs = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 0.2, ease: "sine.inOut" } });
  for (const { selector, from, to, svgOrigin } of LEGS) {
    legs.fromTo(select(selector), { rotation: from, svgOrigin }, { rotation: to, svgOrigin }, 0);
  }
  const bob = gsap.to(select("[data-body]"), {
    y: -5, rotation: 1.5, svgOrigin: "170 270", duration: 0.1, repeat: -1, yoyo: true, ease: "sine.inOut",
  });
  return gsap.timeline().add(legs, 0).add(bob, 0);
}

/** The destination's hash target, or the top of the page. */
function scrollToDestination(hash: string) {
  const target = hash ? document.getElementById(hash) : null;
  if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
  else window.scrollTo({ top: 0, behavior: "instant" });
}

interface Props {
  children: React.ReactNode;
  /** Shown before the path on the curtain, e.g. lhernandez.dev. */
  domain: string;
  /** Announced while the curtain is up; `{page}` becomes the destination's title. */
  loadingLabel: string;
}

/**
 * Page to page behind a paper curtain (section 7.3). It rises with the destination's
 * title and path, holds while the character pushes a line along the bottom, and leaves
 * through the top once the new route has rendered. Back and forward, same-page links,
 * language switches and reduced motion navigate at once instead. A newer deployment
 * turns the navigation into a full load, and a route that never arrives lifts it after
 * SAFETY_MS. Only transform and opacity move, and GSAP sets every transform it animates.
 */
export function Curtain({ children, domain, loadingLabel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const [destination, setDestination] = useState({ title: "", route: "", run: 0 });

  const pending = useRef<string | null>(null);
  const raised = useRef(false);
  const routeReady = useRef(false);
  const lowering = useRef(false);
  const lastPath = useRef(pathname);
  const mounted = useRef(true);
  const safety = useRef<number | undefined>(undefined);
  const scene = useRef<gsap.core.Timeline | null>(null);
  const creep = useRef<gsap.core.Tween | null>(null);
  const walking = useRef<gsap.core.Timeline | null>(null);
  const line = useRef({ value: 0, width: 0 });

  /** Draw the line and keep the character at its end. */
  const paint = useCallback(() => {
    const el = panel.current;
    if (!el) return;
    const { value, width } = line.current;
    el.querySelector<HTMLElement>("[data-fill]")!.style.transform = `scaleX(${value})`;
    el.querySelector<HTMLElement>("[data-walker]")!.style.transform = `translateX(${value * width}px)`;
  }, []);

  const finish = useCallback(
    (hash: string) => {
      const el = panel.current;
      pending.current = null;
      lowering.current = false;
      walking.current?.kill();
      walking.current = null;
      if (el) gsap.set(el, { visibility: "hidden", pointerEvents: "none" });
      line.current.value = 0;
      paint();
      setDestination((current) => ({ ...current, title: "" }));
      focusPageContent(hash);
    },
    [paint],
  );

  const lower = useCallback(() => {
    const el = panel.current;
    if (!el || !pending.current || lowering.current) return;
    const hash = new URL(pending.current, window.location.origin).hash.slice(1);
    lowering.current = true;
    raised.current = false;
    routeReady.current = false;
    window.clearTimeout(safety.current);
    creep.current?.kill();
    scrollToDestination(hash);

    scene.current = gsap
      .timeline({ defaults: { ease: EASE }, onComplete: () => finish(hash) })
      .to(line.current, { value: 1, duration: DUR.fast, onUpdate: paint })
      // The new page enters while the panel leaves.
      .call(() => document.documentElement.removeAttribute("data-curtain"))
      .to(el, { yPercent: -100, duration: DUR.base });
  }, [finish, paint]);

  /** Navigate inside the app, unless a newer deployment is live: then load it for real. */
  const navigate = useCallback(
    async (href: string, update: Promise<boolean>) => {
      let timeout: number | undefined;
      const late = new Promise<boolean>((resolve) => {
        timeout = window.setTimeout(() => resolve(isStale()), VERSION_WAIT_MS);
      });
      const newer = await Promise.race([update, late]);
      window.clearTimeout(timeout);
      if (!mounted.current) return;
      if (newer) {
        window.clearTimeout(safety.current);
        window.location.assign(new URL(href, window.location.origin));
        return;
      }
      router.push(href, { scroll: false });
    },
    [router],
  );

  const jump = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.origin);
      markLinkNavigation(href);
      if (isStale()) {
        window.location.assign(target);
        return;
      }
      router.push(href);
      if (target.pathname === window.location.pathname) {
        const hash = target.hash.slice(1);
        if (hash) document.getElementById(hash)?.scrollIntoView({ block: "start" });
        focusPageContent(hash);
      }
    },
    [router],
  );

  const go = useCallback(
    (href: string, title: string) => {
      const el = panel.current;
      const target = new URL(href, window.location.origin);
      if (pending.current) return;
      if (target.pathname === pathname || !el || prefersReducedMotion()) {
        jump(href);
        return;
      }
      // Ask the live site for its version while the panel comes up.
      const update = checkForUpdate();
      markLinkNavigation(href);
      pending.current = href;
      raised.current = false;
      routeReady.current = false;
      lowering.current = false;
      setDestination((current) => ({ title, route: `${domain}${target.pathname}`, run: current.run + 1 }));
      document.documentElement.setAttribute("data-curtain", "");

      line.current.width = el.querySelector<HTMLElement>("[data-track]")?.getBoundingClientRect().width ?? 0;
      line.current.value = 0;
      paint();
      walking.current?.kill();
      walking.current = walk(el);

      scene.current?.kill();
      scene.current = gsap
        .timeline({
          defaults: { ease: EASE },
          onComplete: () => {
            raised.current = true;
            if (routeReady.current) {
              lower();
              return;
            }
            creep.current = gsap.to(line.current, { value: LINE_LATE, duration: LINE_LATE_S, onUpdate: paint });
          },
        })
        .set(el, { visibility: "visible", pointerEvents: "auto", yPercent: 100 })
        .to(el, { yPercent: 0, duration: DUR.base }, 0)
        .to(line.current, { value: LINE_HOLD, duration: DUR.base + MIN_WAIT, onUpdate: paint }, 0)
        // Only once the panel covers the page, so the old page never swaps in view.
        .call(() => void navigate(href, update), [], DUR.base);

      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => {
        routeReady.current = true;
        if (raised.current) lower();
        // A rise that never got its frames (a page in the background) jumps to its end,
        // which navigates and, through onComplete, lowers the curtain.
        else scene.current?.progress(1);
      }, SAFETY_MS);
    },
    [domain, jump, lower, navigate, paint, pathname],
  );

  // A route change finished rendering.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    markNavigated();
    if (!pending.current) {
      focusPageContent(window.location.hash.slice(1));
      return;
    }
    routeReady.current = true;
    if (raised.current) lower();
  }, [pathname, lower]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(safety.current);
      scene.current?.kill();
      creep.current?.kill();
      walking.current?.kill();
      document.documentElement.removeAttribute("data-curtain");
    };
  }, []);

  const api = useMemo(() => ({ go, jump }), [go, jump]);
  const announcement = destination.title ? loadingLabel.replace("{page}", destination.title) : "";

  return (
    <CurtainContext.Provider value={api}>
      {children}
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <div ref={panel} data-curtain-panel aria-hidden className={styles.panel}>
        {/* A new key per navigation replays the entrance on the title and the path. */}
        <div key={destination.run} className="text-center">
          {/* 2.5 × the stagger: the 150 ms the title waits for the panel. */}
          <p data-enter style={enterStep(2.5)} className="font-display text-title">
            {destination.title}
          </p>
          <p data-enter style={enterStep(3.5)} className="mt-4 text-ui text-muted">
            {destination.route}
          </p>
        </div>
        <div data-track className={styles.track}>
          <div data-fill className={styles.fill} />
          <div data-walker className={styles.walker}>
            <Character className={styles.runner} />
          </div>
        </div>
      </div>
    </CurtainContext.Provider>
  );
}

type CurtainLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { label: string; children: React.ReactNode };

/** A `next/link` that prefetches as usual but navigates behind the curtain, titled `label`. */
export function CurtainLink({ label, onClick, href, children, ...rest }: CurtainLinkProps) {
  const { go } = useCurtain();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (!shouldHandleNavigation(event)) return;
        event.preventDefault();
        const target = new URL(event.currentTarget.href);
        go(`${target.pathname}${target.search}${target.hash}`, label);
      }}
    >
      {children}
    </Link>
  );
}
