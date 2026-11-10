import { describe, expect, it } from "vitest";
import { relativeTime } from "./relative-time";

const NOW = Date.UTC(2026, 10, 10, 12, 0, 0);
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("relativeTime", () => {
  it("reads anything under a minute as just now", () => {
    expect(relativeTime(ago(20_000), NOW)).toBe("just now");
  });

  it("uses the largest unit that fits", () => {
    expect(relativeTime(ago(5 * MINUTE), NOW)).toBe("5 minutes ago");
    expect(relativeTime(ago(2 * HOUR), NOW)).toBe("2 hours ago");
    expect(relativeTime(ago(DAY), NOW)).toBe("yesterday");
    expect(relativeTime(ago(3 * DAY), NOW)).toBe("3 days ago");
    expect(relativeTime(ago(14 * DAY), NOW)).toBe("2 weeks ago");
  });

  it("falls back to a date after four weeks", () => {
    expect(relativeTime(ago(40 * DAY), NOW)).toBe("Oct 1, 2026");
  });

  it("returns an empty string for an unreadable date", () => {
    expect(relativeTime("not a date", NOW)).toBe("");
  });
});
