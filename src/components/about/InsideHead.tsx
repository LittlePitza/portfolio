"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/Icons";
import type { HeadIcon } from "@/content/head";
import { Head } from "./Head";
import styles from "./InsideHead.module.css";

export interface HeadItemView { icon: HeadIcon; title: string; story: string; signature: string; }
interface Props {
  items: HeadItemView[]; question: string; hint: string; hintOpen: string;
  openLabel: string; close: string;
  left: { value: string; label: string }; right: { value: string; label: string };
}
const spots = [[-.64, -.12, -14], [-.48, -.43, -9], [-.26, -.64, -5], [0, -.72, 5], [.27, -.64, 9], [.49, -.43, 14], [.65, -.12, 18]];

/** The scene has no animation loop: objects move only in response to a gesture. */
export function InsideHead({ items, question, hint, hintOpen, openLabel, close, left, right }: Props) {
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const objectId = useId();
  const current = card === null ? null : items[card];

  useEffect(() => {
    if (card === null) return;
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      document.documentElement.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [card]);

  return (
    <div className={styles.root}>
      <div className={styles.caption}>
        <span className="label text-muted">01 / {left.label}</span>
        <h2 className={styles.question}>{question}</h2>
        <button type="button" className={styles.toggle} onClick={() => setOpen(!open)} aria-label={open ? close : openLabel} aria-expanded={open} aria-controls={objectId}>
          <span className={styles.toggleIcon} aria-hidden>{open ? "−" : "+"}</span>
          <span>{open ? close : openLabel}</span>
        </button>
        <p className={styles.hint}>{open ? hintOpen : hint}</p>
      </div>

      <div className={styles.stage}>
        <div className={styles.scene} data-open={open} onKeyDown={(event) => {
          if (event.key === "Escape" && card === null) setOpen(false);
        }}>
          <div className={styles.ring} aria-hidden />
          <Head className={styles.head} />
          <button type="button" className={styles.faceButton} aria-label={`${open ? close : openLabel}: ${question}`} aria-expanded={open} aria-controls={objectId} onClick={() => setOpen(!open)} />
          <div id={objectId} inert={!open} aria-hidden={!open}>
            {items.map((item, index) => {
              const [x, y, rotation] = spots[index % spots.length];
              return (
                <button key={item.title} type="button" className={styles.object} aria-label={item.title} aria-haspopup="dialog"
                  style={{ "--x": x, "--y": y, "--rotation": `${rotation}deg`, "--delay": `${index * 35}ms` } as CSSProperties}
                  onClick={(event) => { opener.current = event.currentTarget; setCard(index); }}>
                  <Icon name={item.icon} className={styles.icon} />
                  <span className={styles.tooltip}>{item.title}</span>
                </button>
              );
            })}
          </div>
          <span className={`label ${styles.signature}`} aria-hidden>LUIS H. — {open ? "07" : "01"} / 07</span>
        </div>
      </div>

      <div className={styles.figures}>
        {[left, right].map((figure) => <div key={figure.label} className={styles.figure}>
          <p className={styles.number}>{figure.value}<span aria-hidden>↗</span></p>
          <p className="label text-muted">{figure.label}</p>
        </div>)}
      </div>

      <noscript><ul className="label">{items.map((item) => <li key={item.title}>{item.title}: {item.story}</li>)}</ul></noscript>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId} data-lenis-prevent onCancel={() => setCard(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setCard(null); }}>
        {current && <div className={styles.story}>
          <div className={styles.storyTop}>
            <Icon name={current.icon} className={styles.storyIcon} />
            <button type="button" className="btn btn-square" onClick={() => setCard(null)} aria-label={close}>×</button>
          </div>
          <p className="label text-muted">{String((card ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</p>
          <h3 id={titleId} className={styles.storyTitle}>{current.title}</h3>
          <p className={styles.storyText}>{current.story}</p>
          <p className={styles.storySignature}>— {current.signature}</p>
        </div>}
      </dialog>
    </div>
  );
}
