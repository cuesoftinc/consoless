"use client";

/**
 * ThemeToggle: the ecosystem theme control for the marketing nav and the
 * dashboard chrome. One icon button cycling light → dark → system, with a
 * distinct icon per mode (sun, moon, monitor) and an aria-label announcing
 * the active mode and the mode a press switches to.
 */

import { Monitor, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme, type ThemePreference } from "@/design/ThemeProvider";
import { cn } from "@/lib/cn";

/** light → dark → system → light. */
export const THEME_CYCLE: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export const THEME_ICONS: Record<ThemePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

/** Accessible name: announces the active mode and the next one. */
export function themeToggleLabel(preference: ThemePreference): string {
  return `Theme: ${preference} — switch to ${THEME_CYCLE[preference]}`;
}

export interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { preference, setPreference } = useTheme();
  const Icon = THEME_ICONS[preference];
  return (
    <button
      type="button"
      data-testid="theme-toggle"
      aria-label={themeToggleLabel(preference)}
      onClick={() => setPreference(THEME_CYCLE[preference])}
      className={cn(
        "rounded-md p-2 text-text-secondary transition-colors duration-fast ease-enter",
        "hover:bg-bg-hover hover:text-text-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        className,
      )}
    >
      <Icon aria-hidden className="h-5 w-5" />
    </button>
  );
}
