"use client";

/**
 * Tabs (docs/design.md section 3): a controlled tab bar for in-page
 * panels. WAI-ARIA tabs with automatic activation: ArrowLeft, ArrowRight,
 * Home and End move focus and selection together, with a roving tabindex.
 * Ids come from the tab `id` (callers pass slugs), never from the label.
 * MI-3: the active underline eases over duration-base; the panel content
 * dissolve belongs to the panel's owner.
 */

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  /** Slug-safe id, used for the tab and panel DOM ids. */
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Id of the selected tab. */
  value: string;
  onChange: (id: string) => void;
  "aria-label": string;
  className?: string;
}

export default function Tabs({
  tabs,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: TabsProps) {
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  // Roving focus falls back to the first tab when the value matches none.
  const rovingId = tabs.some((tab) => tab.id === value) ? value : tabs[0]?.id;

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next === -1) return;
    event.preventDefault();
    const target = tabs[next];
    buttons.current.get(target.id)?.focus();
    if (target.id !== value) onChange(target.id);
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex gap-6", className)}
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) buttons.current.set(tab.id, node);
              else buttons.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={tab.id === rovingId ? 0 : -1}
            data-state={selected ? "active" : "inactive"}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "border-b-2 px-1 py-3 text-label-md whitespace-nowrap",
              "transition-colors duration-base ease-move motion-reduce:transition-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
              selected
                ? "border-accent-default text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  /** The id of the tab this panel belongs to. */
  id: string;
  active: boolean;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, active, children, className }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!active}
      className={className}
    >
      {children}
    </div>
  );
}
