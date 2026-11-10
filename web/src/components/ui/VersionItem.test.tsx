import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VersionItem, { type VersionSource } from "./VersionItem";

const BASE = {
  version: 3,
  summary: "Made the ball faster and added a score.",
  time: "2 minutes ago",
  source: "Generated" as VersionSource,
};

describe("VersionItem", () => {
  it("renders a default row with its version, source, summary and time", () => {
    render(<VersionItem {...BASE} />);
    const row = screen.getByRole("button", { name: /Version 3/ });
    expect(row).toHaveAttribute("type", "button");
    expect(row).toHaveAttribute("data-state", "default");
    expect(row).not.toHaveAttribute("aria-current");
    expect(row).toHaveClass(
      "w-full",
      "rounded-md",
      "p-3",
      "text-left",
      "gap-1",
      "hover:bg-bg-hover",
      "focus-visible:outline-focus-ring",
    );
    expect(row).not.toHaveClass("bg-bg-hover", "border-accent-default");
    expect(screen.getByText("Version 3")).toHaveClass(
      "text-label-md",
      "text-text-primary",
    );
    expect(screen.getByText("Generated")).toHaveAttribute(
      "data-kind",
      "neutral",
    );
    expect(screen.getByText(BASE.summary)).toHaveClass(
      "text-body-sm",
      "text-text-secondary",
      "line-clamp-2",
    );
    expect(screen.getByText("2 minutes ago")).toHaveClass(
      "text-caption",
      "text-text-muted",
    );
  });

  it.each<VersionSource>(["Generated", "Edited", "Restored", "Remixed"])(
    "shows the %s source in a neutral badge",
    (source) => {
      render(<VersionItem {...BASE} source={source} />);
      expect(screen.getByText(source)).toHaveAttribute("data-kind", "neutral");
    },
  );

  it("marks the current version with a border, a badge and aria-current", () => {
    render(<VersionItem {...BASE} current />);
    const row = screen.getByRole("button", { name: /Version 3/ });
    expect(row).toHaveAttribute("data-state", "current");
    expect(row).toHaveAttribute("aria-current", "true");
    expect(row).toHaveClass("border", "border-accent-default", "bg-bg-raised");
    expect(screen.getByText("Current")).toHaveAttribute("data-kind", "accent");
    expect(screen.queryByText("Generated")).not.toBeInTheDocument();
  });

  it("fills the selected row", () => {
    render(<VersionItem {...BASE} selected />);
    const row = screen.getByRole("button", { name: /Version 3/ });
    expect(row).toHaveAttribute("data-state", "selected");
    expect(row).toHaveClass("bg-bg-hover");
    expect(row).not.toHaveClass("border-accent-default");
  });

  it("current wins the state when the row is also selected", () => {
    render(<VersionItem {...BASE} current selected />);
    const row = screen.getByRole("button", { name: /Version 3/ });
    expect(row).toHaveAttribute("data-state", "current");
    expect(row).toHaveClass("border-accent-default", "bg-bg-hover");
    expect(row).not.toHaveClass("bg-bg-raised");
  });

  it("calls onSelect and merges className", async () => {
    const onSelect = vi.fn();
    render(<VersionItem {...BASE} onSelect={onSelect} className="mt-4" />);
    const row = screen.getByRole("button", { name: /Version 3/ });
    expect(row).toHaveClass("mt-4");
    await userEvent.click(row);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
