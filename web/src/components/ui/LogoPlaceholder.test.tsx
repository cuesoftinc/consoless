import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LogoPlaceholder from "./LogoPlaceholder";

describe("LogoPlaceholder", () => {
  it("renders the product name in the heading style", () => {
    render(<LogoPlaceholder />);
    const logo = screen.getByText("Consoless");
    expect(logo).toHaveClass("text-heading-md", "text-text-primary");
  });

  it("merges className", () => {
    render(<LogoPlaceholder className="shrink-0" />);
    expect(screen.getByTestId("logo-placeholder")).toHaveClass(
      "shrink-0",
      "text-heading-md",
    );
  });
});
