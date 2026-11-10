"use client";

/**
 * Toggle (docs/design.md section 3) on Radix Switch. The accessible name
 * is required at the type level: pass a visible `label` (drawn to the
 * left), or an `aria-label`. MI-4: the knob slides over duration-fast.
 */

import { useId } from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

interface ToggleBaseProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  /** Merged onto the wrapper. */
  className?: string;
}

export type ToggleProps = ToggleBaseProps &
  (
    | { /** Visible label, to the left of the track. */ label: string }
    | {
        /** Accessible name when there is no visible label. */ "aria-label": string;
      }
  );

export default function Toggle(props: ToggleProps) {
  const { checked, onCheckedChange, disabled = false, id, className } = props;
  const label = "label" in props ? props.label : undefined;
  const ariaLabel = "aria-label" in props ? props["aria-label"] : undefined;
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <span
      data-testid="toggle-root"
      data-state={checked ? "on" : "off"}
      className={cn("inline-flex items-center gap-3", className)}
    >
      {label !== undefined ? (
        <label
          htmlFor={switchId}
          className={cn(
            "text-label-md text-text-primary",
            disabled && "cursor-not-allowed opacity-40",
          )}
        >
          {label}
        </label>
      ) : null}
      <RadixSwitch.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label === undefined ? ariaLabel : undefined}
        className={cn(
          "group inline-flex h-6 w-10 shrink-0 items-center rounded-full border p-0.5",
          "data-[state=unchecked]:border-border-strong data-[state=unchecked]:bg-bg-hover",
          "data-[state=checked]:border-transparent data-[state=checked]:bg-accent-default",
          "transition-colors duration-fast ease-move motion-reduce:transition-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <RadixSwitch.Thumb
          data-testid="toggle-knob"
          className={cn(
            "-ml-px block h-5 w-5 shrink-0 rounded-full",
            "data-[state=unchecked]:bg-text-muted data-[state=checked]:bg-accent-on-accent",
            "data-[state=checked]:translate-x-4",
            "transition-transform duration-fast ease-move motion-reduce:transition-none",
          )}
        />
      </RadixSwitch.Root>
    </span>
  );
}
