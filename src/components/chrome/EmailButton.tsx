"use client";

import { useCopyText, type CopyStatus } from "@/components/ui/useCopyText";

interface Labels {
  /** "Correo": the label at rest. */
  idle: string;
  copied: string;
  failed: string;
}

interface Props {
  email: string;
  labels: Labels;
  className?: string;
}

function labelFor(status: CopyStatus, labels: Labels) {
  if (status === "copied") return labels.copied;
  if (status === "failed") return labels.failed;
  return labels.idle;
}

/**
 * The frame's email: a label over the address, which copies itself when pressed
 * (section 5.1). The label turns "Copiado" for two seconds and a polite live region
 * says so; if the browser refuses, the label asks the visitor to select and copy.
 */
export function EmailButton({ email, labels, className = "" }: Props) {
  const { status, copy } = useCopyText(email);
  const label = labelFor(status, labels);

  return (
    <div className={className}>
      <p className="text-muted">{label}</p>
      <button type="button" className="select-all" onClick={() => void copy()}>
        {email}
      </button>
      <span role="status" className="sr-only">
        {status === "idle" ? "" : label}
      </span>
    </div>
  );
}
