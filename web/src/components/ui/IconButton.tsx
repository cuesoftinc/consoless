"use client";

/**
 * IconButton (docs/design.md section 3): a 36px square action with one
 * Lucide icon. The accessible name is required, because there is no
 * visible label. Hover follows MI-1.
 */

import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type IconButtonKind = "ghost" | "secondary";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> {
  icon: LucideIcon;
  /** Accessible name. */
  "aria-label": string;
  kind?: IconButtonKind;
}

const KIND_CLASSES: Record<IconButtonKind, string> = {
  ghost: "bg-transparent",
  secondary: "border border-border-strong bg-bg-raised",
};

export default function IconButton({
  icon: Icon,
  kind = "ghost",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      data-kind={kind}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary",
        "transition-colors duration-fast ease-enter hover:bg-bg-hover hover:text-text-primary motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-40",
        KIND_CLASSES[kind],
        className,
      )}
      {...rest}
    >
      <Icon aria-hidden data-testid="icon-button-icon" className="h-5 w-5" />
    </button>
  );
}
