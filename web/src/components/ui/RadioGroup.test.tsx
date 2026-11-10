import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RadioGroup, { RadioItem } from "./RadioGroup";

function setup(onValueChange = vi.fn(), value = "public") {
  render(
    <RadioGroup
      aria-label="Visibility"
      value={value}
      onValueChange={onValueChange}
      className="mt-2"
    >
      <RadioItem value="public" label="Public" />
      <RadioItem value="unlisted" label="Unlisted" />
      <RadioItem value="private" label="Private" disabled />
    </RadioGroup>,
  );
  return onValueChange;
}

describe("RadioGroup", () => {
  it("renders a named vertical group", () => {
    setup();
    const group = screen.getByRole("radiogroup", { name: "Visibility" });
    expect(group).toHaveClass("flex", "flex-col", "gap-3", "mt-2");
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("marks the chosen item with the accent ring and dot", () => {
    setup();
    const chosen = screen.getByRole("radio", { name: "Public" });
    expect(chosen).toBeChecked();
    expect(chosen).toHaveAttribute("data-state", "checked");
    expect(chosen).toHaveClass(
      "h-5",
      "w-5",
      "rounded-full",
      "bg-bg-inset",
      "border-border-strong",
      "data-[state=checked]:border-2",
      "data-[state=checked]:border-accent-default",
      "focus-visible:outline-focus-ring",
    );
    expect(screen.getAllByTestId("radio-dot")).toHaveLength(1);
    expect(screen.getByTestId("radio-dot")).toHaveClass(
      "h-2.5",
      "w-2.5",
      "bg-accent-default",
    );
    expect(screen.getByRole("radio", { name: "Unlisted" })).not.toBeChecked();
    expect(screen.getByText("Unlisted")).toHaveClass(
      "text-body-sm",
      "text-text-primary",
    );
  });

  it("reports the new value from the circle and from the label", async () => {
    const onValueChange = setup();
    await userEvent.click(screen.getByRole("radio", { name: "Unlisted" }));
    expect(onValueChange).toHaveBeenLastCalledWith("unlisted");
    await userEvent.click(screen.getByText("Unlisted"));
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("does not choose a disabled item", async () => {
    const onValueChange = setup();
    const disabled = screen.getByRole("radio", { name: "Private" });
    expect(disabled).toBeDisabled();
    await userEvent.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
