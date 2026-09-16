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
