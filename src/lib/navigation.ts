/**
 * Whether the visitor has navigated inside the site since the document
 * loaded. The opening sequence must only play on a real page load of the
 * home, never after a client-side route change from another page.
 */
let navigated = false;

export function markNavigated() {
  navigated = true;
}

export function hasNavigated() {
  return navigated;
}
