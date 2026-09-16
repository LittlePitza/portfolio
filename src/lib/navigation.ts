/**
 * Whether the visitor has moved inside the site since the document loaded.
 * The opening sequence must only play on a real page load of the home, never
 * after a client-side route change, whichever link caused it.
 */
let navigated = false;

/** Captured when this module first runs in the browser, which is during hydration of the first document. */
const initialPathname = typeof window === "undefined" ? null : window.location.pathname;

export function markNavigated() {
  navigated = true;
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
