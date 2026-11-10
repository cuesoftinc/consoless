"use client";

/**
 * TouchControls: on-screen controls for phones. A d-pad of four buttons
 * and two round action buttons, B lower-left and A upper-right. Every
 * target is at least 44px. Input fires on click, so keyboard and
 * assistive technology work too; touch-manipulation removes the
 * double-tap delay on touch screens.
 */

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type TouchControlsButton = "up" | "down" | "left" | "right" | "a" | "b";

export interface TouchControlsProps {
  onInput?: (button: TouchControlsButton) => void;
  className?: string;
}

const PRESS = cn(
  "inline-flex touch-manipulation items-center justify-center border border-border-strong bg-bg-raised select-none",
  "transition-colors duration-fast ease-enter hover:bg-bg-hover active:bg-bg-hover motion-reduce:transition-none",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
);

const DPAD: Array<{
  button: TouchControlsButton;
  label: string;
  icon: LucideIcon;
  cell: string;
}> = [
  {
    button: "up",
    label: "Up",
    icon: ChevronUp,
    cell: "col-start-2 row-start-1",
  },
  {
    button: "left",
    label: "Left",
    icon: ChevronLeft,
    cell: "col-start-1 row-start-2",
  },
  {
    button: "right",
    label: "Right",
    icon: ChevronRight,
    cell: "col-start-3 row-start-2",
  },
  {
    button: "down",
    label: "Down",
    icon: ChevronDown,
    cell: "col-start-2 row-start-3",
  },
];

const ACTION =
  "absolute h-14 w-14 rounded-full text-label-md text-text-primary";

export default function TouchControls({
  onInput,
  className,
}: TouchControlsProps) {
  return (
    <div
      data-testid="touch-controls"
      className={cn("flex items-center justify-between px-6 py-4", className)}
    >
      <div className="grid h-33 w-33 grid-cols-3 grid-rows-3">
        {DPAD.map(({ button, label, icon: Icon, cell }) => (
          <button
            key={button}
            type="button"
            aria-label={label}
            data-button={button}
            onClick={() => onInput?.(button)}
            className={cn(
              PRESS,
              "h-11 w-11 rounded-md text-text-primary",
              cell,
            )}
          >
            <Icon aria-hidden className="h-5 w-5" />
          </button>
        ))}
      </div>
      <div className="relative h-24 w-30">
        <button
          type="button"
          aria-label="B button"
          data-button="b"
          onClick={() => onInput?.("b")}
          className={cn(PRESS, ACTION, "bottom-0 left-0")}
        >
          B
        </button>
        <button
          type="button"
          aria-label="A button"
          data-button="a"
          onClick={() => onInput?.("a")}
          className={cn(PRESS, ACTION, "top-0 right-0")}
        >
          A
        </button>
      </div>
    </div>
  );
}
