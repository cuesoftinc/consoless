import {
  Gamepad2,
  Joystick,
  Monitor,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { ConsoleStyleId } from "@/models";

export interface StyleOption {
  id: ConsoleStyleId;
  name: string;
  spec: string;
  icon: LucideIcon;
}

/** The five Stage 1 console styles (CON-003), as the pickers show them. */
export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "handheld",
    name: "Handheld",
    spec: "Small screen, four greens",
    icon: Smartphone,
  },
  {
    id: "8bit",
    name: "8-bit",
    spec: "Chunky pixels, bright colours",
    icon: Gamepad2,
  },
  {
    id: "16bit",
    name: "16-bit",
    spec: "Finer pixels, more colours",
    icon: Gamepad2,
  },
  {
    id: "arcade",
    name: "Arcade",
    spec: "Upright screen, joystick",
    icon: Joystick,
  },
  {
    id: "modern",
    name: "Modern",
    spec: "Widescreen, full colour",
    icon: Monitor,
  },
];

export function styleOption(id: ConsoleStyleId): StyleOption {
  return STYLE_OPTIONS.find((option) => option.id === id) ?? STYLE_OPTIONS[0];
}
