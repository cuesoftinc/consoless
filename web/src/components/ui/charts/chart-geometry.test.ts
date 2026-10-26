import { describe, expect, it } from "vitest";
import {
  areaPath,
  monotonePath,
  niceTicks,
  preserveEndTicks,
} from "./chart-geometry";

const TWO_POINTS = [
  { x: 0, y: 0 },
  { x: 10, y: 10 },
];

const THREE_POINTS = [
  { x: 0, y: 0 },
  { x: 5, y: 5 },
  { x: 10, y: 10 },
];

describe("niceTicks", () => {
  it("rounds a zero-based domain up to five even steps", () => {
    expect(niceTicks(0, 4500)).toEqual([0, 1500, 3000, 4500, 6000]);
  });

  it("centres a single value in unit steps", () => {
    expect(niceTicks(0, 0)).toEqual([0, 1, 2, 3, 4]);
    expect(niceTicks(5, 5)).toEqual([3, 4, 5, 6, 7]);
  });
});

describe("monotonePath", () => {
  it("draws a straight segment between two points", () => {
    expect(monotonePath(TWO_POINTS)).toBe("M0,0L10,10");
  });

  it("draws cubic segments through three or more points", () => {
    const path = monotonePath(THREE_POINTS);
    expect(path.startsWith("M0,0C")).toBe(true);
    expect(path.endsWith(",10,10")).toBe(true);
    expect(path.match(/C/g)).toHaveLength(2);
  });

  it("closes an area down to its baseline", () => {
    expect(areaPath(TWO_POINTS, 20)).toBe("M0,0L10,10L10,20L0,20Z");
  });
});

describe("preserveEndTicks", () => {
  const sizeOf = () => 20;

  it("nudges the last label inside and keeps labels that fit", () => {
    const ticks = preserveEndTicks(
      [
        { coordinate: 10, label: "a" },
        { coordinate: 50, label: "b" },
        { coordinate: 95, label: "c" },
      ],
      { start: 0, end: 100 },
      sizeOf,
    );
    expect(ticks.map((tick) => tick.labelCoordinate)).toEqual([10, 50, 90]);
  });

  it("drops labels that would overlap a kept one", () => {
    const ticks = preserveEndTicks(
      [
        { coordinate: 10, label: "a" },
        { coordinate: 20, label: "b" },
        { coordinate: 95, label: "c" },
      ],
      { start: 0, end: 100 },
      sizeOf,
    );
    expect(ticks.map((tick) => tick.label)).toEqual(["b", "c"]);
  });
});
