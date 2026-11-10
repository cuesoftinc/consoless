import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CodeLine, { type CodeLineKind } from "./CodeLine";

describe("CodeLine", () => {
  it("renders a default line with a hidden number and the code", () => {
    render(<CodeLine number={12} code="const speed = 4;" />);
    const line = screen.getByTestId("code-line");
    expect(line).toHaveAttribute("data-kind", "default");
    expect(line).toHaveClass("flex", "items-center", "gap-4", "px-3");
    expect(line).not.toHaveClass("bg-success-subtle", "bg-danger-subtle");
    const number = screen.getByTestId("code-line-number");
    expect(number).toHaveTextContent("12");
    expect(number).toHaveAttribute("aria-hidden", "true");
    expect(number).toHaveClass(
      "w-6",
      "shrink-0",
      "select-none",
      "text-right",
      "font-mono",
      "text-code-sm",
      "text-text-muted",
    );
    expect(screen.getByText("const speed = 4;")).toHaveClass(
      "min-w-0",
      "flex-1",
      "truncate",
      "whitespace-pre",
      "font-mono",
      "text-code-md",
      "text-text-primary",
    );
    expect(screen.queryByText("Added:")).not.toBeInTheDocument();
    expect(screen.queryByText("Error:")).not.toBeInTheDocument();
  });

  it.each<[CodeLineKind, string, string]>([
    ["added", "bg-success-subtle", "Added:"],
    ["error", "bg-danger-subtle", "Error:"],
  ])("%s lines are tinted and say so to screen readers", (kind, bg, prefix) => {
    render(<CodeLine number={3} code="ball.x += speed;" kind={kind} />);
    const line = screen.getByTestId("code-line");
    expect(line).toHaveAttribute("data-kind", kind);
    expect(line).toHaveClass(bg);
    expect(screen.getByText(prefix)).toHaveClass("sr-only");
  });

  it("keeps an empty line at full height with a non-breaking space", () => {
    render(<CodeLine number={4} code="" />);
    expect(screen.getByTestId("code-line")).toHaveTextContent("4");
    expect(screen.getByTestId("code-line-code").textContent).toBe("\u00A0");
  });

  it("merges className", () => {
    render(<CodeLine number={1} code="let x = 0;" className="mt-4" />);
    expect(screen.getByTestId("code-line")).toHaveClass("mt-4");
  });
});
