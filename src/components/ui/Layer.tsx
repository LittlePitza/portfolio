"use client";

import type { ReactNode } from "react";
import { enterStep } from "./enterStep";
import { useAnchorLayer } from "./useAnchorLayer";

interface Props {
  /** The anchor that opens it, from the dictionary: "process" for `#process` in English. */
  id: string;
  title: string;
  closeLabel: string;
  /** Laid out on the page grid (8 columns on the stage, 4 below it). */
  children: ReactNode;
}

/**
 * A full-screen detail layer (section 6.2): a native modal `<dialog>` with its own scroll,
 * the title on the left and "Cerrar" on the right, opened by any link to `#id`. Its
 * content is in the server's HTML; without scripts globals.css shows it as a plain section
 * where it stands in the page (section 7.6).
 */
export function Layer({ id, title, closeLabel, children }: Props) {
  const dialog = useAnchorLayer(id);
  const titleId = `${id}-title`;

  return (
    <dialog
      ref={dialog}
      id={id}
      data-layer
      aria-labelledby={titleId}
      className="layer-sheet"
    >
      <div className="flex items-start justify-between gap-(--gap) px-(--margin) pt-(--margin)">
        <h2 id={titleId} data-enter className="font-display text-title">
          {title}
        </h2>
        <button
          type="button"
          data-layer-close
          onClick={() => dialog.current?.close()}
          className="min-h-11 min-w-11 shrink-0 text-right text-ui"
        >
          {closeLabel}
        </button>
      </div>
      <div
        data-enter
        style={enterStep(1)}
        className="page-grid gap-y-8 pt-8 pb-24 stage:gap-y-12 stage:pt-12"
      >
        {children}
      </div>
    </dialog>
  );
}
