import { HOME_POSITION_ATTR, HOME_POSITION_KEY, WORK_ANCHOR } from "@/lib/navigation";

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
 *
 * On every page it first marks `data-js`: scripts run, so CSS may lay out what only
 * a script can drive, like Home's carousel (section 7.4). On Home it also marks
 * `data-home-position` when the load will reopen a project (a reload, a back, or the
 * work link), the same rule as entryPosition in useCarousel, so CSS can keep the cover
 * screen from painting before the carousel takes over.
 */
export function introScript(homePaths: readonly string[]) {
  return `(function(){try{` +
    `document.documentElement.setAttribute("data-js","");` +
    `var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==="/")p=p.slice(0,-1);` +
    `if(${JSON.stringify(homePaths)}.indexOf(p)<0)return;` +
    `var h=document.documentElement;` +
    `var n=Number(sessionStorage.getItem(${JSON.stringify(HOME_POSITION_KEY)}));if(!(n>0))n=0;` +
    `var t=performance.getEntriesByType("navigation")[0];` +
    `if(location.hash===${JSON.stringify(`#${WORK_ANCHOR}`)})n=Math.max(1,n);` +
    `else if(!t||(t.type!=="reload"&&t.type!=="back_forward"))n=0;` +
    `if(n>0)h.setAttribute(${JSON.stringify(HOME_POSITION_ATTR)},String(n));` +
    `if(sessionStorage.getItem(${JSON.stringify(INTRO_KEY)})==="1")return;` +
    `if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;` +
    `h.setAttribute(${JSON.stringify(INTRO_ATTR)},"");` +
    `setTimeout(function(){h.removeAttribute(${JSON.stringify(INTRO_ATTR)})},${SAFETY_MS});` +
    `}catch(e){}})();`;
}
