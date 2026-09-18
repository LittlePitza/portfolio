/** Remembers, for this tab only, that the opening has already played. */
export const INTRO_KEY = "portfolio:preloaded";

/** The mark that a load is opening with the intro, on <html> for the stylesheet to read. */
export const INTRO_ATTR = "data-intro";

/** The curtain lifts on its own if the page script never arrives to do it. */
const SAFETY_MS = 6000;

/**
 * Runs in <head>, before the browser paints anything, and decides there and then
 * whether this load opens with the intro. Marking the document is all it does: the
 * mark is what makes the curtain visible, so a visitor without JavaScript — or one
 * who has already seen it — gets the page straight away and never a stuck screen.
 * It is an attribute React never rendered, so hydration leaves it alone.
 */
export function introScript(homePaths: readonly string[]) {
  return `(function(){try{` +
    `var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==="/")p=p.slice(0,-1);` +
    `if(${JSON.stringify(homePaths)}.indexOf(p)<0)return;` +
    `if(sessionStorage.getItem(${JSON.stringify(INTRO_KEY)})==="1")return;` +
    `if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;` +
    `var h=document.documentElement;h.setAttribute(${JSON.stringify(INTRO_ATTR)},"");` +
    `setTimeout(function(){h.removeAttribute(${JSON.stringify(INTRO_ATTR)})},${SAFETY_MS});` +
    `}catch(e){}})();`;
}
