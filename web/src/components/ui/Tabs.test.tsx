import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tabs, { TabPanel } from "./Tabs";

const TABS = [
  { id: "play", label: "Play" },
  { id: "code", label: "Code" },
  { id: "version-history", label: "Version history" },
];

function Harness({ onChange }: { onChange?: (id: string) => void }) {
  const [value, setValue] = useState("play");
  return (
    <>
      <Tabs
        tabs={TABS}
        value={value}
        onChange={(id) => {
          setValue(id);
          onChange?.(id);
        }}
        aria-label="Project views"
      />
      {TABS.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} active={tab.id === value}>
          {tab.label} panel
        </TabPanel>
      ))}
    </>
  );
}

describe("Tabs", () => {
  it("renders a labelled tablist and marks the selected tab", () => {
    render(
      <Tabs
        tabs={TABS}
        value="code"
        onChange={() => {}}
        aria-label="Project views"
        className="mt-4"
      />,
    );
    expect(screen.getByRole("tablist", { name: "Project views" })).toHaveClass(
      "flex",
      "gap-6",
      "mt-4",
    );
    const active = screen.getByRole("tab", { name: "Code" });
    expect(active).toHaveAttribute("aria-selected", "true");
    expect(active).toHaveAttribute("tabindex", "0");
    expect(active).toHaveAttribute("data-state", "active");
    expect(active).toHaveClass(
      "border-b-2",
      "px-1",
      "py-3",
      "text-label-md",
      "border-accent-default",
      "text-text-primary",
    );
    const inactive = screen.getByRole("tab", { name: "Play" });
    expect(inactive).toHaveAttribute("aria-selected", "false");
    expect(inactive).toHaveAttribute("tabindex", "-1");
    expect(inactive).toHaveClass(
      "border-transparent",
      "text-text-secondary",
      "hover:text-text-primary",
    );
  });

  it("builds ids from the tab id, not the label", () => {
    render(
      <Tabs
        tabs={TABS}
        value="play"
        onChange={() => {}}
        aria-label="Project views"
      />,
    );
    const tab = screen.getByRole("tab", { name: "Version history" });
    expect(tab).toHaveAttribute("id", "tab-version-history");
    expect(tab).toHaveAttribute("aria-controls", "panel-version-history");
  });

  it("calls onChange with the clicked tab id", async () => {
    const onChange = vi.fn();
    render(
      <Tabs
        tabs={TABS}
        value="play"
        onChange={onChange}
        aria-label="Project views"
      />,
    );
    await userEvent.click(screen.getByRole("tab", { name: "Code" }));
    expect(onChange).toHaveBeenCalledWith("code");
  });

  it("moves focus and selection with the arrow keys, Home and End", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const [play, code, history] = TABS.map((tab) =>
      screen.getByRole("tab", { name: tab.label }),
    );

    await user.tab();
    expect(play).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(code).toHaveFocus();
    expect(code).toHaveAttribute("aria-selected", "true");
    expect(onChange).toHaveBeenLastCalledWith("code");
    await user.keyboard("{End}");
    expect(history).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith("version-history");
    await user.keyboard("{ArrowRight}");
    expect(play).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(history).toHaveFocus();
    await user.keyboard("{Home}");
    expect(play).toHaveFocus();
    expect(play).toHaveAttribute("aria-selected", "true");
    expect(play).toHaveAttribute("tabindex", "0");
    expect(history).toHaveAttribute("tabindex", "-1");
  });

  it("keeps the first tab focusable when the value matches no tab", () => {
    render(
      <Tabs
        tabs={TABS}
        value="missing"
        onChange={() => {}}
        aria-label="Project views"
      />,
    );
    expect(screen.getByRole("tab", { name: "Play" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });
});

describe("TabPanel", () => {
  it("is labelled by its tab and hidden when inactive", async () => {
    render(<Harness />);
    const panel = screen.getByRole("tabpanel", { name: "Play" });
    expect(panel).toHaveAttribute("id", "panel-play");
    expect(panel).toHaveAttribute("aria-labelledby", "tab-play");
    expect(panel).toBeVisible();
    expect(screen.getByText("Code panel")).not.toBeVisible();

    await userEvent.click(screen.getByRole("tab", { name: "Code" }));
    expect(screen.getByRole("tabpanel", { name: "Code" })).toBeVisible();
    expect(screen.getByText("Play panel")).not.toBeVisible();
  });
});
