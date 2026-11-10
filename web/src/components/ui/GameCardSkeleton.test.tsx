import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GameCardSkeleton from "./GameCardSkeleton";

describe("GameCardSkeleton", () => {
  it("has the GameCard box, hidden from assistive technology", () => {
    render(<GameCardSkeleton className="mx-auto" />);
    const card = screen.getByTestId("game-card-skeleton");
    expect(card).toHaveAttribute("aria-hidden", "true");
    expect(card).toHaveClass(
      "w-full",
      "max-w-74",
      "overflow-hidden",
      "rounded-lg",
      "border-border-default",
      "bg-bg-raised",
      "mx-auto",
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("fills the thumbnail with a skeleton block and adds two lines", () => {
    render(<GameCardSkeleton />);
    const [thumbnail, first, second] = screen.getAllByTestId("skeleton");
    expect(screen.getAllByTestId("skeleton")).toHaveLength(3);
    expect(thumbnail).toHaveAttribute("data-kind", "block");
    expect(thumbnail).toHaveClass(
      "aspect-[296/176]",
      "h-auto",
      "w-full",
      "rounded-none",
    );
    expect(first).toHaveAttribute("data-kind", "line");
    expect(first).toHaveClass("w-44");
    expect(second).toHaveAttribute("data-kind", "line");
    expect(second).toHaveClass("w-28");
  });
});
