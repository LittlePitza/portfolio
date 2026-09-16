"use client";

import { useEffect, useState } from "react";

interface Props {
  locale: string;
  timeZone: string;
}

/** Update at minute boundaries and pause completely in background tabs. */
export function Clock({ locale, timeZone }: Props) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone });
    let timer: number | undefined;
    const update = () => {
      window.clearTimeout(timer);
      if (document.hidden) return;
      setTime(fmt.format(new Date()));
      timer = window.setTimeout(update, 60_000 - (Date.now() % 60_000));
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [locale, timeZone]);

  return (
    <span className="inline-block min-w-[5ch] tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"}
    </span>
  );
}
