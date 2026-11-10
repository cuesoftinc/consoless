import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GameScreen, { type GameScreenGame } from "./GameScreen";

const LABELS: Array<[GameScreenGame, string, string]> = [
  ["blocks", "Falling-block puzzle demo picture", "fill-console-screen-black"],
  ["platformer", "Platformer demo picture", "fill-console-px-sky"],
  ["shooter", "Space shooter demo picture", "fill-console-screen-black"],
  ["kart", "Kart racer demo picture", "fill-console-px-sky"],
];

describe("GameScreen", () => {
  it.each(LABELS)(
    "%s has its label and colour background",
    (game, label, backgroundClass) => {
      render(<GameScreen game={game} />);
      const picture = screen.getByRole("img", { name: label });
      expect(picture).toHaveAttribute("viewBox", "0 0 320 288");
      expect(picture).toHaveAttribute("preserveAspectRatio", "none");
      expect(picture).toHaveAttribute("data-game", game);
      expect(picture).toHaveAttribute("data-palette", "colour");
      expect(picture).toHaveClass("block", "h-full", "w-full");
      const background = screen.getByTestId("game-screen-background");
      expect(background).toHaveClass(backgroundClass);
      expect(background).toHaveAttribute("width", "320");
      expect(background).toHaveAttribute("height", "288");
      expect(screen.getAllByTestId("game-screen-run").length).toBeGreaterThan(
        0,
      );
    },
  );

  it.each(LABELS)(
    "%s in the green palette uses only the screen shades",
    (game, label) => {
      render(<GameScreen game={game} palette="green" />);
      expect(screen.getByRole("img", { name: label })).toHaveAttribute(
        "data-palette",
        "green",
      );
      expect(screen.getByTestId("game-screen-background")).toHaveClass(
        "fill-console-screen-green",
      );
      for (const run of screen.getAllByTestId("game-screen-run")) {
        expect(run.getAttribute("class")).toMatch(
          /^fill-console-screen-(ink|green-mid)$/,
        );
      }
    },
  );

  it("draws one rect per horizontal run of equal cells", () => {
    render(<GameScreen game="shooter" />);
    const runs = screen.getAllByTestId("game-screen-run");
    // 4 + 4 invaders, 3 + 3 invaders, 3 bullets, 4 stars, 3 ship rows.
    expect(runs).toHaveLength(24);
    // First run: row 1, columns 2 to 3, in pink.
    expect(runs[0]).toHaveAttribute("x", "32");
    expect(runs[0]).toHaveAttribute("y", "16");
    expect(runs[0]).toHaveAttribute("width", "32");
    expect(runs[0]).toHaveAttribute("height", "16");
    expect(runs[0]).toHaveClass("fill-console-px-pink");
    // Last run: the widest ship row, five cells in cyan.
    expect(runs[23]).toHaveAttribute("x", "112");
    expect(runs[23]).toHaveAttribute("y", "256");
    expect(runs[23]).toHaveAttribute("width", "80");
    expect(runs[23]).toHaveClass("fill-console-px-cyan");
  });

  it("leaves unmapped cells empty", () => {
    // Kart: "s" is sky in both palettes; "l" and "k" are empty in green.
    const { rerender } = render(<GameScreen game="kart" />);
    const colour = screen.getAllByTestId("game-screen-run").length;
    rerender(<GameScreen game="kart" palette="green" />);
    expect(screen.getAllByTestId("game-screen-run").length).not.toBe(colour);
  });

  it("merges className", () => {
    render(<GameScreen game="blocks" className="rounded-sm" />);
    expect(screen.getByRole("img")).toHaveClass("rounded-sm", "h-full");
  });
});
