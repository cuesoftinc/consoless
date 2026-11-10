"use client";

import { useState } from "react";
import {
  Gamepad2,
  Joystick,
  Monitor,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import ConsoleFrame, {
  type ConsoleFrameStyle,
} from "@/components/ui/ConsoleFrame";
import GameScreen from "@/components/ui/GameScreen";
import StyleCard from "@/components/ui/StyleCard";
import { ANCHORS } from "./links";
import Section from "./Section";

interface ConsoleStyleOption {
  id: ConsoleFrameStyle;
  name: string;
  spec: string;
  icon: LucideIcon;
}

const STYLES: ConsoleStyleOption[] = [
  {
    id: "handheld",
    name: "Handheld",
    spec: "Small screen, four greens",
    icon: Smartphone,
  },
  {
    id: "8-bit",
    name: "8-bit",
    spec: "Chunky pixels, bright colours",
    icon: Gamepad2,
  },
  {
    id: "16-bit",
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

export interface ConsolesSectionProps {
  onInteract?: (style: string) => void;
}

/** The console style picker: switch the frame and the game stays the same. */
export default function ConsolesSection({ onInteract }: ConsolesSectionProps) {
  const [selected, setSelected] = useState<ConsoleFrameStyle>("handheld");

  return (
    <Section
      id={ANCHORS.consoles}
      title="Pick a look"
      intro="A console style sets the frame, the resolution, the colours, the controls and the sound. Switch style at any time and the game stays the same."
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div
          role="radiogroup"
          aria-label="Console style"
          className="flex max-w-120 flex-wrap gap-4"
        >
          {STYLES.map((style) => (
            <StyleCard
              key={style.id}
              name={style.name}
              spec={style.spec}
              icon={style.icon}
              selected={selected === style.id}
              onSelect={() => {
                setSelected(style.id);
                onInteract?.(style.id);
              }}
            />
          ))}
        </div>
        <div
          data-testid="console-preview"
          data-style={selected}
          className="mx-auto flex min-h-120 w-full max-w-120 items-center justify-center"
        >
          <ConsoleFrame consoleStyle={selected}>
            <GameScreen
              game="blocks"
              palette={selected === "handheld" ? "green" : "colour"}
            />
          </ConsoleFrame>
        </div>
      </div>
    </Section>
  );
}
