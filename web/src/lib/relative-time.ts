/**
 * Relative dates for activity and versions (P-07): "2 hours ago",
 * "yesterday". Falls back to a short date after four weeks.
 */
const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["minute", 60],
  ["hour", 60 * 60],
  ["day", 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
];

export function relativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((then - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return "just now";
  if (abs >= 28 * 24 * 60 * 60) {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(then);
  }
  let unit: Intl.RelativeTimeFormatUnit = "minute";
  let size = 60;
  for (const [stepUnit, stepSize] of STEPS) {
    if (abs >= stepSize) {
      unit = stepUnit;
      size = stepSize;
    }
  }
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.trunc(seconds / size),
    unit,
  );
}
