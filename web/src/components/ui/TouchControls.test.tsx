import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TouchControls, { type TouchControlsButton } from "./TouchControls";

const BUTTONS: Array<[string, TouchControlsButton]> = [
  ["Up", "up"],
  ["Down", "down"],
  ["Left", "left"],
  ["Right", "right"],
  ["A button", "a"],
  ["B button", "b"],
];

describe("TouchControls", () => {
  it("lays out the d-pad and the action buttons in a spaced row", () => {
    render(<TouchControls className="bg-bg-base" />);
    expect(screen.getByTestId("touch-controls")).toHaveClass(
      "flex",
      "items-center",
      "justify-between",
      "px-6",
      "py-4",
      "bg-bg-base",
    );
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  it("d-pad buttons are real 44px buttons on the raised surface", () => {
    render(<TouchControls />);
    for (const name of ["Up", "Down", "Left", "Right"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass(
        "h-11",
        "w-11",
        "rounded-md",
        "border-border-strong",
        "bg-bg-raised",
        "touch-manipulation",
      );
    }
  });

  it("action buttons are 56px circles showing their letter", () => {
    render(<TouchControls />);
    const a = screen.getByRole("button", { name: "A button" });
    const b = screen.getByRole("button", { name: "B button" });
    expect(a).toHaveTextContent("A");
    expect(b).toHaveTextContent("B");
    for (const button of [a, b]) {
      expect(button).toHaveClass(
        "h-14",
        "w-14",
        "rounded-full",
        "bg-bg-raised",
        "text-label-md",
        "text-text-primary",
      );
    }
    // B sits lower-left, A upper-right.
    expect(b).toHaveClass("bottom-0", "left-0");
    expect(a).toHaveClass("top-0", "right-0");
  });

  it.each(BUTTONS)("%s fires onInput once with %s", async (name, value) => {
    const onInput = vi.fn();
    render(<TouchControls onInput={onInput} />);
    await userEvent.click(screen.getByRole("button", { name }));
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith(value);
  });

  it("works from the keyboard", async () => {
    const onInput = vi.fn();
    render(<TouchControls onInput={onInput} />);
    screen.getByRole("button", { name: "A button" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onInput).toHaveBeenCalledWith("a");
  });

  it("does not throw without onInput", async () => {
    render(<TouchControls />);
    await userEvent.click(screen.getByRole("button", { name: "Up" }));
    expect(screen.getByRole("button", { name: "Up" })).toBeInTheDocument();
  });
});
