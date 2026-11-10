import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Gamepad2 } from "lucide-react";
import StyleCard from "./StyleCard";

describe("StyleCard", () => {
  it("renders an unselected radio with its name and spec", () => {
    render(
      <StyleCard
        name="Handheld"
        spec="160 x 144, 4 colours"
        icon={Gamepad2}
        selected={false}
      />,
    );
    const card = screen.getByRole("radio", { name: /Handheld/ });
    expect(card).toHaveAttribute("type", "button");
    expect(card).toHaveAttribute("aria-checked", "false");
    expect(card).toHaveAttribute("data-selected", "false");
    expect(card).toHaveClass(
      "w-34",
      "rounded-lg",
      "bg-bg-raised",
      "p-3",
      "text-left",
      "gap-2",
      "border",
      "border-border-default",
      "focus-visible:outline-focus-ring",
    );
    expect(card).not.toHaveClass("border-2", "border-accent-default");
    const icon = screen.getByTestId("style-card-icon");
    expect(icon).toHaveClass("h-6", "w-6", "text-text-secondary");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Handheld")).toHaveClass(
      "text-label-md",
      "text-text-primary",
    );
    expect(screen.getByText("160 x 144, 4 colours")).toHaveClass(
      "text-caption",
      "text-text-muted",
    );
  });

  it("marks the selected card", () => {
    render(
      <StyleCard
        name="Arcade"
        spec="224 x 288, 16 colours"
        icon={Gamepad2}
        selected
      />,
    );
    const card = screen.getByRole("radio", { name: /Arcade/ });
    expect(card).toBeChecked();
    expect(card).toHaveAttribute("data-selected", "true");
    expect(card).toHaveClass("border-2", "border-accent-default");
    expect(card).not.toHaveClass("border-border-default");
    expect(screen.getByTestId("style-card-icon")).toHaveClass(
      "text-accent-text",
    );
  });

  it("calls onSelect and merges className", async () => {
    const onSelect = vi.fn();
    render(
      <StyleCard
        name="Handheld"
        spec="160 x 144, 4 colours"
        icon={Gamepad2}
        selected={false}
        onSelect={onSelect}
        className="mt-4"
      />,
    );
    const card = screen.getByRole("radio", { name: /Handheld/ });
    expect(card).toHaveClass("mt-4");
    await userEvent.click(card);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
