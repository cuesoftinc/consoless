"use client";

/**
 * Select (docs/design.md section 3): a labelled single-choice list on
 * Radix Select. The trigger matches the Input field. The list opens in a
 * portal on the overlay layer, and the chosen option carries a check as
 * well as the accent text.
 */

import { useId } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Visible label, wired to the trigger. */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** Merged onto the wrapper. */
  className?: string;
}

export default function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  disabled = false,
  className,
}: SelectProps) {
  const labelId = useId();

  return (
    <div
      data-testid="select-root"
      data-state={disabled ? "disabled" : "default"}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      <span id={labelId} className="text-label-md text-text-secondary">
        {label}
      </span>
      <RadixSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          aria-labelledby={labelId}
          className={cn(
            "flex h-12 w-full items-center justify-between gap-2 rounded-md border border-border-default bg-bg-inset px-3 text-left text-body-md text-text-primary",
            "data-[placeholder]:text-text-muted",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            "disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <span className="min-w-0 truncate">
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon asChild>
            <ChevronDown
              aria-hidden
              className="h-4 w-4 shrink-0 text-text-muted"
            />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            collisionPadding={8}
            className="z-overlay min-w-(--radix-select-trigger-width) rounded-md border border-border-strong bg-bg-raised p-1 shadow-md"
          >
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex cursor-default items-center gap-2 rounded-sm px-3 py-2 text-body-sm text-text-primary outline-none select-none",
                    "data-[highlighted]:bg-bg-hover data-[state=checked]:text-accent-text",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  </span>
                  <RadixSelect.ItemIndicator>
                    <Check
                      aria-hidden
                      data-testid="select-item-check"
                      className="h-4 w-4 shrink-0"
                    />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
