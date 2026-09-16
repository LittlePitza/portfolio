"use client";

import { useEffect } from "react";

/**
 * A single quiet farewell replaces repeated timers in background tabs.
 */
export function TabTitle({ messages }: { messages: [string, string] }) {
  useEffect(() => {
    let original = document.title;
    let awayTitle: string | null = null;

    const onChange = () => {
      if (document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        original = document.title;
        awayTitle = messages[0];
        document.title = awayTitle;
      } else if (awayTitle) {
        // Do not overwrite metadata if a route changed while this tab was hidden.
        if (document.title === awayTitle) document.title = original;
        awayTitle = null;
      }
    };

    document.addEventListener("visibilitychange", onChange);
    return () => {
      document.removeEventListener("visibilitychange", onChange);
      if (awayTitle && document.title === awayTitle) document.title = original;
    };
  }, [messages]);

  return null;
}
