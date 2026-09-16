"use client";

import { useEffect, useState } from "react";
import { checkForUpdate } from "@/lib/version";

const POLL_MS = 60_000;

/**
 * Keeps every open tab on the latest deployment.
 *
 * - Coming back to the tab, focusing the window, or restoring the page from the
 *   back/forward cache: if a newer deployment is live, reload straight away.
 * - While the visitor stays on the page: check every minute and offer a one-tap
 *   refresh instead of pulling the page out from under them.
 * - Internal navigation checks as well and loads the new version (see PageTransition).
 */
export function UpdateWatcher({ message, action }: { message: string; action: string }) {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    const reloadIfStale = (force = false) => {
      void checkForUpdate(force).then((isNewer) => {
        if (isNewer) window.location.reload();
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") reloadIfStale();
    };
    const onFocus = () => reloadIfStale();
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) reloadIfStale(true);
    };
    const poll = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void checkForUpdate().then((isNewer) => {
        if (isNewer) setStale(true);
      });
    }, POLL_MS);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  if (!stale) return null;

  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-16 z-[54] flex justify-center px-4 md:bottom-20">
      <div className="brutal-accent pointer-events-auto flex items-center gap-4 bg-ink py-2 pl-4 pr-2 text-bg">
        <span className="label">{message}</span>
        <button type="button" className="btn btn-accent py-2" onClick={() => window.location.reload()}>
          {action} <span aria-hidden>↻</span>
        </button>
      </div>
    </div>
  );
}
