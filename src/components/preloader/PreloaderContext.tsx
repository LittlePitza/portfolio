"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface Ctx {
  done: boolean;
  finish: () => void;
}

const PreloaderContext = createContext<Ctx>({ done: true, finish: () => {} });

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  const value = useMemo(() => ({ done, finish }), [done, finish]);
  return <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>;
}

export function usePreloader() {
  return useContext(PreloaderContext);
}
