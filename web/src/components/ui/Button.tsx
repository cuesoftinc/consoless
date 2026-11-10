/**
 * Button (docs/design.md section 3). Kinds: primary carries the main action
 * of a view; secondary and ghost are supporting actions; danger is for
 * destructive confirms; quiet-danger is the row-level destructive action
 * (danger text on quiet chrome). Sizes md (44px) and sm (36px).
 * MI-1: the fill eases over duration-fast and the button scales to 0.98 on
 * press. Disabled is 40% opacity.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonKind =
  "primary" | "secondary" | "ghost" | "danger" | "quiet-danger";
export type ButtonSize = "md" | "sm";

const KIND_CLASSES: Record<ButtonKind, string> = {
  primary: "bg-accent-default text-accent-on-accent hover:bg-accent-hover",
  secondary:
    "border border-border-strong bg-bg-raised text-text-primary hover:bg-bg-hover",
  ghost:
    "bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary",
  danger: "bg-danger-default text-danger-on-danger hover:opacity-90",
  "quiet-danger": "bg-transparent text-danger-text hover:bg-bg-hover",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-11 px-4",
  sm: "h-9 px-3",
};

/** Classes for a button-styled element, so links can share the look. */
export function buttonClasses(
  kind: ButtonKind = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-label-md select-none",
    "transition-[background-color,color,opacity,transform] duration-fast ease-enter",
    "active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
    KIND_CLASSES[kind],
    SIZE_CLASSES[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ButtonKind;
  size?: ButtonSize;
  /** Leading Lucide icon, drawn at 16px. */
  icon?: LucideIcon;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  kind = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      data-kind={kind}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(kind, size, className)}
      {...rest}
    >
      {loading ? (
        <span
          data-testid="button-spinner"
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        />
      ) : Icon ? (
        <Icon aria-hidden data-testid="button-icon" className="h-4 w-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
