"use client";

import { useEffect, useRef } from "react";

const hasModifier = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

/**
 * Keeps a modal `<dialog>` and the URL's `#id` in step (section 6.2): the page opening
 * with `#id`, or the hash changing to it, opens the dialog; any plain click on a link to
 * `#id` opens it without a new history entry; closing it drops the hash and gives focus
 * back to the link that opened it. Returns the ref for the dialog.
 */
export function useAnchorLayer(id: string) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const hash = `#${id}`;
    let opener: HTMLElement | null = null;

    const open = () => {
      if (!element.open) element.showModal();
    };
    const syncWithHash = () => {
      if (window.location.hash === hash) open();
      else if (element.open) element.close();
    };
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || hasModifier(event) || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(`a[href="${hash}"]`);
      if (!link) return;
      event.preventDefault();
      opener = link;
      window.history.replaceState(null, "", hash);
      open();
    };
    const handleClose = () => {
      if (window.location.hash === hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      opener?.focus({ preventScroll: true });
      opener = null;
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    document.addEventListener("click", handleClick);
    element.addEventListener("close", handleClose);
    return () => {
      window.removeEventListener("hashchange", syncWithHash);
      document.removeEventListener("click", handleClick);
      element.removeEventListener("close", handleClose);
    };
  }, [id]);

  return dialog;
}
