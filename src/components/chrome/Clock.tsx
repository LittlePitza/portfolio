"use client";

import { useEffect, useState } from "react";

interface Props {
  locale: string;
  timeZone: string;
}

/** Local time in the author's city, refreshed every 30 seconds. */
export function Clock({ locale, timeZone }: Props) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [locale, timeZone]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"}
    </span>
  );
}
