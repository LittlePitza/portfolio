/**
 * Illustrated portrait of Luis: dark hair swept to one side with volume on
 * top, a full beard, a wide smile, black tee under an orange overshirt and a
 * thin chain. Thick outlines and flat fills. The hair and the top of the
 * skull form one "lid" group (data-lid) so the parent can lift it; the
 * interior, the sparkle eyes, the grin and the speed lines are tagged so they
 * can be faded in while the head is open.
 */
export function Head({ className = "", open = false }: { className?: string; open?: boolean }) {
  const show = (on: boolean) => (on ? 1 : 0);
  const ink = "var(--ink)";
  const paper = "var(--bg)";
  const accent = "var(--accent)";
  const beard =
    "M104 218 C102 256 100 300 112 346 C128 396 166 430 212 430 C258 430 296 396 310 348 C320 304 318 258 316 218 C314 252 308 298 294 324 C278 338 258 332 246 322 C236 314 226 314 214 318 C202 314 192 314 180 322 C166 334 148 338 132 324 C116 298 108 252 104 218 Z";

  return (
    <svg viewBox="0 0 420 520" overflow="visible" className={className} aria-hidden fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <pattern id="beardTone" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <circle cx="5" cy="5" r="1.6" fill={paper} stroke="none" />
        </pattern>
        <pattern id="knit" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 L12 6" stroke={ink} strokeWidth="1.6" strokeOpacity="0.35" />
        </pattern>
      </defs>

      {/* Neck */}
      <path d="M156 414 L156 458 M264 410 L264 456" />

      {/* Overshirt, orange, and the black tee with the chain */}
      <path d="M52 520 C68 468 112 448 170 444 L150 520 Z" fill={accent} />
      <path d="M368 520 C352 468 308 448 250 444 L270 520 Z" fill={accent} />
      <path d="M52 520 C68 468 112 448 170 444 L150 520 Z" fill="url(#knit)" stroke="none" />
      <path d="M368 520 C352 468 308 448 250 444 L270 520 Z" fill="url(#knit)" stroke="none" />
      <path d="M150 520 L170 444 C186 468 234 468 250 444 L270 520 Z" fill={ink} />
      <path d="M170 444 C182 476 238 476 250 444" strokeWidth="6" />
      <path d="M186 460 C196 500 224 500 234 460" stroke={paper} strokeWidth="3" />
      <rect x="205" y="494" width="10" height="14" rx="2" fill={paper} stroke="none" />

      {/* Speed lines, visible only while open */}
      <g data-lines strokeWidth="6" opacity={show(open)}>
        <path d="M40 150 L74 178 M28 210 L66 214 M380 140 L350 170 M396 200 L356 206 M120 22 L136 52 M300 20 L286 52" />
      </g>

      {/* Ears */}
      <path d="M104 262 C86 250 76 274 88 292 C96 304 110 298 110 286" fill={paper} />
      <path d="M318 256 C336 246 344 270 332 288 C326 298 314 294 314 282" fill={paper} />

      {/* Lower face, from the cut line down */}
      <path d="M104 208 C98 262 96 320 114 358 C132 402 168 430 212 430 C258 430 294 400 308 356 C322 318 320 262 316 208 Z" fill={paper} />

      {/* Beard: sideburns down around the jaw, moustache under the nose */}
      <path d={beard} fill={ink} />
      <path d={beard} fill="url(#beardTone)" stroke="none" />

      {/* Inside of the head, revealed when the lid lifts */}
      <g data-inside opacity={show(open)}>
        <ellipse cx="210" cy="208" rx="106" ry="18" fill={ink} />
        <ellipse cx="210" cy="205" rx="84" ry="9" fill="#3a3a3a" stroke="none" />
      </g>

      {/* Eyebrows, thick, lift a little when the head opens */}
      <g data-brows transform={open ? "translate(0 -10)" : undefined}>
        <path d="M134 236 C152 224 180 224 196 232 L196 242 C180 236 154 236 138 246 Z" fill={ink} stroke="none" />
        <path d="M226 231 C242 223 270 223 288 235 L284 245 C268 235 242 235 226 241 Z" fill={ink} stroke="none" />
      </g>

      {/* Eyes, calm: warm, slightly narrowed */}
      <g data-eyes-calm opacity={show(!open)}>
        <path d="M150 272 C160 262 178 262 188 272" strokeWidth="6" />
        <path d="M234 270 C244 260 262 260 272 270" strokeWidth="6" />
        <circle cx="169" cy="274" r="6" fill={ink} stroke="none" />
        <circle cx="253" cy="272" r="6" fill={ink} stroke="none" />
      </g>
      {/* Eyes, sparkling */}
      <g data-eyes-spark opacity={show(open)} fill={ink} stroke="none">
        <path d="M169 254 L174 267 L187 272 L174 277 L169 290 L164 277 L151 272 L164 267 Z" />
        <path d="M253 252 L258 265 L271 270 L258 275 L253 288 L248 275 L235 270 L248 265 Z" />
      </g>

      {/* Nose */}
      <path d="M212 280 C218 294 224 304 212 310" strokeWidth="6" />
      {/* Cheek lines */}
      <path d="M140 300 C134 292 132 284 134 278" strokeWidth="5" />
      <path d="M282 296 C288 288 290 280 288 274" strokeWidth="5" />

      {/* Mouth, calm: wide closed smile inside the beard */}
      <g data-mouth-calm opacity={show(!open)}>
        <path d="M176 336 C196 352 232 352 252 334" stroke={paper} strokeWidth="7" />
        <path d="M176 336 C196 352 232 352 252 334" strokeWidth="3" />
      </g>
      {/* Mouth, grin with teeth */}
      <g data-mouth-grin opacity={show(open)}>
        <path d="M170 330 C190 372 240 372 260 328 C238 340 190 342 170 330 Z" fill={paper} />
        <path d="M180 334 C200 342 232 342 250 332 L246 346 C226 354 200 354 184 346 Z" fill="#fff" stroke="none" />
        <path d="M170 330 C190 372 240 372 260 328" strokeWidth="6" />
      </g>

      {/* Lid: top of the skull with the hair */}
      <g data-lid transform={open ? "translate(-16 -118) rotate(-12 126 208)" : undefined}>
        {/* Underside of the lid, seen when it lifts */}
        <ellipse data-underside cx="210" cy="210" rx="106" ry="17" fill="#2a2a2a" opacity={show(open)} />
        {/* Upper skull */}
        <path d="M104 208 C102 150 148 112 210 112 C272 112 318 150 316 208 Z" fill={paper} />
        {/* Hair: volume on top, swept from left to right, hairline over the forehead */}
        <path
          d="M96 214 C86 170 94 118 130 94 C162 74 204 68 244 78 C292 90 324 132 324 192 C325 200 324 208 322 214 C304 202 282 194 262 198 C248 202 238 190 224 194 C210 178 186 178 168 192 C150 202 126 206 96 214 Z"
          fill={ink}
        />
        {/* Strands, for volume */}
        <path d="M138 150 C166 118 208 106 250 114 M116 198 C126 168 146 144 176 132" stroke={paper} strokeWidth="5" />
        <path d="M264 110 C292 126 310 156 314 190" stroke={paper} strokeWidth="5" />
        {/* Cut edge */}
        <path d="M100 209 L320 209" strokeWidth="7" />
      </g>
    </svg>
  );
}
