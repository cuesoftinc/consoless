"use client";

/**
 * VersionItem (docs/design.md section 3): one row in version history.
 * The current version is outlined and says "Current" in its badge; other
 * rows say where the version came from.
 */

import { cn } from "@/lib/cn";
import Badge from "./Badge";

export type VersionSource = "Generated" | "Edited" | "Restored" | "Remixed";
export type VersionItemState = "current" | "selected" | "default";

export interface VersionItemProps {
  version: number;
  summary: string;
  /** Already formatted, for example "2 minutes ago". */
  time: string;
  source: VersionSource;
  /** The version the project is on. */
  current?: boolean;
  /** The version open in the preview. */
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export default function VersionItem({
  version,
  summary,
  time,
  source,
  current = false,
  selected = false,
  onSelect,
  className,
}: VersionItemProps) {
  const state: VersionItemState = current
    ? "current"
    : selected
      ? "selected"
      : "default";

  return (
    <button
      type="button"
      data-state={state}
      aria-current={current ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col gap-1 rounded-md p-3 text-left hover:bg-bg-hover",
        "transition-colors duration-fast ease-enter motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        // The transparent border keeps the row the same size in every state.
        current ? "border border-accent-default" : "border border-transparent",
        selected ? "bg-bg-hover" : current && "bg-bg-raised",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <span className="text-label-md text-text-primary">
          Version {version}
        </span>
        {current ? (
          <Badge kind="accent">Current</Badge>
        ) : (
          <Badge kind="neutral">{source}</Badge>
        )}
      </span>
      <span className="line-clamp-2 text-body-sm text-text-secondary">
        {summary}
      </span>
      <span className="text-caption text-text-muted">{time}</span>
    </button>
  );
}
