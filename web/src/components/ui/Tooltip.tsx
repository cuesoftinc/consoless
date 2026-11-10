"use client";

/**
 * Tooltip (docs/design.md section 3) on Radix Tooltip: a short caption
 * shown on hover or focus of its trigger, after 400ms. The provider lives
 * inside the component, so callers need no setup. A tooltip never carries
 * the only copy of information: the trigger keeps its own name.
 */

import type { ReactElement } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";

export type TooltipSide = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  /** The caption. */
  label: string;
  /** The trigger: one element that can take a ref and focus. */
  children: ReactElement;
  side?: TooltipSide;
  /** Merged onto the caption. */
  className?: string;
}

export default function Tooltip({
  label,
  children,
  side = "top",
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={400}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={4}
            collisionPadding={8}
            data-testid="tooltip-content"
            className={cn(
              "z-overlay rounded-sm border border-border-strong bg-bg-raised px-2 py-1 text-caption text-text-primary shadow-sm",
              className,
            )}
          >
            {label}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
