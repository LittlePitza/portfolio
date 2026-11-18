"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "copied" | "failed";

/** How long "copied" stays on screen (section 5.1). */
const COPIED_MS = 2000;

/**
 * Copies `text` to the clipboard. `status` turns "copied" for two seconds, or "failed"
 * when the browser refuses (no permission, insecure context), so the caller can offer
 * the text to select by hand. Clicks during a copy in flight are ignored.
 */
export function useCopyText(text: string) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<number | undefined>(undefined);
  const mounted = useRef(false);
  const pending = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    try {
      await navigator.clipboard.writeText(text);
      if (!mounted.current) return;
      window.clearTimeout(timer.current);
      setStatus("copied");
      timer.current = window.setTimeout(() => setStatus("idle"), COPIED_MS);
    } catch {
      if (mounted.current) setStatus("failed");
    } finally {
      pending.current = false;
    }
  }, [text]);

  return { status, copy };
}
