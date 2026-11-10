import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Gamepad2 } from "lucide-react";
import PromptInput, { type PromptInputProps } from "./PromptInput";

function setup(props: Partial<PromptInputProps> = {}) {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  const onStyleClick = vi.fn();
  function Harness() {
    const [value, setValue] = useState(props.value ?? "");
    return (
      <PromptInput
        styleLabel="Handheld"
        styleIcon={Gamepad2}
        onStyleClick={onStyleClick}
        {...props}
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
        onSubmit={onSubmit}
      />
    );
  }
  render(<Harness />);
  return { onChange, onSubmit, onStyleClick };
}

describe("PromptInput", () => {
  it("renders an empty composer with the default placeholder", () => {
    setup();
    const root = screen.getByTestId("prompt-input");
    expect(root).toHaveAttribute("data-state", "empty");
    expect(root).toHaveClass(
      "rounded-lg",
      "border-border-default",
      "bg-bg-inset",
      "p-3",
      "focus-within:outline-focus-ring",
    );
    expect(root).not.toHaveClass("opacity-40");
    const textarea = screen.getByRole("textbox", { name: "Prompt" });
    expect(textarea).toHaveAttribute("rows", "2");
    expect(textarea).toHaveAttribute(
      "placeholder",
      "Describe your game or a change to it",
    );
    expect(textarea).toHaveClass(
      "resize-none",
      "bg-transparent",
      "text-body-md",
      "text-text-primary",
      "placeholder:text-text-muted",
    );
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("accepts a custom placeholder and className", () => {
    setup({ placeholder: "Make the ball faster", className: "mt-4" });
    expect(screen.getByRole("textbox", { name: "Prompt" })).toHaveAttribute(
      "placeholder",
      "Make the ball faster",
    );
    expect(screen.getByTestId("prompt-input")).toHaveClass("mt-4");
  });

  it("reports typing through onChange and becomes filled", async () => {
    const { onChange } = setup();
    await userEvent.type(
      screen.getByRole("textbox", { name: "Prompt" }),
      "Pong",
    );
    expect(onChange).toHaveBeenLastCalledWith("Pong");
    expect(screen.getByTestId("prompt-input")).toHaveAttribute(
      "data-state",
      "filled",
    );
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });

  it("submits on Enter and on Send", async () => {
    const { onSubmit } = setup({ value: "A maze game" });
    await userEvent.type(
      screen.getByRole("textbox", { name: "Prompt" }),
      "{Enter}",
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("textbox", { name: "Prompt" })).toHaveValue(
      "A maze game",
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("Shift+Enter adds a new line and does not submit", async () => {
    const { onSubmit, onChange } = setup({ value: "Line one" });
    await userEvent.type(
      screen.getByRole("textbox", { name: "Prompt" }),
      "{Shift>}{Enter}{/Shift}",
    );
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith("Line one\n");
  });

  it("does not submit a blank prompt", async () => {
    const { onSubmit } = setup({ value: "   " });
    await userEvent.type(
      screen.getByRole("textbox", { name: "Prompt" }),
      "{Enter}",
    );
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("shows the style chip and reports a click on it", async () => {
    const { onStyleClick } = setup();
    const chip = screen.getByRole("button", {
      name: "Console style: Handheld",
    });
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).toHaveTextContent("Handheld");
    expect(chip).toHaveClass(
      "rounded-full",
      "border-border-default",
      "bg-bg-raised",
      "text-label-sm",
      "text-text-secondary",
    );
    expect(screen.getByTestId("prompt-input-style-icon")).toHaveClass(
      "h-4",
      "w-4",
    );
    await userEvent.click(chip);
    expect(onStyleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled dims the composer and blocks every action", async () => {
    const { onSubmit, onStyleClick, onChange } = setup({
      value: "A maze game",
      disabled: true,
    });
    const root = screen.getByTestId("prompt-input");
    expect(root).toHaveAttribute("data-state", "disabled");
    expect(root).toHaveClass("opacity-40");
    expect(screen.getByRole("textbox", { name: "Prompt" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Console style: Handheld" }),
    );
    await userEvent.type(screen.getByRole("textbox", { name: "Prompt" }), "x");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onStyleClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
