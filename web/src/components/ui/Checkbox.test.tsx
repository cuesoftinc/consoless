import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders an unchecked box named by its visible label", () => {
    render(
      <Checkbox
        label="Email me about new releases"
        checked={false}
        onCheckedChange={() => undefined}
      />,
    );
    const box = screen.getByRole("checkbox", {
      name: "Email me about new releases",
    });
    expect(box).not.toBeChecked();
    expect(box).toHaveClass("h-5", "w-5", "rounded-sm");
    expect(box).toHaveClass(
      "data-[state=unchecked]:border-border-strong",
      "data-[state=unchecked]:bg-bg-inset",
      "focus-visible:outline-focus-ring",
    );
    expect(screen.getByText("Email me about new releases")).toHaveClass(
      "text-body-sm",
      "text-text-primary",
    );
    expect(screen.queryByTestId("checkbox-check")).not.toBeInTheDocument();
    expect(screen.getByTestId("checkbox-root")).toHaveAttribute(
      "data-state",
      "unchecked",
    );
  });

  it("shows the check on the accent fill when checked", () => {
    render(
      <Checkbox
        label="Public project"
        checked
        onCheckedChange={() => undefined}
        className="mt-2"
      />,
    );
    const box = screen.getByRole("checkbox", { name: "Public project" });
    expect(box).toBeChecked();
    expect(box).toHaveClass("data-[state=checked]:bg-accent-default");
    expect(screen.getByTestId("checkbox-check")).toHaveClass(
      "h-4",
      "w-4",
      "text-accent-on-accent",
    );
    expect(screen.getByTestId("checkbox-root")).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(screen.getByTestId("checkbox-root")).toHaveClass("mt-2", "gap-2");
  });

  it("toggles from the box and from the label", async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox
        label="Public project"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    rerender(
      <Checkbox
        label="Public project"
        checked
        onCheckedChange={onCheckedChange}
      />,
    );
    await userEvent.click(screen.getByText("Public project"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("takes an aria-label when there is no visible label", () => {
    render(
      <Checkbox
        aria-label="Select row"
        id="row-1"
        checked={false}
        onCheckedChange={() => undefined}
      />,
    );
    expect(
      screen.getByRole("checkbox", { name: "Select row" }),
    ).toHaveAttribute("id", "row-1");
  });

  it("does not toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Public project"
        checked={false}
        onCheckedChange={onCheckedChange}
        disabled
      />,
    );
    const box = screen.getByRole("checkbox", { name: "Public project" });
    expect(box).toBeDisabled();
    await userEvent.click(box);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
