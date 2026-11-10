import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  it("is decorative and pulses unless motion is reduced", () => {
    render(<Skeleton />);
    const el = screen.getByTestId("skeleton");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-kind", "line");
    expect(el).toHaveClass("animate-pulse", "motion-reduce:animate-none");
    expect(el).toHaveClass("bg-bg-hover");
  });

  it("renders block and circle kinds and accepts a size override", () => {
    const { rerender } = render(<Skeleton kind="block" />);
    expect(screen.getByTestId("skeleton")).toHaveClass("rounded-md");
    rerender(<Skeleton kind="circle" className="h-6 w-6" />);
    expect(screen.getByTestId("skeleton")).toHaveClass("rounded-full", "h-6");
  });
});
