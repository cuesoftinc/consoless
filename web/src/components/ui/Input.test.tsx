import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input", () => {
  it("wires the label to the field and uses the field tokens", () => {
    render(<Input label="Project name" placeholder="My game" />);
    const input = screen.getByRole("textbox", { name: "Project name" });
    expect(input).toHaveClass(
      "h-12",
      "bg-bg-inset",
      "border-border-default",
      "rounded-md",
      "text-body-md",
    );
    expect(input).toHaveClass("focus-visible:outline-focus-ring");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(screen.getByText("Project name")).toHaveClass(
      "text-label-md",
      "text-text-secondary",
    );
    expect(screen.getByTestId("input-root")).toHaveAttribute(
      "data-state",
      "default",
    );
  });

  it("uses the id it is given", () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "id",
      "email",
    );
  });

  it("describes the field with the helper", () => {
    render(<Input label="Slug" helper="Lowercase letters and dashes." />);
    const helper = screen.getByText("Lowercase letters and dashes.");
    expect(helper).toHaveClass("text-caption", "text-text-muted");
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Lowercase letters and dashes.",
    );
  });

  it("replaces the helper with the error and marks the field invalid", () => {
    render(
      <Input
        label="Slug"
        helper="Lowercase letters and dashes."
        error="This slug is taken."
      />,
    );
    const input = screen.getByRole("textbox", { name: "Slug" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("border-danger-default");
    expect(input).not.toHaveClass("border-border-default");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("This slug is taken.");
    expect(alert).toHaveClass("text-caption", "text-danger-text");
    expect(input).toHaveAccessibleDescription("This slug is taken.");
    expect(
      screen.queryByText("Lowercase letters and dashes."),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("input-root")).toHaveAttribute(
      "data-state",
      "error",
    );
  });

  it("disables the field", () => {
    render(<Input label="Slug" disabled />);
    const input = screen.getByRole("textbox", { name: "Slug" });
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:opacity-40",
      "disabled:cursor-not-allowed",
    );
    expect(screen.getByTestId("input-root")).toHaveAttribute(
      "data-state",
      "disabled",
    );
  });

  it("fires onChange and merges className on the wrapper", async () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} className="max-w-110" />);
    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "ab");
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("input-root")).toHaveClass("max-w-110", "gap-2");
  });
});
