import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu, { MenuItem } from "./Menu";

describe("Menu", () => {
  it("renders a named menu on the raised surface", () => {
    render(
      <Menu aria-label="Project actions" className="mt-2">
        <MenuItem>Rename</MenuItem>
      </Menu>,
    );
    const menu = screen.getByRole("menu", { name: "Project actions" });
    expect(menu).toHaveClass(
      "w-62",
      "rounded-md",
      "border-border-strong",
      "bg-bg-raised",
      "p-1",
      "shadow-md",
      "mt-2",
    );
  });

  it("binds each item kind and the selected state to its tokens", () => {
    render(
      <Menu aria-label="Project actions">
        <MenuItem>Rename</MenuItem>
        <MenuItem selected>Newest first</MenuItem>
        <MenuItem kind="danger">Delete project</MenuItem>
      </Menu>,
    );
    const rename = screen.getByRole("menuitem", { name: "Rename" });
    expect(rename).toHaveAttribute("data-kind", "default");
    expect(rename).toHaveAttribute("data-selected", "false");
    expect(rename).toHaveClass(
      "text-text-primary",
      "text-body-sm",
      "hover:bg-bg-hover",
      "focus-visible:outline-focus-ring",
    );
    const selected = screen.getByRole("menuitem", { name: "Newest first" });
    expect(selected).toHaveAttribute("data-selected", "true");
    expect(selected).toHaveAttribute("aria-current", "true");
    expect(selected).toHaveClass("text-accent-text");
    expect(screen.getAllByTestId("menu-item-check")).toHaveLength(1);
    const danger = screen.getByRole("menuitem", { name: "Delete project" });
    expect(danger).toHaveAttribute("data-kind", "danger");
    expect(danger).toHaveClass("text-danger-text");
  });

  it("fires onSelect, and not when disabled", async () => {
    const onSelect = vi.fn();
    const onDisabled = vi.fn();
    render(
      <Menu aria-label="Project actions">
        <MenuItem onSelect={onSelect}>Rename</MenuItem>
        <MenuItem onSelect={onDisabled} disabled>
          Duplicate
        </MenuItem>
      </Menu>,
    );
    await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const disabled = screen.getByRole("menuitem", { name: "Duplicate" });
    expect(disabled).toBeDisabled();
    await userEvent.click(disabled);
    expect(onDisabled).not.toHaveBeenCalled();
  });

  it("moves focus with the arrow keys, Home and End, skipping disabled items", async () => {
    render(
      <Menu aria-label="Project actions">
        <MenuItem>Rename</MenuItem>
        <MenuItem disabled>Duplicate</MenuItem>
        <MenuItem>Export</MenuItem>
        <MenuItem kind="danger">Delete project</MenuItem>
      </Menu>,
    );
    const rename = screen.getByRole("menuitem", { name: "Rename" });
    const exportItem = screen.getByRole("menuitem", { name: "Export" });
    const remove = screen.getByRole("menuitem", { name: "Delete project" });
    await userEvent.tab();
    expect(rename).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(exportItem).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(remove).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(rename).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(remove).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(rename).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(remove).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(exportItem).toHaveFocus();
  });
});
