import { Cormorant_Garamond, Plus_Jakarta_Sans, Poppins, Space_Grotesk } from "next/font/google";

/*
 * The apps' own typefaces, used only inside their covers. None of them is
 * preloaded: a browser fetches a face when a cover actually draws text in it,
 * so a page never pays for a font it does not show. Apps that ship Geist or a
 * system face borrow the site's fonts instead of adding one.
 */

/** TI Hub and the maintenance portal. */
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", preload: false });

/** The marketplace's display face. */
export const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], display: "swap", preload: false });

/** Woodland Setup's book-like display face. */
export const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], display: "swap", preload: false });

/** The D&D companion. */
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "700", "800"], display: "swap", preload: false });
