"use client";

/**
 * StyleCard (docs/design.md section 3): one console style in the picker.
 * A radio: the parent wraps the cards in a role="radiogroup". Selection
 * is exposed through aria-checked, not through the border colour alone.
 */

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StyleCardProps {
  name: string;
  /** One-line spec of the console, for example "160 x 144, 4 colours". */
  spec: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect?: () => void;
  className?: string;
}

export default function StyleCard({
  name,
  spec,
  icon: Icon,
  selected,
  onSelect,
  className,
}: StyleCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-selected={selected}
      onClick={onSelect}
      className={cn(
        "flex w-34 flex-col gap-2 rounded-lg bg-bg-raised p-3 text-left",
        "transition-colors duration-fast ease-enter motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        selected
          ? "border-2 border-accent-default"
          : "border border-border-default",
        className,
      )}
    >
      <Icon
        aria-hidden
        data-testid="style-card-icon"
        className={cn(
          "h-6 w-6",
          selected ? "text-accent-text" : "text-text-secondary",
        )}
      />
      <span className="text-label-md text-text-primary">{name}</span>
      <span className="text-caption text-text-muted">{spec}</span>
    </button>
  );
}
