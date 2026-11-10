/**
 * Avatar (docs/design.md section 3): the user's initials on the accent
 * tint. Sizes sm (24px), md (32px) and lg (48px).
 */

import { cn } from "@/lib/cn";

export type AvatarSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "h-6 w-6 text-label-sm",
  md: "h-8 w-8 text-label-sm",
  lg: "h-12 w-12 text-label-md",
};

/** "Ada Okafor" → "AO"; a single name gives its first two letters. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface AvatarProps {
  /** The person's name: the source of the initials and the accessible name. */
  name: string;
  size?: AvatarSize;
  className?: string;
}

export default function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      data-size={size}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-text select-none",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <span aria-hidden>{initialsOf(name)}</span>
    </span>
  );
}
