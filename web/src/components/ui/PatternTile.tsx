/**
 * PatternTile: one 240×240 tile of a line pattern, and PatternStrip, a row
 * of tiles used as a section divider. This is a placeholder pattern, to be
 * replaced by the approved Cuesoft African geometric pattern.
 */

import { cn } from "@/lib/cn";

const PATHS = [
  "M0 20 L20 0 L40 20 L60 0 L80 20 L100 0 L120 20 L140 0 L160 20 L180 0 L200 20 L220 0 L240 20",
  "M60 40 L100 80 L60 120 L20 80 Z",
  "M60 60 L80 80 L60 100 L40 80 Z",
  "M180 40 L220 80 L180 120 L140 80 Z",
  "M180 60 L200 80 L180 100 L160 80 Z",
  "M120 60 L140 80 L120 100 L100 80 Z",
  "M0 140 H240",
  "M0 150 H240",
  "M20 170 L40 200 L0 200 Z",
  "M80 170 L100 200 L60 200 Z",
  "M140 170 L160 200 L120 200 Z",
  "M200 170 L220 200 L180 200 Z",
  "M0 220 H240",
  "M0 230 L10 240 M20 220 L40 240 M50 220 L70 240 M80 220 L100 240 M110 220 L130 240 M140 220 L160 240 M170 220 L190 240 M200 220 L220 240 M230 220 L240 230",
];

export interface PatternTileProps {
  className?: string;
}

export default function PatternTile({ className }: PatternTileProps) {
  return (
    <svg
      width={240}
      height={240}
      viewBox="0 0 240 240"
      aria-hidden
      fill="none"
      strokeWidth={2}
      strokeLinejoin="round"
      data-testid="pattern-tile"
      className={cn("stroke-border-strong", className)}
    >
      {PATHS.map((d) => (
        <path key={d} d={d} data-testid="pattern-tile-path" />
      ))}
    </svg>
  );
}

export interface PatternStripProps {
  /** How many tiles to lay side by side. */
  count?: number;
  className?: string;
}

export function PatternStrip({ count = 6, className }: PatternStripProps) {
  return (
    <div
      aria-hidden
      data-testid="pattern-strip"
      className={cn("flex h-30 overflow-hidden opacity-60", className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <PatternTile key={index} className="h-30 w-30 shrink-0" />
      ))}
    </div>
  );
}
