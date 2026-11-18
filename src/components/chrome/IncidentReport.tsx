"use client";

import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/get-dictionary";
import { MetaList } from "@/components/ui/MetaList";

/**
 * The 404's "incident" (section 6.6): status, the route that was asked for and the cause.
 * The route is read in the browser, so it is the address the visitor typed.
 */
interface Props {
  labels: Dictionary["notFound"];
  className?: string;
}

export function IncidentReport({ labels, className = "" }: Props) {
  const route = usePathname();

  return (
    <MetaList
      className={`[&_dd]:[overflow-wrap:anywhere] ${className}`}
      groups={[
        { label: labels.status, values: ["404"] },
        { label: labels.route, values: [route] },
        { label: labels.cause, values: [labels.causeText] },
      ]}
    />
  );
}
