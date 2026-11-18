import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether `query` (one of MQ in src/lib/motion.ts) holds, kept current as it changes.
 * False on the server and while hydrating, so the server's markup is never contradicted;
 * the real value follows straight after.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
