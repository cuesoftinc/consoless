import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Project } from "@/models";
import ProjectCard from "./ProjectCard";

const NOW = Date.UTC(2026, 10, 10, 12);

const PROJECT: Project = {
  id: "prj_1",
  title: "Neon Stack",
  style_id: "handheld",
  prompt: "A falling-block puzzle",
  status: "published",
  slug: "neon-stack",
  version_count: 2,
  head_version_id: null,
  artwork: "blocks",
  created_at: "2026-11-01T00:00:00.000Z",
  updated_at: new Date(NOW - 2 * 60 * 60 * 1000).toISOString(),
};

function setup(project: Partial<Project> = {}) {
  const handlers = {
    onRename: vi.fn(),
    onUnpublish: vi.fn(),
    onDelete: vi.fn(),
  };
  render(
    <ProjectCard
      project={{ ...PROJECT, ...project }}
      now={NOW}
      {...handlers}
    />,
  );
  return handlers;
}

const openMenu = () =>
  userEvent.click(
    screen.getByRole("button", { name: "Actions for Neon Stack" }),
  );

describe("ProjectCard", () => {
  it("shows the title, status, style and a relative date", () => {
    setup();
    const card = screen.getByRole("article", { name: "Neon Stack" });
    expect(card).toHaveAttribute("data-status", "published");
    expect(
      screen.getByRole("heading", { level: 2, name: "Neon Stack" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Handheld")).toBeInTheDocument();
    expect(screen.getByText("Updated 2 hours ago")).toBeInTheDocument();
  });

  it.each([
    ["draft", "Draft"],
    ["in_review", "In review"],
    ["rejected", "Not approved"],
  ] as const)("labels the %s status in words", (status, label) => {
    setup({ status });
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("offers rename, unpublish and delete for a published game", async () => {
    const handlers = setup();
    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    expect(handlers.onRename).toHaveBeenCalledTimes(1);

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Unpublish" }));
    expect(handlers.onUnpublish).toHaveBeenCalledTimes(1);

    await openMenu();
    const remove = screen.getByRole("menuitem", { name: "Delete" });
    expect(remove).toHaveAttribute("data-kind", "danger");
    await userEvent.click(remove);
    expect(handlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it("offers to withdraw a game that is in review", async () => {
    setup({ status: "in_review" });
    await openMenu();
    expect(
      screen.getByRole("menuitem", { name: "Withdraw from review" }),
    ).toBeInTheDocument();
  });

  it("has no unpublish action for a draft", async () => {
    setup({ status: "draft" });
    await openMenu();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    expect(
      screen.queryByRole("menuitem", { name: /Unpublish|Withdraw/ }),
    ).not.toBeInTheDocument();
  });
});
