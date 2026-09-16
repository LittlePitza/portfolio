/**
 * Luis, in profile, leaning in and pushing with both hands: swept dark hair,
 * full beard, black tee under the orange knit overshirt, chain, and the watch
 * on the leading wrist. Same style as the About portrait. Used by the
 * preloader (pushing the curtain), the hero (resting against the name) and
 * the contact cards.
 */
export function Character({ className = "" }: { className?: string }) {
  const ink = "var(--ink)";
  const paper = "var(--bg)";
  const accent = "var(--accent)";
  return (
    <svg viewBox="0 0 220 300" className={className} role="img" aria-label="Illustrated Luis pushing" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      {/* Legs: dark trousers, back leg stretched, front leg planted */}
      <path d="M80 192 L42 262 L20 262" strokeWidth="11" />
      <path d="M98 198 L120 258 L150 262" strokeWidth="11" />
      {/* Shoes */}
      <path d="M8 262 H46 L42 276 H8 Z" fill={ink} stroke="none" />
      <path d="M118 262 H158 L154 276 H118 Z" fill={ink} stroke="none" />
      <path d="M12 268 H40 M122 268 H150" stroke={paper} strokeWidth="2" />

      {/* Torso: orange overshirt leaning forward, black tee at the chest */}
      <path d="M66 118 L106 104 L126 188 L84 200 Z" fill={accent} />
      <path d="M74 132 L90 192 M82 126 L98 186" stroke={ink} strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M96 108 L112 116 L116 136 L100 126 Z" fill={ink} stroke="none" />
      {/* Chain */}
      <path d="M100 112 C104 120 108 124 112 126" stroke={paper} strokeWidth="2" />

      {/* Arms extended forward */}
      <path d="M104 118 L160 104 L198 112" strokeWidth="9" stroke={accent} />
      <path d="M104 118 L160 104 L198 112" />
      <path d="M112 150 L166 132 L202 138" strokeWidth="9" stroke={accent} />
      <path d="M112 150 L166 132 L202 138" />
      {/* Watch on the leading wrist */}
      <path d="M184 103 L190 118" strokeWidth="7" />
      <circle cx="187" cy="110" r="4.5" fill={paper} strokeWidth="2.5" />
      {/* Hands */}
      <circle cx="204" cy="112" r="7" fill={paper} />
      <circle cx="208" cy="138" r="7" fill={paper} />

      {/* Neck */}
      <path d="M94 96 L90 110" strokeWidth="7" />

      {/* Head in profile, facing right */}
      <circle cx="96" cy="70" r="28" fill={paper} />
      {/* Beard along the jaw and chin */}
      <path d="M72 78 C74 96 88 106 108 102 C120 100 126 90 124 80 C118 86 112 88 106 86 C98 92 88 92 80 84 Z" fill={ink} stroke="none" />
      <path d="M78 84 C86 94 98 96 108 92" stroke={paper} strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Hair, swept back */}
      <path d="M68 76 C64 52 78 38 98 38 C114 38 126 48 124 60 C114 52 102 52 94 58 C86 62 76 68 68 76 Z" fill={ink} stroke="none" />
      <path d="M78 58 C86 48 98 46 110 50" stroke={paper} strokeWidth="2.5" />
      {/* Ear */}
      <path d="M78 70 C72 68 70 76 76 80" fill={paper} strokeWidth="3.5" />
      {/* Brow, eye, nose */}
      <path d="M106 60 L120 62" strokeWidth="5" />
      <circle cx="114" cy="69" r="2.8" fill={ink} stroke="none" />
      <path d="M122 68 C128 72 128 78 122 80" strokeWidth="4" />
      {/* Effort marks */}
      <path d="M130 44 L138 36 M134 54 L144 50" strokeWidth="3" />
    </svg>
  );
}
