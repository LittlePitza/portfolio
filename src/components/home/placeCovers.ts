/**
 * Where every cover of the Home carousel sits for one continuous position
 * (docs/02-diseno-v2.md, section 7.4). Pure: no DOM, no imports, so it runs the same
 * in the browser, on every animation frame, and in scripts/check-place-covers.mjs.
 */

/** The canvas and the active cover, in px, as measured on the page. */
export interface CanvasGeometry {
  width: number;
  height: number;
  /** The page margin and the column gap (the --margin and --gap tokens). */
  margin: number;
  gap: number;
  /** The active cover's untransformed height. */
  coverHeight: number;
}

/** One cover's place: its centre in canvas px, its turn in degrees, its scale and opacity. */
export interface CoverPlacement {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  /** False once the cover is fully out at slot ±2: it is not painted at all. */
  visible: boolean;
}

type Slot = Omit<CoverPlacement, "visible">;

const COLUMNS = 8;
const OUTER = 2;

/** How much of a neighbour shows past the canvas edge, as a share of the cover's height. */
const PEEK = 0.26;
const NEIGHBOUR_SCALE = 0.8;

/** The left edge of column `n` (1 to 8): a line of the grid (section 4). */
function columnLine(n: number, geometry: CanvasGeometry) {
  const { width, margin, gap } = geometry;
  const column = (width - 2 * margin - (COLUMNS - 1) * gap) / COLUMNS;
  return margin + (n - 1) * (column + gap);
}

/** The five slots of the table in section 7.4, from −2 (gone above) to +2 (gone below). */
function slots(geometry: CanvasGeometry): Slot[] {
  const { width, height, coverHeight } = geometry;
  // A neighbour's centre sits so that PEEK of its height shows past the edge.
  const reach = PEEK * coverHeight - (coverHeight * NEIGHBOUR_SCALE) / 2;
  const scale = NEIGHBOUR_SCALE;
  return [
    { x: columnLine(3, geometry), y: -0.6 * height, rotation: -14, scale: 0.7, opacity: 0 },
    { x: columnLine(4, geometry), y: reach, rotation: -7, scale, opacity: 1 },
    { x: width / 2, y: height / 2, rotation: 0, scale: 1, opacity: 1 },
    { x: columnLine(6, geometry), y: height - reach, rotation: 7, scale, opacity: 1 },
    { x: columnLine(7, geometry), y: 1.6 * height, rotation: 14, scale: 0.7, opacity: 0 },
  ];
}

/**
 * Cover `index`'s distance from the active slot, for project positions 1 to n. Between
 * the cover screen (0) and the first project, the first cover travels in from slot +2,
 * so nothing peeks while the name is on screen.
 */
function slotOffset(index: number, position: number) {
  if (position < 1) return index - 1 + OUTER * (1 - position);
  return index - position;
}

/**
 * Places `count` covers for `position`, a continuous value from 0 (the cover screen)
 * to `count` (the last project). At a whole position n, cover n is in slot 0 and cover
 * n + 1 in slot +1; between whole positions every value is interpolated slot to slot.
 */
export function placeCovers(position: number, count: number, geometry: CanvasGeometry): CoverPlacement[] {
  const table = slots(geometry);
  return Array.from({ length: count }, (_, index) => {
    const offset = slotOffset(index + 1, position);
    const along = Math.min(OUTER, Math.max(-OUTER, offset)) + OUTER;
    const lower = Math.floor(along);
    const upper = Math.min(table.length - 1, lower + 1);
    const t = along - lower;
    const mix = (key: keyof Slot) => table[lower][key] + (table[upper][key] - table[lower][key]) * t;
    return {
      x: mix("x"),
      y: mix("y"),
      rotation: mix("rotation"),
      scale: mix("scale"),
      opacity: mix("opacity"),
      visible: Math.abs(offset) < OUTER,
    };
  });
}

/**
 * The check section 11 asks for: at every whole position, the active cover is in slot 0
 * and the next one in slot +1, and nothing shows on the cover screen. Returns the
 * failures, empty when the placement is right.
 */
export function checkPlaceCovers(count = 9): string[] {
  const geometry: CanvasGeometry = { width: 1440, height: 800, margin: 20, gap: 20, coverHeight: 251.25 };
  const [, before, centre, after] = slots(geometry);
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;
  const isAt = (placement: CoverPlacement, slot: Slot) =>
    near(placement.x, slot.x) && near(placement.y, slot.y) && near(placement.rotation, slot.rotation)
    && near(placement.scale, slot.scale) && near(placement.opacity, slot.opacity);
  const failures: string[] = [];

  if (placeCovers(0, count, geometry).some((placement) => placement.visible)) {
    failures.push("a cover is painted on the cover screen (position 0)");
  }
  for (let n = 1; n <= count; n += 1) {
    const placed = placeCovers(n, count, geometry);
    if (!isAt(placed[n - 1], centre)) failures.push(`at ${n}, cover ${n} is not in slot 0`);
    if (n < count && !isAt(placed[n], after)) failures.push(`at ${n}, cover ${n + 1} is not in slot +1`);
    if (n > 1 && !isAt(placed[n - 2], before)) failures.push(`at ${n}, cover ${n - 1} is not in slot -1`);
  }
  return failures;
}
