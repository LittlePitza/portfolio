"use client";

import { useEffect } from "react";

/**
 * When the visitor switches to another tab, the title takes turns between two
 * short lines until they come back. The original title is restored on return.
 */
export function TabTitle({ messages }: { messages: [string, string] }) {
  useEffect(() => {
    let original = document.title;
    let timer: number | undefined;
    let flip = 0;

    const onChange = () => {
      if (document.hidden) {
        original = document.title;
        const tick = () => {
          document.title = messages[flip % 2]!;
          flip += 1;
          timer = window.setTimeout(tick, 1600);
        };
        tick();
      } else {
        window.clearTimeout(timer);
        document.title = original;
      }
    };

    document.addEventListener("visibilitychange", onChange);
    return () => {
      document.removeEventListener("visibilitychange", onChange);
      window.clearTimeout(timer);
    };
  }, [messages]);

  return null;
}
