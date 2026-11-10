/** StylePicker: the console styles as a radio group of cards (CON-003). */

import StyleCard from "@/components/ui/StyleCard";
import { cn } from "@/lib/cn";
import type { ConsoleStyleId } from "@/models";
import { STYLE_OPTIONS } from "./style-options";

export interface StylePickerProps {
  value: ConsoleStyleId;
  onChange: (style: ConsoleStyleId) => void;
  className?: string;
}

export default function StylePicker({
  value,
  onChange,
  className,
}: StylePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Console style"
      className={cn("flex flex-wrap gap-3", className)}
    >
      {STYLE_OPTIONS.map((option) => (
        <StyleCard
          key={option.id}
          name={option.name}
          spec={option.spec}
          icon={option.icon}
          selected={option.id === value}
          onSelect={() => onChange(option.id)}
        />
      ))}
    </div>
  );
}
