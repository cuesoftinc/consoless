import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge, { type BadgeKind } from "./Badge";

describe("Badge", () => {
  it("defaults to neutral", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft")).toHaveAttribute("data-kind", "neutral");
    expect(screen.getByText("Draft")).toHaveClass(
      "bg-bg-raised",
      "text-text-secondary",
    );
  });

  it.each<[BadgeKind, string, string]>([
    ["accent", "bg-accent-subtle", "text-accent-text"],
    ["brand", "bg-brand-subtle", "text-brand-text"],
    ["retro", "bg-retro-subtle", "text-retro-text"],
    ["success", "bg-success-subtle", "text-success-text"],
    ["warning", "bg-warning-subtle", "text-warning-text"],
    ["danger", "bg-danger-subtle", "text-danger-text"],
  ])("pairs the %s tint with its text token", (kind, bg, text) => {
    render(<Badge kind={kind}>Label</Badge>);
    expect(screen.getByText("Label")).toHaveClass(bg, text);
  });
});
