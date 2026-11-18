import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register once at module level; safe to import from any client component.
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };
