"use client";

import type { ReactNode } from "react";
import type { PlotArea } from "./chart-geometry";
import { useElementSize } from "./useElementSize";

const OFFSET = 10;

function place(anchor: number, size: number, start: number, extent: number) {
  const after = anchor + OFFSET;
  if (after + size > start + extent) {
    return Math.max(anchor - size - OFFSET, start);
  }
  return Math.max(after, start);
}

interface ChartTooltipProps {
  active: boolean;
  x: number;
  y: number;
  plot: PlotArea;
  children: ReactNode;
}

/** Hover box beside the active point, flipped to stay inside the plot. */
export function ChartTooltip({
  active,
  x,
  y,
  plot,
  children,
}: ChartTooltipProps) {
  const [ref, box] = useElementSize<HTMLDivElement>();
  const left = place(x, box.width, plot.left, plot.width);
  const top = place(y, box.height, plot.top, plot.height);
  const visibility = active
    ? "visible motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-[ease]"
    : "invisible";

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute top-0 left-0 ${visibility}`}
      style={{ transform: `translate(${left}px, ${top}px)` }}
    >
      <div className="m-0 whitespace-nowrap rounded-lg border border-chart-border bg-gaming-800 p-[10px]">
        {children}
      </div>
    </div>
  );
}
