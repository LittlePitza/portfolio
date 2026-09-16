"use client";

import { createContext, useContext, useState } from "react";

interface Ctx {
  done: boolean;
  finish: () => void;
}

const PreloaderContext = createContext<Ctx>({ done: true, finish: () => {} });

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  return <PreloaderContext.Provider value={{ done, finish: () => setDone(true) }}>{children}</PreloaderContext.Provider>;
}

export function usePreloader() {
  return useContext(PreloaderContext);
}
