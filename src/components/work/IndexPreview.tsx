"use client";

import { useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { MQ } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface Props {
  /** One cover per row of the table inside, in the same order, drawn on the server. */
  covers: readonly ReactNode[];
  /** The table (IndexTable): its rows are the elements marked `data-row`. */
  children: ReactNode;
}

/** Index of the row the event came from, or null when it came from anywhere else. */
function rowOf(target: EventTarget): HTMLElement | null {
  return target instanceof Element ? target.closest<HTMLElement>("[data-row]") : null;
}

/**
 * The cover that follows the cursor over the index (section 6.5). The row under a
 * mouse, or focused with the keyboard, shows its project's cover two columns wide over
 * columns 6 and 7, at the height of the pointer or of the row. Only with a fine pointer
 * and no reduced-motion preference: elsewhere this is just the table, and the covers are
 * never drawn. The cover is decoration (the row already says everything), so it is
 * hidden from assistive technology and never takes the pointer.
 */
export function IndexPreview({ covers, children }: Props) {
  const isFinePointer = useMediaQuery(MQ.fine);
  const isMotionAllowed = useMediaQuery(MQ.motion);
  const isEnabled = isFinePointer && isMotionAllowed;
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  /** Centres the card on `clientY`, kept inside the table's height. */
  const centreOn = (clientY: number) => {
    const area = root.current?.getBoundingClientRect();
    const element = card.current;
    if (!area || !element) return;
    const top = clientY - area.top - element.offsetHeight / 2;
    const lowest = Math.max(area.height - element.offsetHeight, 0);
    element.style.transform = `translateY(${Math.min(Math.max(top, 0), lowest)}px)`;
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isEnabled || event.pointerType !== "mouse") return;
    const row = rowOf(event.target);
    setActive(row ? Number(row.dataset.row) : null);
    if (row) centreOn(event.clientY);
  };

  const handleFocus = (event: FocusEvent) => {
    const row = rowOf(event.target);
    if (!isEnabled || !row) return;
    setActive(Number(row.dataset.row));
    const box = row.getBoundingClientRect();
    centreOn(box.top + box.height / 2);
  };

  // Focus moving to another row keeps the preview; leaving the table hides it.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setActive(null);
  };

  return (
    <div
      ref={root}
      className="relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setActive(null)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      {isEnabled && (
        <div aria-hidden className="page-grid pointer-events-none absolute inset-0 items-start">
          <div
            ref={card}
            data-visible={active !== null}
            className="relative col-span-2 col-start-6 aspect-[4/3] opacity-0
              transition-opacity duration-(--dur-fast) ease-(--ease)
              data-[visible=true]:opacity-100"
          >
            {covers.map((cover, index) => (
              <div key={index} className={`absolute inset-0 ${index === active ? "" : "hidden"}`}>
                {cover}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
