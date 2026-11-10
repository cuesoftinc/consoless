/**
 * EmptyState (docs/design.md section 3): the first-run and no-results
 * state. One icon, one title, one line of help and at most one action.
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Usually a Button. */
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className={cn(
        "mx-auto flex max-w-120 flex-col items-center gap-4 p-12 text-center",
        className,
      )}
    >
      <span
        data-testid="empty-state-badge"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle"
      >
        <Icon
          aria-hidden
          data-testid="empty-state-icon"
          className="h-8 w-8 text-accent-text"
        />
      </span>
      <h2 className="text-heading-md text-text-primary">{title}</h2>
      <p className="text-body-md text-text-secondary">{body}</p>
      {action}
    </div>
  );
}
