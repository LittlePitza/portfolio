"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(false);
  const pending = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const copyAddress = async () => {
    if (pending.current) return;
    pending.current = true;
    try {
      await navigator.clipboard.writeText(email);
      if (!mounted.current) return;
      setError(null);
      clearTimeout(timer.current);
      setDone(true);
      timer.current = setTimeout(() => setDone(false), 2200);
    } catch {
      if (mounted.current) {
        setDone(false);
        setError(document.documentElement.lang.startsWith("es") ? "Selecciona y copia:" : "Select and copy:");
      }
    } finally {
      pending.current = false;
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button type="button" className={`btn ${done ? "btn-accent" : "btn-ink"}`} onClick={() => void copyAddress()}>
        <span aria-live="polite" aria-atomic="true">{done ? copied : copy}</span>
        <span aria-hidden="true">{done ? "✓" : "⧉"}</span>
      </button>
      {error && <span role="status" className="text-xs leading-relaxed">{error} <span className="select-all">{email}</span></span>}
    </span>
  );
}
