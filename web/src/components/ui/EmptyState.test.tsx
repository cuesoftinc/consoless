import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Gamepad2 } from "lucide-react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders the icon badge, an h2 title and the body", () => {
    render(
      <EmptyState
        icon={Gamepad2}
        title="No games yet"
        body="Describe a game and we will build it."
      />,
    );
    expect(screen.getByTestId("empty-state")).toHaveClass(
      "mx-auto",
      "max-w-120",
      "flex-col",
      "items-center",
      "gap-4",
      "p-12",
      "text-center",
    );
    expect(screen.getByTestId("empty-state-badge")).toHaveClass(
      "h-16",
      "w-16",
      "rounded-full",
      "bg-accent-subtle",
    );
    const icon = screen.getByTestId("empty-state-icon");
    expect(icon).toHaveClass("h-8", "w-8", "text-accent-text");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.getByRole("heading", { level: 2, name: "No games yet" }),
    ).toHaveClass("text-heading-md", "text-text-primary");
    expect(
      screen.getByText("Describe a game and we will build it."),
    ).toHaveClass("text-body-md", "text-text-secondary");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the action and merges className", () => {
    render(
      <EmptyState
        icon={Gamepad2}
        title="No results"
        body="Try a different search."
        action={<button>Clear search</button>}
        className="mt-4"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toHaveClass("mt-4");
  });
});
