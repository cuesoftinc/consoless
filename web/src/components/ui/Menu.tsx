"use client";

/**
 * Menu (docs/design.md section 3): a presentational list of actions.
 * It has no popover wiring: the caller places it. Arrow Up and Down move
 * focus between the items, Home and End jump to the ends. A selected item
 * carries a check as well as the accent text.
 */

import type { KeyboardEvent, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type MenuItemKind = "default" | "danger";

export interface MenuProps {
  /** Accessible name. */
  "aria-label": string;
  children: ReactNode;
  className?: string;
}

export interface MenuItemProps {
  children: ReactNode;
  onSelect?: () => void;
  selected?: boolean;
  kind?: MenuItemKind;
  disabled?: boolean;
}

function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  const { key } = event;
  if (
    key !== "ArrowDown" &&
    key !== "ArrowUp" &&
    key !== "Home" &&
    key !== "End"
  ) {
    return;
  }
  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="menuitem"]:not(:disabled)',
    ),
  );
  if (items.length === 0) return;
  event.preventDefault();
  const current = items.indexOf(document.activeElement as HTMLButtonElement);
  let next: number;
  if (key === "Home") next = 0;
  else if (key === "End") next = items.length - 1;
  else if (key === "ArrowDown") next = (current + 1) % items.length;
  else next = current <= 0 ? items.length - 1 : current - 1;
  items[next].focus();
}

export default function Menu({
  "aria-label": ariaLabel,
  children,
  className,
}: MenuProps) {
  return (
    <div
      role="menu"
      aria-label={ariaLabel}
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      className={cn(
        "w-62 rounded-md border border-border-strong bg-bg-raised p-1 shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MenuItem({
  children,
  onSelect,
  selected = false,
  kind = "default",
  disabled = false,
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      data-kind={kind}
      data-selected={selected ? "true" : "false"}
      aria-current={selected ? "true" : undefined}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-body-sm",
        "hover:bg-bg-hover focus-visible:bg-bg-hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-40",
        kind === "danger"
          ? "text-danger-text"
          : selected
            ? "text-accent-text"
            : "text-text-primary",
      )}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {selected ? (
        <Check
          aria-hidden
          data-testid="menu-item-check"
          className="h-4 w-4 shrink-0"
        />
      ) : null}
    </button>
  );
}
