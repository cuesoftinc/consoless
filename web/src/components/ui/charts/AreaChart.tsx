"use client";

import { useId, useMemo, useState, type PointerEvent } from "react";
import { ChartTooltip } from "./ChartTooltip";
import {
  areaPath,
  categoryX,
  monotonePath,
  nearestIndex,
  niceTicks,
  preserveEndTicks,
  textHeight,
  textWidth,
  valueY,
  type PlotArea,
} from "./chart-geometry";
import { useElementSize } from "./useElementSize";

export interface AreaSeries<T> {
  key: keyof T & string;
  name: string;
  color: string;
}

interface AreaChartProps<T> {
  data: readonly T[];
  xKey: keyof T & string;
  series: readonly AreaSeries<T>[];
  label: string;
}

interface Hover {
  index: number;
  y: number;
  active: boolean;
}

const MARGIN = 5;
const Y_AXIS_WIDTH = 60;
const X_AXIS_HEIGHT = 30;
const TICK_SIZE = 6;
const TICK_MARGIN = 2;
const FONT_SIZE = 12;

/** Monotone area chart over a category x axis and a numeric y axis. */
export function AreaChart<T extends object>({
  data,
  xKey,
  series,
  label,
}: AreaChartProps<T>) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const gradientId = useId().replace(/[^\w-]/g, "");
  const [hover, setHover] = useState<Hover | null>(null);

  const chart = useMemo(() => {
    const plot: PlotArea = {
      left: MARGIN + Y_AXIS_WIDTH,
      top: MARGIN,
      width: width - MARGIN * 2 - Y_AXIS_WIDTH,
      height: height - MARGIN * 2 - X_AXIS_HEIGHT,
    };
    if (plot.width <= 0 || plot.height <= 0 || data.length === 0) return null;

    const values = series.flatMap(({ key }) =>
      data.map((row) => Number(row[key])),
    );
    const domain = niceTicks(Math.min(0, ...values), Math.max(...values));
    const low = domain[0];
    const high = domain[domain.length - 1];
    const baseline = valueY(high < 0 ? high : Math.max(low, 0), domain, plot);

    const lines = series.map((entry) => ({
      ...entry,
      points: data.map((row, index) => ({
        x: categoryX(index, data.length, plot),
        y: valueY(Number(row[entry.key]), domain, plot),
      })),
    }));

    const xTicks = preserveEndTicks(
      data.map((row, index) => ({
        coordinate: categoryX(index, data.length, plot),
        label: String(row[xKey]),
      })),
      { start: 0, end: width },
      (text) => textWidth(text, FONT_SIZE),
    );
    const yTicks = preserveEndTicks(
      domain.map((value) => ({
        coordinate: valueY(value, domain, plot),
        label: String(value),
      })),
      { start: height, end: 0 },
      () => textHeight(FONT_SIZE),
    );

    return { plot, baseline, lines, xTicks, yTicks };
  }, [data, xKey, series, width, height]);

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
  const cursorX = chart ? categoryX(index, data.length, chart.plot) : 0;

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
        {chart && (
          <>
            <defs>
              {chart.lines.map(({ key, color }) => (
                <linearGradient
                  key={key}
                  id={`${gradientId}-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    style={{ stopColor: color, stopOpacity: 0.3 }}
                  />
                  <stop
                    offset="95%"
                    style={{ stopColor: color, stopOpacity: 0 }}
                  />
                </linearGradient>
              ))}
            </defs>

            <g fontSize={FONT_SIZE}>
              <line
                x1={chart.plot.left}
                y1={chart.plot.top + chart.plot.height}
                x2={chart.plot.left + chart.plot.width}
                y2={chart.plot.top + chart.plot.height}
                className="stroke-chart-axis"
              />
              {chart.xTicks.map((tick) => {
                const top = chart.plot.top + chart.plot.height;
                return (
                  <g key={tick.coordinate}>
                    <line
                      x1={tick.coordinate}
                      y1={top}
                      x2={tick.coordinate}
                      y2={top + TICK_SIZE}
                      className="stroke-chart-axis"
                    />
                    <text
                      x={tick.labelCoordinate}
                      y={top + TICK_SIZE + TICK_MARGIN}
                      dy="0.71em"
                      textAnchor="middle"
                      className="fill-chart-axis"
                    >
                      {tick.label}
                    </text>
                  </g>
                );
              })}

              <line
                x1={chart.plot.left}
                y1={chart.plot.top}
                x2={chart.plot.left}
                y2={chart.plot.top + chart.plot.height}
                className="stroke-chart-axis"
              />
              {chart.yTicks.map((tick) => (
                <g key={tick.coordinate}>
                  <line
                    x1={chart.plot.left - TICK_SIZE}
                    y1={tick.coordinate}
                    x2={chart.plot.left}
                    y2={tick.coordinate}
                    className="stroke-chart-axis"
                  />
                  <text
                    x={chart.plot.left - TICK_SIZE - TICK_MARGIN}
                    y={tick.labelCoordinate}
                    dy="0.355em"
                    textAnchor="end"
                    className="fill-chart-axis"
                  >
                    {tick.label}
                  </text>
                </g>
              ))}
            </g>

            {active && (
              <line
                x1={cursorX}
                y1={chart.plot.top}
                x2={cursorX}
                y2={chart.plot.top + chart.plot.height}
                className="pointer-events-none stroke-chart-cursor"
              />
            )}

            <g className="motion-safe:animate-chart-reveal">
              {chart.lines.map(({ key, color, points }) => (
                <g key={key}>
                  <path
                    d={areaPath(points, chart.baseline)}
                    fill={`url(#${gradientId}-${key})`}
                  />
                  <path
                    d={monotonePath(points)}
                    fill="none"
                    strokeWidth={3}
                    style={{ stroke: color }}
                  />
                  {active && (
                    <circle
                      cx={points[index].x}
                      cy={points[index].y}
                      r={4}
                      strokeWidth={2}
                      className="stroke-white"
                      style={{ fill: color }}
                    />
                  )}
                </g>
              ))}
            </g>
          </>
        )}
      </svg>

      {chart && (
        <ChartTooltip
          active={active}
          x={cursorX}
          y={hover?.y ?? 0}
          plot={chart.plot}
        >
          <p className="m-0">{String(data[index][xKey])}</p>
          <ul className="m-0 p-0">
            {series.map(({ key, name, color }) => (
              <li
                key={key}
                className="block py-1 text-[12px] font-bold"
                style={{ color }}
              >
                <span>{name}</span>
                <span>{" : "}</span>
                <span>{String(data[index][key])}</span>
              </li>
            ))}
          </ul>
        </ChartTooltip>
      )}
    </div>
  );
}
