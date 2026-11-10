import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuItem } from "./Menu";
import PopoverMenu from "./PopoverMenu";

function setup(onRename = vi.fn()) {
  render(
    <PopoverMenu
      aria-label="Actions"
      trigger={<button type="button">Open</button>}
    >
      <MenuItem onSelect={onRename}>Rename</MenuItem>
      <MenuItem kind="danger">Delete</MenuItem>
    </PopoverMenu>,
  );
  return { onRename, trigger: screen.getByRole("button", { name: "Open" }) };
}

describe("PopoverMenu", () => {
  it("stays closed until the trigger is used", () => {
    setup();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens a named menu with its items", async () => {
    const { trigger } = setup();
    await userEvent.click(trigger);
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("runs the item and closes", async () => {
    const { onRename, trigger } = setup();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    expect(onRename).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const { trigger } = setup();
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
