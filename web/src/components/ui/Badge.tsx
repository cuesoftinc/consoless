/**
 * Badge (docs/design.md section 3): a short status or category label.
 * Colour is never the only signal: the label states the status in words.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeKind =
  "neutral" | "accent" | "brand" | "retro" | "success" | "warning" | "danger";

const KIND_CLASSES: Record<BadgeKind, string> = {
  neutral: "bg-bg-raised text-text-secondary",
  accent: "bg-accent-subtle text-accent-text",
  brand: "bg-brand-subtle text-brand-text",
  retro: "bg-retro-subtle text-retro-text",
  success: "bg-success-subtle text-success-text",
  warning: "bg-warning-subtle text-warning-text",
  danger: "bg-danger-subtle text-danger-text",
};

export interface BadgeProps {
  kind?: BadgeKind;
  children: ReactNode;
  className?: string;
}

export default function Badge({
  kind = "neutral",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      data-kind={kind}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-label-sm whitespace-nowrap",
        KIND_CLASSES[kind],
        className,
      )}
    >
      {children}
    </span>
  );
}
