"use client";

/**
 * RadioGroup (docs/design.md section 3) on Radix RadioGroup: a vertical
 * set of single-choice options. Each RadioItem is a 20px circle with a
 * visible label. The chosen item shows a filled dot, so colour is not the
 * only signal.
 */

import { useId, type ReactNode } from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

export interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name. */
  "aria-label": string;
  /** RadioItem elements. */
  children: ReactNode;
  className?: string;
}

export interface RadioItemProps {
  value: string;
  /** Visible label, to the right of the circle. */
  label: string;
  disabled?: boolean;
}

export default function RadioGroup({
  value,
  onValueChange,
  "aria-label": ariaLabel,
  children,
  className,
}: RadioGroupProps) {
  return (
    <RadixRadioGroup.Root
      value={value}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
      orientation="vertical"
      className={cn("flex flex-col gap-3", className)}
    >
      {children}
    </RadixRadioGroup.Root>
  );
}

export function RadioItem({ value, label, disabled = false }: RadioItemProps) {
  const id = useId();

  return (
    <span className="inline-flex items-center gap-2">
      <RadixRadioGroup.Item
        id={id}
        value={value}
        disabled={disabled}
        className={cn(
          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg-inset",
          "data-[state=checked]:border-2 data-[state=checked]:border-accent-default",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <RadixRadioGroup.Indicator
          data-testid="radio-dot"
          className="h-2.5 w-2.5 rounded-full bg-accent-default"
        />
      </RadixRadioGroup.Item>
      <label
        htmlFor={id}
        className={cn(
          "text-body-sm text-text-primary",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        {label}
      </label>
    </span>
  );
}
