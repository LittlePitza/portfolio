"use client";

import { useCopyText } from "@/components/ui/useCopyText";

interface Props {
  email: string;
  labels: {
    /** "Escríbeme": the line over the address. */
    lead: string;
    /** "Copiar correo". */
    copy: string;
    copied: string;
    /** Shown when the browser refuses the copy; the address is then selectable by hand. */
    failed: string;
    /** "Abrir en tu correo →". */
    mailto: string;
  };
  className?: string;
}

const ACTION =
  "inline-flex min-h-11 items-center underline decoration-line underline-offset-4 " +
  "transition-colors duration-(--dur-fast) ease-(--ease) hover:decoration-ink stage:min-h-6";

/**
 * Contact's main element (section 6.3): the address at heading size, which copies itself
 * when pressed, and under it the two ways to use it. "Copied" is announced by a polite
 * live region and also shows on the action; a refused copy says so and leaves the
 * address selectable.
 */
export function ContactEmail({ email, labels, className = "" }: Props) {
  const { status, copy } = useCopyText(email);
  const message = status === "copied" ? labels.copied : status === "failed" ? labels.failed : "";

  return (
    <div className={className}>
      <p className="text-ui text-muted">{labels.lead}</p>
      <button
        type="button"
        onClick={() => void copy()}
        className="mt-2 block min-h-11 text-left font-display text-lead [overflow-wrap:anywhere]
          select-all underline decoration-transparent underline-offset-4
          transition-colors duration-(--dur-fast) ease-(--ease) hover:decoration-ink
          stage:text-heading"
      >
        {email}
      </button>
      <div className="mt-2 flex flex-wrap gap-x-6 text-ui">
        <button type="button" onClick={() => void copy()} className={ACTION}>
          {status === "copied" ? labels.copied : labels.copy}
        </button>
        <a href={`mailto:${email}`} className={ACTION}>
          {labels.mailto}
        </a>
      </div>
      <span role="status" className="sr-only">
        {message}
      </span>
      {status === "failed" && <p className="text-ui text-muted">{labels.failed}</p>}
    </div>
  );
}
