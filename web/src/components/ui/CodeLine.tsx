/**
 * CodeLine (docs/design.md section 3): one numbered line of game code.
 * Added and error lines are tinted, and say so to screen readers in a
 * visually hidden prefix. The line number is decoration for assistive
 * technology.
 */

import { cn } from "@/lib/cn";

export type CodeLineKind = "default" | "added" | "error";

const KIND_CLASSES: Record<CodeLineKind, string> = {
  default: "",
  added: "bg-success-subtle",
  error: "bg-danger-subtle",
};

const KIND_PREFIX: Record<CodeLineKind, string | null> = {
  default: null,
  added: "Added: ",
  error: "Error: ",
};

export interface CodeLineProps {
  /** The 1-based line number. */
  number: number;
  code: string;
  kind?: CodeLineKind;
  className?: string;
}

export default function CodeLine({
  number,
  code,
  kind = "default",
  className,
}: CodeLineProps) {
  const prefix = KIND_PREFIX[kind];
  return (
    <div
      data-testid="code-line"
      data-kind={kind}
      className={cn(
        "flex items-center gap-4 px-3",
        KIND_CLASSES[kind],
        className,
      )}
    >
      <span
        aria-hidden
        data-testid="code-line-number"
        className="w-6 shrink-0 text-right font-mono text-code-sm text-text-muted select-none"
      >
        {number}
      </span>
      {prefix ? <span className="sr-only">{prefix}</span> : null}
      <code
        data-testid="code-line-code"
        className="min-w-0 flex-1 truncate font-mono text-code-md whitespace-pre text-text-primary"
      >
        {/* A non-breaking space keeps an empty line at full height. */}
        {code === "" ? "\u00A0" : code}
      </code>
    </div>
  );
}
