/**
 * Placeholder character until the illustrated version exists.
 * Side view of a figure leaning forward and pushing with both hands, drawn
 * with simple shapes so it reads at any size. Replace with the final
 * illustration (SVG) or a Rive file via `site.riveCharacter`.
 */
export function Character({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className={className}
      role="img"
      aria-label="Illustrated character pushing"
      fill="none"
      stroke="var(--ink)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* back leg */}
      <path d="M78 190 L40 262 L18 262" />
      {/* front leg */}
      <path d="M96 196 L118 258 L150 262" />
      {/* shoes */}
      <path d="M8 262 H44 L40 274 H8 Z" fill="var(--ink)" stroke="none" />
      <path d="M116 262 H156 L152 274 H116 Z" fill="var(--ink)" stroke="none" />
      {/* torso, leaning forward */}
      <path d="M70 120 L104 108 L120 190 L80 200 Z" fill="var(--accent)" />
      {/* shirt pattern */}
      <g fill="var(--bg)" stroke="none">
        <circle cx="88" cy="132" r="3.5" />
        <circle cx="104" cy="150" r="3.5" />
        <circle cx="92" cy="172" r="3.5" />
      </g>
      {/* arms extended forward */}
      <path d="M104 118 L160 104 L200 112" />
      <path d="M112 150 L166 132 L204 138" />
      {/* hands */}
      <circle cx="204" cy="112" r="7" fill="var(--bg)" />
      <circle cx="208" cy="138" r="7" fill="var(--bg)" />
      {/* neck + head */}
      <path d="M92 110 L84 92" />
      <circle cx="76" cy="70" r="26" fill="var(--bg)" />
      {/* cap */}
      <path d="M50 66 Q76 36 104 62 L106 70 L48 74 Z" fill="var(--ink)" stroke="none" />
      <path d="M100 66 L128 72" strokeWidth="6" />
      {/* face */}
      <circle cx="90" cy="76" r="2.5" fill="var(--ink)" stroke="none" />
      <path d="M94 88 Q90 92 86 90" strokeWidth="3" />
      {/* effort marks */}
      <path d="M126 50 L134 40 M132 58 L142 54" strokeWidth="3" />
    </svg>
  );
}

/** Small head-only version used as the avatar next to the logo. */
export function Avatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="3.5">
      <circle cx="40" cy="44" r="24" />
      <path d="M14 40 Q40 10 66 36 L68 44 L12 48 Z" fill="currentColor" stroke="none" />
      <path d="M62 40 L78 46" strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none" />
      <path d="M52 60 Q48 64 44 62" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
