/**
 * The monogram: L and H built from bars on an orange field, plus a thin black
 * edge on the right as a nod to the curtain in the opening. Pure geometry, no
 * fonts, so it reads at 16px in a browser tab and at 512px on a social card.
 */
export function Mark({ className = "", ink = "#141414", field = "#ff4a1c" }: { className?: string; ink?: string; field?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill={ink}>
      <rect width="64" height="64" fill={field} />
      {/* L */}
      <rect x="9" y="11" width="9" height="42" />
      <rect x="9" y="44" width="21" height="9" />
      {/* H */}
      <rect x="34" y="11" width="9" height="42" />
      <rect x="49" y="11" width="9" height="42" />
      <rect x="34" y="28" width="24" height="8" />
      {/* curtain edge */}
      <rect x="60" y="0" width="4" height="64" />
    </svg>
  );
}
