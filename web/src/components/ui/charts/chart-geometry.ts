export interface Point {
  x: number;
  y: number;
}

export interface PlotArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface AxisTick {
  coordinate: number;
  label: string;
}

export interface PlacedTick extends AxisTick {
  labelCoordinate: number;
}

const fix = (value: number) => Number(value.toPrecision(12));

function digitCount(value: number) {
  return value === 0 ? 1 : Math.floor(fix(Math.log10(Math.abs(value)))) + 1;
}

function formatStep(roughStep: number, correction: number) {
  if (roughStep <= 0) return 0;
  const digits = digitCount(roughStep);
  const unit = 10 ** digits;
  const scale = digits !== 1 ? 0.05 : 0.1;
  const ratio = Math.ceil(fix(roughStep / unit / scale)) + correction;
  return fix(ratio * scale * unit);
}

function stepBounds(
  min: number,
  max: number,
  count: number,
  correction = 0,
): { step: number; low: number; high: number } {
  const step = formatStep((max - min) / (count - 1), correction);
  if (step === 0) return { step, low: min, high: max };
  let middle = 0;
  if (min > 0 || max < 0) {
    middle = (min + max) / 2;
    middle = fix(middle - (middle % step));
  }
  let below = Math.ceil(fix((middle - min) / step));
  let above = Math.ceil(fix((max - middle) / step));
  const total = below + above + 1;
  if (total > count) return stepBounds(min, max, count, correction + 1);
  if (total < count) {
    if (max > 0) above += count - total;
    else below += count - total;
  }
  return {
    step,
    low: fix(middle - below * step),
    high: fix(middle + above * step),
  };
}

function singleValueTicks(value: number, count: number) {
  let step = 1;
  let middle = value;
  if (!Number.isInteger(value)) {
    if (Math.abs(value) < 1) {
      step = 10 ** (digitCount(value) - 1);
      middle = fix(Math.floor(value / step) * step);
    } else {
      middle = Math.floor(value);
    }
  } else if (value === 0) {
    middle = Math.floor((count - 1) / 2);
  }
  const middleIndex = Math.floor((count - 1) / 2);
  return Array.from({ length: count }, (_, index) =>
    fix(middle + (index - middleIndex) * step),
  );
}

/** Nice axis ticks spanning the domain; the ends become the axis range. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return singleValueTicks(min, count);
  const { step, low, high } = stepBounds(min, max, count);
  if (step === 0) return [low, high];
  const ticks: number[] = [];
  for (let value = low; value < high + step * 0.1; value = fix(value + step)) {
    ticks.push(value);
  }
  return ticks;
}

/** Evenly spaced category positions across the plot, ends included. */
export function categoryX(index: number, count: number, plot: PlotArea) {
  if (count <= 1) return plot.left + plot.width / 2;
  return plot.left + (plot.width * index) / (count - 1);
}

export function valueY(value: number, domain: number[], plot: PlotArea) {
  const [low, high] = [domain[0], domain[domain.length - 1]];
  const ratio = high === low ? 0.5 : (value - low) / (high - low);
  return plot.top + plot.height * (1 - ratio);
}

export function nearestIndex(x: number, count: number, plot: PlotArea) {
  if (count <= 1) return 0;
  const ratio = (x - plot.left) / plot.width;
  return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

const sign = (value: number) => (value < 0 ? -1 : 1);

function endSlope(from: Point, to: Point, tangent: number) {
  const width = to.x - from.x;
  return width ? ((3 * (to.y - from.y)) / width - tangent) / 2 : tangent;
}

function innerSlope(before: Point, at: Point, after: Point) {
  const h0 = at.x - before.x;
  const h1 = after.x - at.x;
  const s0 = (at.y - before.y) / (h0 || (h1 < 0 ? -0 : 0));
  const s1 = (after.y - at.y) / (h1 || (h0 < 0 ? -0 : 0));
  const p = (s0 * h1 + s1 * h0) / (h0 + h1);
  const limit = Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p));
  return (sign(s0) + sign(s1)) * limit || 0;
}

/** Monotone cubic curve through the points (d3 curveMonotoneX). */
export function monotonePath(points: Point[]) {
  const count = points.length;
  if (count === 0) return "";
  const [first] = points;
  if (count === 1) return `M${first.x},${first.y}Z`;
  if (count === 2) {
    return `M${first.x},${first.y}L${points[1].x},${points[1].y}`;
  }
  const tangents = new Array<number>(count);
  for (let i = 1; i < count - 1; i++) {
    tangents[i] = innerSlope(points[i - 1], points[i], points[i + 1]);
  }
  tangents[0] = endSlope(points[0], points[1], tangents[1]);
  tangents[count - 1] = endSlope(
    points[count - 2],
    points[count - 1],
    tangents[count - 2],
  );
  let path = `M${first.x},${first.y}`;
  for (let i = 0; i < count - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const dx = (to.x - from.x) / 3;
    const start = `${from.x + dx},${from.y + dx * tangents[i]}`;
    const finish = `${to.x - dx},${to.y - dx * tangents[i + 1]}`;
    path += `C${start},${finish},${to.x},${to.y}`;
  }
  return path;
}

/** Closes a curve down to a horizontal baseline. */
export function areaPath(points: Point[], baseline: number) {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  const floor = `L${last.x},${baseline}L${first.x},${baseline}Z`;
  return `${monotonePath(points)}${floor}`;
}

/**
 * Keeps the labels that fit, walking back from the last one, which is nudged
 * inside the chart (the "preserveEnd" interval).
 */
export function preserveEndTicks(
  ticks: AxisTick[],
  bounds: { start: number; end: number },
  sizeOf: (label: string) => number,
  minGap = 5,
): PlacedTick[] {
  if (ticks.length === 0) return [];
  const direction =
    ticks.length >= 2 ? sign(ticks[1].coordinate - ticks[0].coordinate) : 1;
  const { start } = bounds;
  let end = bounds.end;
  const placed: PlacedTick[] = [];
  for (let i = ticks.length - 1; i >= 0; i--) {
    const tick = ticks[i];
    const size = sizeOf(tick.label);
    let labelCoordinate = tick.coordinate;
    if (i === ticks.length - 1) {
      const gap = direction * (tick.coordinate + (direction * size) / 2 - end);
      if (gap > 0) labelCoordinate = tick.coordinate - gap * direction;
    }
    const inside =
      direction * labelCoordinate >= direction * start &&
      direction * labelCoordinate <= direction * end &&
      direction * (labelCoordinate - (direction * size) / 2 - start) >= 0 &&
      direction * (labelCoordinate + (direction * size) / 2 - end) <= 0;
    if (inside) {
      end = labelCoordinate - direction * (size / 2 + minGap);
      placed.unshift({ ...tick, labelCoordinate });
    }
  }
  return placed;
}

let measureContext: CanvasRenderingContext2D | null | undefined;

/** Rendered label width in the page font; estimated without canvas. */
export function textWidth(text: string, fontSize: number) {
  if (measureContext === undefined) {
    measureContext =
      typeof document === "undefined"
        ? null
        : document.createElement("canvas").getContext("2d");
  }
  if (!measureContext) return text.length * fontSize * 0.6;
  const family = getComputedStyle(document.body).fontFamily;
  measureContext.font = `${fontSize}px ${family}`;
  return measureContext.measureText(text).width;
}

/** Line height of a label at the browser's normal line height. */
export const textHeight = (fontSize: number) => fontSize * 1.2;

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (progress: number) => {
    let t = progress;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(t) - progress;
      const slope = slopeX(t);
      if (Math.abs(error) < 1e-6 || Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    return sampleY(Math.min(1, Math.max(0, t)));
  };
}

/** The CSS "ease" timing curve. */
export const ease = cubicBezier(0.25, 0.1, 0.25, 1);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
