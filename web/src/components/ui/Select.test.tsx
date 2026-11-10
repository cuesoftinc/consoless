import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./Select";

const OPTIONS = [
  { value: "nes", label: "NES" },
  { value: "gb", label: "Game Boy" },
  { value: "snes", label: "Super NES" },
];

describe("Select", () => {
  it("names the trigger with the label and styles it like a field", () => {
    render(
      <Select
        label="Console"
        value="gb"
        onValueChange={() => undefined}
        options={OPTIONS}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Console" });
    expect(trigger).toHaveTextContent("Game Boy");
    expect(trigger).toHaveClass(
      "h-12",
      "bg-bg-inset",
      "border-border-default",
      "rounded-md",
      "text-body-md",
    );
    expect(trigger).toHaveClass("focus-visible:outline-focus-ring");
    expect(screen.getByText("Console")).toHaveClass(
      "text-label-md",
      "text-text-secondary",
    );
  });

  it("shows the placeholder when nothing is chosen", () => {
    render(
      <Select
        label="Console"
        value=""
        onValueChange={() => undefined}
        options={OPTIONS}
        placeholder="Choose a console"
      />,
    );
    expect(screen.getByRole("combobox", { name: "Console" })).toHaveTextContent(
      "Choose a console",
    );
  });

  it("opens the list and reports the picked option", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="Console"
        value="gb"
        onValueChange={onValueChange}
        options={OPTIONS}
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Console" }));
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveClass(
      "z-overlay",
      "bg-bg-raised",
      "border-border-strong",
      "shadow-md",
    );
    expect(screen.getAllByRole("option")).toHaveLength(3);
    const selected = screen.getByRole("option", { name: "Game Boy" });
    expect(selected).toHaveAttribute("data-state", "checked");
    expect(selected).toHaveClass("data-[state=checked]:text-accent-text");
    expect(screen.getAllByTestId("select-item-check")).toHaveLength(1);
    await userEvent.click(screen.getByRole("option", { name: "Super NES" }));
    expect(onValueChange).toHaveBeenCalledWith("snes");
  });

  it("does not open when disabled", async () => {
    render(
      <Select
        label="Console"
        value="gb"
        onValueChange={() => undefined}
        options={OPTIONS}
        disabled
        className="max-w-110"
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Console" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("select-root")).toHaveAttribute(
      "data-state",
      "disabled",
    );
    expect(screen.getByTestId("select-root")).toHaveClass("max-w-110");
  });
});
