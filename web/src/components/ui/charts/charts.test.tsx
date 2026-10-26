import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaChart } from "./AreaChart";
import { LineChart } from "./LineChart";

const DATA = [
  { day: "Mon", hours: 2.5, xp: 1200 },
  { day: "Tue", hours: 1.5, xp: 800 },
];

const SERIES = [
  { key: "xp", name: "XP Gained", color: "var(--gaming-accent)" },
] as const;

describe("charts", () => {
  it("names the area chart for assistive technology", () => {
    render(
      <AreaChart
        data={DATA}
        xKey="day"
        series={SERIES}
        label="XP gained per day"
      />,
    );
    expect(
      screen.getByRole("img", { name: "XP gained per day" }),
    ).toBeInTheDocument();
  });

  it("names the line chart for assistive technology", () => {
    render(
      <LineChart
        data={DATA}
        valueKey="hours"
        color="var(--gaming-neon)"
        label="Hours per day"
      />,
    );
    expect(
      screen.getByRole("img", { name: "Hours per day" }),
    ).toBeInTheDocument();
  });
});
