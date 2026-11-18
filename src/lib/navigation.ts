/** Where Home remembers its position for the tab, and the mark the head script puts on <html>. */
export const HOME_POSITION_KEY = "home:position";
export const HOME_POSITION_ATTR = "data-home-position";

/** The id of Home's project list: every "Trabajo" link points at it (section 6.1). */
export const WORK_ANCHOR = "work";

/**
 * Whether the visitor has moved inside the site since the document loaded.
 * The opening sequence must only play on a real page load of the home, never
 * after a client-side route change, whichever link caused it.
 */
let navigated = false;

/** Captured when this module first runs in the browser, which is during hydration of the first document. */
const initialPathname = typeof window === "undefined" ? null : window.location.pathname;

/**
 * Whether the route being entered was reached by a back or forward (popstate) rather than
 * by a link, so Home reopens the project it left only on a return (section 7.4). Every
 * link navigation clears it as it starts, wherever the traversals before it landed.
 */
let traversed = false;

/**
 * The hash of the link navigation on its way, null when none is. The new route renders
 * before Next writes its URL, so until then `location.hash` still shows the old page's.
 */
let linkHash: string | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    traversed = true;
    linkHash = null;
  });
}

export function markNavigated() {
  navigated = true;
}

/** A link navigation to `href` starts (the curtain's go and jump): its destination is not a return. */
export function markLinkNavigation(href: string) {
  navigated = true;
  traversed = false;
  linkHash = new URL(href, window.location.origin).hash;
}

export function wasTraversed() {
  return traversed;
}

/** The hash of the route being entered: the link's own while one is on its way, else the URL's. */
export function destinationHash() {
  return linkHash ?? window.location.hash;
}

/** Called once the route has read its hash, so a link's hash cannot reach a later navigation. */
export function forgetLinkHash() {
  linkHash = null;
}

export function hasNavigated() {
  if (navigated) return true;
  if (typeof window === "undefined" || initialPathname === null) return false;
  return window.location.pathname !== initialPathname;
}

/** Preserve the browser's open-in-new-tab, download, and external-link behavior. */
export function shouldHandleNavigation(event: {
  defaultPrevented: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
  currentTarget: HTMLAnchorElement;
}) {
  const link = event.currentTarget;
  return !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
    && event.button === 0 && !link.hasAttribute("download") && (!link.target || link.target === "_self")
    && link.origin === window.location.origin;
}

/** Move keyboard reading position with the new page without disturbing its scroll. */
export function focusPageContent(hash = "") {
  const target = (hash ? document.getElementById(hash) : null) ?? document.querySelector<HTMLElement>("main");
  if (!target) return;
  if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
  target.focus({ preventScroll: true });
}
