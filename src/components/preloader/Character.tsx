/**
 * Luis, full body, leaning hard into a push. Cartoon proportions: a big head
 * in profile facing right, torso angled forward, both arms out, back leg
 * stretched, front leg planted. Swept dark hair, full beard, black tee under
 * the orange knit overshirt, chain, watch on the leading wrist, dark jeans,
 * white socks and sneakers. Thick outlines, flat fills, a little sweat.
 * Used by the preloader, the hero and the contact cards.
 */
export function Character({ className = "" }: { className?: string }) {
  const ink = "var(--ink)";
  const paper = "var(--bg)";
  const accent = "var(--accent)";
  const beard = "M214 126 C220 152 244 166 270 158 C288 152 296 134 294 114 C288 122 280 126 270 124 C258 134 240 134 226 122 C220 124 216 124 214 126 Z";
  const hair = "M196 106 C186 68 206 38 246 38 C272 38 292 52 296 74 C280 60 258 58 240 66 C222 74 206 90 196 106 Z";
  const shirt = "M176 178 C186 164 224 160 242 176 L200 274 C182 282 150 280 138 264 Z";

  return (
    <svg viewBox="0 0 340 420" className={className} role="img" aria-label="Illustrated Luis pushing" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <pattern id="chKnit" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <path d="M0 5 H10" stroke={ink} strokeWidth="1.6" strokeOpacity="0.35" />
        </pattern>
        <pattern id="chDots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="4.5" cy="4.5" r="1.5" fill={paper} stroke="none" />
        </pattern>
      </defs>

      {/* Back leg: stretched, on its toes */}
      <path d="M150 262 L102 318 L74 372" strokeWidth="26" />
      <path d="M150 262 L102 318 L74 372" stroke={paper} strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Front leg: planted, knee bent */}
      <path d="M182 268 L194 330 L190 372" strokeWidth="28" />
      <path d="M182 268 L194 330 L190 372" stroke={paper} strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Socks */}
      <path d="M70 372 L66 384" stroke={paper} strokeWidth="18" />
      <path d="M70 372 L66 384" strokeWidth="24" strokeOpacity="0" />
      <path d="M190 372 L190 384" stroke={paper} strokeWidth="20" />
      <path d="M58 366 L84 372 M178 368 L204 368" strokeWidth="5" />
      {/* Sneakers */}
      <path d="M26 398 L88 398 C98 398 102 390 96 382 L62 378 C50 380 40 386 26 392 Z" fill={paper} />
      <path d="M26 398 L96 398" strokeWidth="7" />
      <path d="M50 390 C60 384 74 385 88 390" strokeWidth="3" />
      <path d="M154 398 L218 398 C228 398 232 390 226 382 L190 378 C178 380 166 386 154 392 Z" fill={paper} />
      <path d="M154 398 L226 398" strokeWidth="7" />
      <path d="M178 390 C190 384 204 385 218 390" strokeWidth="3" />

      {/* Far arm, behind the torso, palm flat on the wall */}
      <path d="M214 210 L262 214 L304 202" strokeWidth="24" />
      <path d="M214 210 L262 214" stroke={accent} strokeWidth="15" />
      <path d="M262 214 L304 202" stroke={paper} strokeWidth="15" />
      <path d="M302 192 L322 188 C328 187 331 192 330 198 L328 214 C327 219 322 221 318 219 L300 214 Z" fill={paper} strokeWidth="5" />
      <path d="M314 190 L317 210 M321 189 L324 206" strokeWidth="2.5" />

      {/* Torso: orange overshirt leaning forward, black tee at the chest, chain */}
      <path d={shirt} fill={accent} />
      <path d={shirt} fill="url(#chKnit)" stroke="none" />
      <path d="M222 168 L246 178 L232 224 L206 206 Z" fill={ink} stroke="none" />
      <path d="M222 168 L206 206 M246 178 L232 224" strokeWidth="5" />
      <path d="M232 180 C234 194 236 202 240 208" stroke={paper} strokeWidth="2.5" />
      <path d="M160 200 L146 260 M176 196 L162 262" stroke={paper} strokeWidth="2" strokeOpacity="0.45" />

      {/* Near arm, in front, watch on the wrist, palm flat on the wall */}
      <path d="M234 184 L274 180 L308 168" strokeWidth="26" />
      <path d="M234 184 L274 180" stroke={accent} strokeWidth="17" />
      <path d="M274 180 L308 168" stroke={paper} strokeWidth="17" />
      <path d="M292 162 L300 184" strokeWidth="8" />
      <circle cx="296" cy="173" r="4.5" fill={paper} strokeWidth="2.5" />
      <path d="M306 156 L326 152 C332 151 336 156 335 162 L333 180 C332 185 327 187 323 185 L304 180 Z" fill={paper} strokeWidth="5" />
      <path d="M318 154 L321 176 M326 153 L329 172" strokeWidth="2.5" />

      {/* Neck */}
      <path d="M226 150 L246 156 L240 180 L214 172 Z" fill={paper} />

      {/* Head, profile facing right */}
      <path d="M198 98 C198 62 222 46 252 50 C282 54 298 84 292 114 C290 128 284 138 276 144 C258 158 232 158 216 146 C204 136 198 118 198 98 Z" fill={paper} />
      {/* Beard */}
      <path d={beard} fill={ink} />
      <path d={beard} fill="url(#chDots)" stroke="none" />
      {/* Gritted teeth */}
      <path d="M262 132 L282 126" stroke={paper} strokeWidth="6" />
      <path d="M267 130 L268 134 M274 128 L275 132" strokeWidth="2" />
      {/* Hair, swept back */}
      <path d={hair} fill={ink} />
      <path d="M212 76 C226 58 250 52 272 58" stroke={paper} strokeWidth="3" />
      {/* Ear */}
      <path d="M212 104 C204 100 200 110 208 118" fill={paper} strokeWidth="4" />
      {/* Furrowed brow and squinting eye */}
      <path d="M252 82 L282 92" strokeWidth="7" />
      <path d="M262 100 L280 102" strokeWidth="5" />
      {/* Nose */}
      <path d="M290 100 C298 106 298 112 290 116" strokeWidth="5" />
      {/* Sweat and effort */}
      <path d="M302 74 C298 80 298 86 302 86 C306 86 306 80 302 74 Z" fill={paper} strokeWidth="3" />
      <path d="M296 56 C292 62 292 68 296 68 C300 68 300 62 296 56 Z" fill={paper} strokeWidth="3" />
      <path d="M306 40 L316 30 M314 52 L326 48" strokeWidth="3.5" />
    </svg>
  );
}
