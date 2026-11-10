import type { ConsoleFrameStyle } from "@/components/ui/ConsoleFrame";
import type { ConsoleStyleId } from "@/models";

/** The Stage 1 console styles, in the order the picker shows them. */
export const STYLE_IDS: ConsoleStyleId[] = [
  "handheld",
  "8bit",
  "16bit",
  "arcade",
  "modern",
];

export const STYLE_LABEL: Record<ConsoleStyleId, string> = {
  handheld: "Handheld",
  "8bit": "8-bit",
  "16bit": "16-bit",
  arcade: "Arcade",
  modern: "Modern",
};

const FRAME_STYLE: Record<ConsoleStyleId, ConsoleFrameStyle> = {
  handheld: "handheld",
  "8bit": "8-bit",
  "16bit": "16-bit",
  arcade: "arcade",
  modern: "modern",
};

/** The ConsoleFrame style for an API style id. */
export function frameStyleOf(id: ConsoleStyleId): ConsoleFrameStyle {
  return FRAME_STYLE[id];
}

/** The handheld draws in four greens; every other style is full colour. */
export function paletteOf(id: ConsoleStyleId): "green" | "colour" {
  return id === "handheld" ? "green" : "colour";
}
