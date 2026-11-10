import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LeaderboardRow, {
  type LeaderboardRowKind,
  type LeaderboardRowProps,
} from "./LeaderboardRow";

const setup = (props: LeaderboardRowProps) =>
  render(
    <ul>
      <LeaderboardRow {...props} />
    </ul>,
  );

const RANKS: Array<[number, LeaderboardRowKind, string]> = [
  [1, "first", "text-rank-gold"],
  [2, "second", "text-rank-silver"],
  [3, "third", "text-rank-bronze"],
  [4, "other", "text-text-muted"],
  [27, "other", "text-text-muted"],
];

describe("LeaderboardRow", () => {
  it("is a list item with the row layout", () => {
    setup({
      rank: 4,
      name: "Ada Okafor",
      score: 900,
      className: "last:border-0",
    });
    expect(screen.getByRole("listitem")).toHaveClass(
      "flex",
      "items-center",
      "gap-4",
      "border-b",
      "border-border-default",
      "px-4",
      "py-3",
      "last:border-0",
    );
    expect(screen.getByRole("listitem")).not.toHaveClass("bg-accent-subtle");
  });

  it.each(RANKS)("rank %i is kind %s in %s", (rank, kind, colour) => {
    setup({ rank, name: "Ada Okafor", score: 900 });
    expect(screen.getByRole("listitem")).toHaveAttribute("data-kind", kind);
    const cell = screen.getByTestId("leaderboard-rank");
    expect(cell).toHaveClass("w-8", "text-label-md", "tabular-nums", colour);
    expect(cell).toHaveTextContent(`Rank ${rank}`);
  });

  it("hides the word Rank visually only", () => {
    setup({ rank: 1, name: "Ada Okafor", score: 900 });
    expect(screen.getByText("Rank")).toHaveClass("sr-only");
  });

  it("shows the name, a small avatar and the formatted score", () => {
    setup({ rank: 2, name: "Ada Okafor", score: 1234567 });
    expect(screen.getByText("Ada Okafor")).toHaveClass(
      "flex-1",
      "truncate",
      "text-body-md",
      "text-text-primary",
    );
    expect(screen.getByRole("img", { name: "Ada Okafor" })).toHaveAttribute(
      "data-size",
      "sm",
    );
    const score = screen.getByTestId("leaderboard-score");
    expect(score).toHaveTextContent("1,234,567");
    expect(score).toHaveClass("text-label-md", "tabular-nums");
  });

  it("leaves string scores as given", () => {
    setup({ rank: 5, name: "Ada Okafor", score: "01:23.45" });
    expect(screen.getByTestId("leaderboard-score")).toHaveTextContent(
      "01:23.45",
    );
  });

  it("the player's own row is tinted, reads You and keeps the avatar name", () => {
    setup({ rank: 12, name: "Ada Okafor", score: 640, you: true });
    const row = screen.getByRole("listitem");
    expect(row).toHaveAttribute("data-kind", "you");
    expect(row).toHaveClass("bg-accent-subtle");
    expect(screen.getByTestId("leaderboard-rank")).toHaveClass(
      "text-accent-text",
    );
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.queryByText("Ada Okafor")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ada Okafor" })).toBeInTheDocument();
  });

  it("you wins over the medal colours", () => {
    setup({ rank: 1, name: "Ada Okafor", score: 9000, you: true });
    expect(screen.getByRole("listitem")).toHaveAttribute("data-kind", "you");
    expect(screen.getByTestId("leaderboard-rank")).not.toHaveClass(
      "text-rank-gold",
    );
  });
});
