"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/Icons";
import type { HeadIcon } from "@/content/head";
import { Head } from "./Head";
import styles from "./InsideHead.module.css";

export interface HeadItemView { icon: HeadIcon; title: string; story: string; signature: string; }
interface Props {
  items: HeadItemView[];
  /** The caption under the portrait while it is closed, and the hint once it is open. */
  question: string;
  hintOpen: string;
  openLabel: string;
  close: string;
}
const spots = [[-.64, -.12, -14], [-.48, -.43, -9], [-.26, -.64, -5], [0, -.72, 5], [.27, -.64, 9], [.49, -.43, 14], [.65, -.12, 18]];

/**
 * The portrait that opens (section 6.2): a click, a tap or Enter lifts the lid and the
 * objects float out; each opens its card. Escape or a second click closes it and gives
 * focus back to the portrait. While open, the scene carries `data-open`, which globals.css
 * reads to blur the page's `[data-head-dim]` parts. No animation loop: objects move only
 * in response to a gesture.
 */
export function InsideHead({ items, question, hintOpen, openLabel, close }: Props) {
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const face = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const objectId = useId();
  const current = card === null ? null : items[card];

  useEffect(() => {
    if (card === null) return;
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    return () => {
      element.close();
      opener.current?.focus({ preventScroll: true });
    };
  }, [card]);

  // Escape closes the open head from anywhere, but leaves an open card to its own dialog.
  useEffect(() => {
    if (!open || card !== null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
      setOpen(false);
      face.current?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, card]);

  return (
    <div className={styles.root}>
      <div className={styles.scene} data-open={open} data-head-scene>
        <Head className={styles.head} alive={!open} />
        <button ref={face} type="button" className={styles.faceButton} aria-label={`${open ? close : openLabel}: ${question}`} aria-expanded={open} aria-controls={objectId} onClick={() => setOpen(!open)} />
        <div id={objectId} inert={!open} aria-hidden={!open}>
          {items.map((item, index) => {
            const [x, y, rotation] = spots[index % spots.length];
            return (
              <button key={item.title} type="button" className={styles.object} aria-label={item.title} aria-haspopup="dialog"
                style={{ "--x": x, "--y": y, "--rotation": `${rotation}deg`, "--i": index } as CSSProperties}
                onClick={(event) => { opener.current = event.currentTarget; setCard(index); }}>
                <Icon name={item.icon} className={styles.icon} />
                <span className={styles.tooltip}>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-ui text-muted" aria-live="polite">{open ? hintOpen : question}</p>

      <noscript><ul className="text-ui">{items.map((item) => <li key={item.title}>{item.title}: {item.story}</li>)}</ul></noscript>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId} onCancel={() => setCard(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setCard(null); }}>
        {current && <div key={card} data-enter className={styles.story}>
          <div className={styles.storyTop}>
            <Icon name={current.icon} className={styles.storyIcon} />
            <button type="button" className="min-h-11 min-w-11 text-right text-ui" onClick={() => setCard(null)}>
              {close}
            </button>
          </div>
          <h3 id={titleId} className="font-display text-lead">{current.title}</h3>
          <p className="text-body">{current.story}</p>
          <p className="text-ui text-muted">{current.signature}</p>
        </div>}
      </dialog>
    </div>
  );
}
