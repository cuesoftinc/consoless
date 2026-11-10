"use client";

/**
 * Checkbox (docs/design.md section 3) on Radix Checkbox. The accessible
 * name is required at the type level: pass a visible `label`, or an
 * `aria-label` when the box stands alone (a table row, for example).
 */

import { useId } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface CheckboxBaseProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  /** Merged onto the wrapper. */
  className?: string;
}

export type CheckboxProps = CheckboxBaseProps &
  (
    | { /** Visible label, to the right of the box. */ label: string }
    | {
        /** Accessible name when there is no visible label. */ "aria-label": string;
      }
  );

export default function Checkbox(props: CheckboxProps) {
  const { checked, onCheckedChange, disabled = false, id, className } = props;
  const label = "label" in props ? props.label : undefined;
  const ariaLabel = "aria-label" in props ? props["aria-label"] : undefined;
  const generatedId = useId();
  const boxId = id ?? generatedId;

  return (
    <span
      data-testid="checkbox-root"
      data-state={checked ? "checked" : "unchecked"}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <RadixCheckbox.Root
        id={boxId}
        checked={checked}
        onCheckedChange={(next) => onCheckedChange(next === true)}
        disabled={disabled}
        aria-label={label === undefined ? ariaLabel : undefined}
        className={cn(
          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm",
          "data-[state=unchecked]:border data-[state=unchecked]:border-border-strong data-[state=unchecked]:bg-bg-inset",
          "data-[state=checked]:bg-accent-default",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <RadixCheckbox.Indicator>
          <Check
            aria-hidden
            data-testid="checkbox-check"
            className="h-4 w-4 text-accent-on-accent"
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label !== undefined ? (
        <label
          htmlFor={boxId}
          className={cn(
            "text-body-sm text-text-primary",
            disabled && "cursor-not-allowed opacity-40",
          )}
        >
          {label}
        </label>
      ) : null}
    </span>
  );
}
