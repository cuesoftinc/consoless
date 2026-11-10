/**
 * LogoPlaceholder: the product name set in type. This is a placeholder
 * until the official Consoless mark is supplied. Never design a mark here.
 */

import { cn } from "@/lib/cn";

export interface LogoPlaceholderProps {
  className?: string;
}

export default function LogoPlaceholder({ className }: LogoPlaceholderProps) {
  return (
    <span
      data-testid="logo-placeholder"
      className={cn("text-heading-md text-text-primary", className)}
    >
      Consoless
    </span>
  );
}
