import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toggle from "./Toggle";

describe("Toggle", () => {
  it("renders an off switch named by its visible label", () => {
    render(
      <Toggle
        label="Show scanlines"
        checked={false}
        onCheckedChange={() => undefined}
      />,
    );
    const toggle = screen.getByRole("switch", { name: "Show scanlines" });
    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveAttribute("data-state", "unchecked");
    expect(toggle).toHaveClass("h-6", "w-10", "rounded-full", "p-0.5");
    expect(toggle).toHaveClass(
      "data-[state=unchecked]:bg-bg-hover",
      "data-[state=unchecked]:border-border-strong",
      "focus-visible:outline-focus-ring",
    );
    expect(screen.getByText("Show scanlines")).toHaveClass("text-label-md");
    expect(screen.getByTestId("toggle-knob")).toHaveClass(
      "h-5",
      "w-5",
      "rounded-full",
      "data-[state=unchecked]:bg-text-muted",
    );
    expect(screen.getByTestId("toggle-root")).toHaveAttribute(
      "data-state",
      "off",
    );
  });

  it("slides the knob on the accent track when on", () => {
    render(
      <Toggle
        label="Show scanlines"
        checked
        onCheckedChange={() => undefined}
        className="mt-2"
      />,
    );
    const toggle = screen.getByRole("switch", { name: "Show scanlines" });
    expect(toggle).toBeChecked();
    expect(toggle).toHaveClass("data-[state=checked]:bg-accent-default");
    const knob = screen.getByTestId("toggle-knob");
    expect(knob).toHaveAttribute("data-state", "checked");
    expect(knob).toHaveClass(
      "data-[state=checked]:bg-accent-on-accent",
      "data-[state=checked]:translate-x-4",
      "transition-transform",
      "duration-fast",
      "ease-move",
      "motion-reduce:transition-none",
    );
    expect(screen.getByTestId("toggle-root")).toHaveAttribute(
      "data-state",
      "on",
    );
    expect(screen.getByTestId("toggle-root")).toHaveClass("mt-2");
  });

  it("toggles from the switch and from the label", async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Toggle
        label="Show scanlines"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    rerender(
      <Toggle
        label="Show scanlines"
        checked
        onCheckedChange={onCheckedChange}
      />,
    );
    await userEvent.click(screen.getByText("Show scanlines"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("takes an aria-label when there is no visible label", () => {
    render(
      <Toggle
        aria-label="Mute sound"
        id="mute"
        checked={false}
        onCheckedChange={() => undefined}
      />,
    );
    expect(screen.getByRole("switch", { name: "Mute sound" })).toHaveAttribute(
      "id",
      "mute",
    );
  });

  it("does not toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Toggle
        label="Show scanlines"
        checked={false}
        onCheckedChange={onCheckedChange}
        disabled
      />,
    );
    const toggle = screen.getByRole("switch", { name: "Show scanlines" });
    expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
