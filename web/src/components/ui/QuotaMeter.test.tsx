import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import QuotaMeter, { type QuotaLevel } from "./QuotaMeter";

describe("QuotaMeter", () => {
  it("is a labelled meter that states the count in words", () => {
    render(<QuotaMeter used={5} limit={20} />);
    const meter = screen.getByRole("meter", { name: "Generations left today" });
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "20");
    expect(meter).toHaveAttribute("aria-valuenow", "15");
    expect(meter).toHaveClass("w-70", "flex-col", "gap-2");
    expect(screen.getByText("Generations")).toHaveClass(
      "text-label-sm",
      "text-text-secondary",
    );
    expect(screen.getByText("15 of 20 left today")).toHaveClass(
      "text-label-sm",
      "text-text-primary",
    );
    expect(screen.getByTestId("quota-meter-fill")).toHaveStyle({
      width: "75%",
    });
  });

  it.each<[number, QuotaLevel, string, string]>([
    [14, "ok", "bg-accent-default", "6 of 20 left today"],
    [15, "low", "bg-warning-text", "5 of 20 left today"],
    [19, "low", "bg-warning-text", "1 of 20 left today"],
    [20, "out", "bg-danger-default", "0 of 20 left today"],
  ])("used=%i of 20 is level %s", (used, level, fill, text) => {
    render(<QuotaMeter used={used} limit={20} />);
    expect(screen.getByRole("meter")).toHaveAttribute("data-level", level);
    expect(screen.getByTestId("quota-meter-fill")).toHaveClass(fill);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("never goes below zero when over the limit", () => {
    render(<QuotaMeter used={25} limit={20} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "0");
    expect(meter).toHaveAttribute("data-level", "out");
    expect(screen.getByTestId("quota-meter-fill")).toHaveStyle({ width: "0%" });
  });

  it("merges className", () => {
    render(<QuotaMeter used={0} limit={20} className="w-full" />);
    expect(screen.getByRole("meter")).toHaveClass("w-full");
  });
});
