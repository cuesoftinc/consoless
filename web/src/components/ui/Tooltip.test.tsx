import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  it("renders the trigger and keeps the caption hidden at rest", () => {
    render(
      <Tooltip label="Copy link">
        <button type="button">Copy</button>
      </Tooltip>,
    );
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the caption when the trigger takes keyboard focus", async () => {
    render(
      <Tooltip label="Copy link">
        <button type="button">Copy</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Copy" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copy link");
    const content = screen.getByTestId("tooltip-content");
    expect(content).toHaveAttribute("data-side", "top");
    expect(content).toHaveClass(
      "z-overlay",
      "rounded-sm",
      "border-border-strong",
      "bg-bg-raised",
      "px-2",
      "py-1",
      "text-caption",
      "text-text-primary",
      "shadow-sm",
    );
    expect(
      screen.getByRole("button", { name: "Copy" }),
    ).toHaveAccessibleDescription("Copy link");
  });

  it("shows the caption on hover after the delay", async () => {
    render(
      <Tooltip label="Open settings">
        <button type="button">Settings</button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole("button", { name: "Settings" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Open settings",
    );
  });

  it("places the caption on the requested side and merges className", async () => {
    render(
      <Tooltip label="Delete" side="bottom" className="max-w-62">
        <button type="button">Remove</button>
      </Tooltip>,
    );
    await userEvent.tab();
    await screen.findByRole("tooltip");
    const content = screen.getByTestId("tooltip-content");
    expect(content).toHaveAttribute("data-side", "bottom");
    expect(content).toHaveClass("max-w-62");
  });

  it("hides the caption on Escape", async () => {
    render(
      <Tooltip label="Copy link">
        <button type="button">Copy</button>
      </Tooltip>,
    );
    await userEvent.tab();
    await screen.findByRole("tooltip");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
