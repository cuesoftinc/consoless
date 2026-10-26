"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ChartTooltip } from "./ChartTooltip";
import {
  categoryX,
  ease,
  monotonePath,
  nearestIndex,
  niceTicks,
  prefersReducedMotion,
  valueY,
  type PlotArea,
  type Point,
} from "./chart-geometry";
import { useElementSize } from "./useElementSize";

interface LineChartProps<T> {
  data: readonly T[];
  valueKey: keyof T & string;
  color: string;
  label: string;
}

interface Hover {
  index: number;
  y: number;
  active: boolean;
}

const MARGIN = 5;
const MORPH_MS = 300;

/** Single-series monotone line with hidden axes and an auto-fitted y range. */
export function LineChart<T extends object>({
  data,
  valueKey,
  color,
  label,
}: LineChartProps<T>) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const [hover, setHover] = useState<Hover | null>(null);
  const [frame, setFrame] = useState<Point[]>();
  const shown = useRef<Point[]>([]);

  const chart = useMemo(() => {
    const plot: PlotArea = {
      left: MARGIN,
      top: MARGIN,
      width: width - MARGIN * 2,
      height: height - MARGIN * 2,
    };
    if (plot.width <= 0 || plot.height <= 0 || data.length === 0) return null;

    const values = data.map((row) => Number(row[valueKey]));
    const domain = niceTicks(Math.min(...values), Math.max(...values));
    const points = values.map((value, index) => ({
      x: categoryX(index, values.length, plot),
      y: valueY(value, domain, plot),
    }));
    return { plot, points };
  }, [data, valueKey, width, height]);

  // Each update morphs the line from where it was last drawn.
  useEffect(() => {
    const target = chart?.points ?? [];
    const from = shown.current;
    shown.current = target;
    let request = 0;
    if (from.length === 0 || target.length === 0 || prefersReducedMotion()) {
      request = requestAnimationFrame(() => setFrame(undefined));
      return () => cancelAnimationFrame(request);
    }
    const factor = from.length / target.length;
    const startedAt = performance.now();
    const step = (now: number) => {
      const elapsed = Math.max(0, now - startedAt) / MORPH_MS;
      if (elapsed >= 1) {
        shown.current = target;
        setFrame(target);
        return;
      }
      const progress = ease(elapsed);
      const points = target.map((point, index) => {
        const origin = from[Math.floor(index * factor)];
        return {
          x: origin.x + (point.x - origin.x) * progress,
          y: origin.y + (point.y - origin.y) * progress,
        };
      });
      shown.current = points;
      setFrame(points);
      request = requestAnimationFrame(step);
    };
    request = requestAnimationFrame(step);
    return () => cancelAnimationFrame(request);
  }, [chart]);

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!chart) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const { plot } = chart;
    const inside =
      x >= plot.left &&
      x <= plot.left + plot.width &&
      y >= plot.top &&
      y <= plot.top + plot.height;
    setHover((previous) =>
      inside
        ? { index: nearestIndex(x, data.length, plot), y, active: true }
        : previous && { ...previous, active: false },
    );
  };

  const index = Math.min(hover?.index ?? 0, data.length - 1);
  const active = hover?.active === true && chart !== null;
  const drawn = frame ?? chart?.points;

  return (
    <div
      ref={ref}
      className="relative h-full w-full"
      onPointerLeave={() =>
        setHover((previous) => previous && { ...previous, active: false })
      }
    >
      <svg
        role="img"
        aria-label={label}
        width="100%"
        height="100%"
        viewBox={chart ? `0 0 ${width} ${height}` : undefined}
        className="block"
        onPointerMove={handlePointerMove}
      >
        {chart && drawn && (
          <>
            {active && (
              <line
                x1={chart.points[index].x}
                y1={chart.plot.top}
                x2={chart.points[index].x}
                y2={chart.plot.top + chart.plot.height}
                className="pointer-events-none stroke-chart-cursor"
              />
            )}
            <path
              d={monotonePath(drawn)}
              fill="none"
              strokeWidth={2}
              style={{ stroke: color }}
            />
            {active && (
              <circle
                cx={chart.points[index].x}
                cy={chart.points[index].y}
                r={4}
                strokeWidth={2}
                className="fill-white stroke-white"
              />
            )}
          </>
        )}
      </svg>

      {chart && (
        <ChartTooltip
          active={active}
          x={chart.points[index].x}
          y={hover?.y ?? 0}
          plot={chart.plot}
        >
          <ul className="m-0 p-0">
            <li
              className="block py-1"
              style={{ color, fontFamily: "monospace" }}
            >
              <span>{valueKey}</span>
              <span>{" : "}</span>
              <span>{String(data[index][valueKey])}</span>
            </li>
          </ul>
        </ChartTooltip>
      )}
    </div>
  );
}
