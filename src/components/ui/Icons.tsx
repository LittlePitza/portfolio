import type { HeadIcon } from "@/content/head";

const common = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Hand-drawn-looking line icons for the objects that live in the head. */
export function Icon({ name, className = "" }: { name: HeadIcon; className?: string }) {
  switch (name) {
    case "database":
      return (
        <svg {...common} className={className} aria-hidden>
          <ellipse cx="24" cy="12" rx="14" ry="5" />
          <path d="M10 12v24c0 2.8 6.3 5 14 5s14-2.2 14-5V12" />
          <path d="M10 24c0 2.8 6.3 5 14 5s14-2.2 14-5" />
        </svg>
      );
    case "pipeline":
      return (
        <svg {...common} className={className} aria-hidden>
          <rect x="6" y="9" width="36" height="30" />
          <path d="M6 16h36" />
          <path d="M13 24l5 4-5 4" />
          <path d="M22 32h10" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common} className={className} aria-hidden>
          <rect x="10" y="21" width="28" height="20" />
          <path d="M16 21v-6a8 8 0 0 1 16 0v6" />
          <circle cx="24" cy="31" r="2.5" fill="currentColor" />
        </svg>
      );
    case "meeple":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M24 5c5 0 8 4 8 8 0 3-1.5 5.5-4 7l12 6c3 1.5 2.5 6-1 6h-5l4 10H10l4-10H9c-3.5 0-4-4.5-1-6l12-6c-2.5-1.5-4-4-4-7 0-4 3-8 8-8z" />
        </svg>
      );
    case "pizza":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M8 13 L24 43 L40 13" />
          <path d="M5 13c11-7 27-7 38 0" />
          <circle cx="20" cy="20" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="29" cy="24" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="23" cy="31" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "headphones":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M9 32v-8a15 15 0 0 1 30 0v8" />
          <rect x="7" y="27" width="8" height="13" rx="2" />
          <rect x="33" y="27" width="8" height="13" rx="2" />
        </svg>
      );
    case "gamepad":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M14 15h20c7 0 11 6 10 13l-1 6c-1 5-7 6-10 2l-3-4H18l-3 4c-3 4-9 3-10-2l-1-6c-1-7 3-13 10-13z" />
          <path d="M14 22v8M10 26h8" />
          <circle cx="33" cy="24" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="38" cy="28" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "knight":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M12 40h24" />
          <path d="M15 40c0-6 3-9 7-12l-6 2c-3 1-5-2-4-5l6-9c3-5 8-8 14-8v6c4 2 6 6 6 11v15" />
          <circle cx="27" cy="16" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "code":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M16 14 L6 24 L16 34" />
          <path d="M32 14 L42 24 L32 34" />
          <path d="M28 10 L20 38" />
        </svg>
      );
    case "pellet":
      return (
        <svg {...common} className={className} aria-hidden>
          <ellipse cx="17" cy="18" rx="8" ry="6" />
          <ellipse cx="31" cy="18" rx="8" ry="6" />
          <ellipse cx="24" cy="31" rx="8" ry="6" />
          <ellipse cx="10" cy="31" rx="4" ry="3" />
          <ellipse cx="38" cy="31" rx="4" ry="3" />
        </svg>
      );
    case "report":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M8 40h32" />
          <rect x="11" y="24" width="6" height="16" />
          <rect x="21" y="14" width="6" height="26" />
          <rect x="31" y="8" width="6" height="32" />
        </svg>
      );
    case "cube":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M10 16l14-8 14 8v16l-14 8-14-8z" />
          <path d="M10 16l14 8 14-8M24 24v16" />
          <path d="M17 12l14 8" />
        </svg>
      );
    case "coffee":
      return (
        <svg {...common} className={className} aria-hidden>
          <path d="M9 18h24v12a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8z" />
          <path d="M33 21h3a5 5 0 0 1 0 10h-3" />
          <path d="M16 6c0 3-2 3-2 6M22 6c0 3-2 3-2 6M28 6c0 3-2 3-2 6" />
        </svg>
      );
    case "mic":
      return (
        <svg {...common} className={className} aria-hidden>
          <rect x="17" y="6" width="14" height="22" rx="7" />
          <path d="M11 22a13 13 0 0 0 26 0" />
          <path d="M24 35v7M17 42h14" />
        </svg>
      );
  }
}
