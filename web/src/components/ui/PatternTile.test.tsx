import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PatternTile, { PatternStrip } from "./PatternTile";

describe("PatternTile", () => {
  it("is a hidden 240×240 line drawing stroked with the border token", () => {
    render(<PatternTile className="shrink-0" />);
    const tile = screen.getByTestId("pattern-tile");
    expect(tile).toHaveAttribute("aria-hidden", "true");
    expect(tile).toHaveAttribute("viewBox", "0 0 240 240");
    expect(tile).toHaveAttribute("width", "240");
    expect(tile).toHaveAttribute("height", "240");
    expect(tile).toHaveAttribute("fill", "none");
    expect(tile).toHaveAttribute("stroke-width", "2");
    expect(tile).toHaveAttribute("stroke-linejoin", "round");
    expect(tile).toHaveClass("stroke-border-strong", "shrink-0");
  });

  it("draws the 14 paths", () => {
    render(<PatternTile />);
    const paths = screen.getAllByTestId("pattern-tile-path");
    expect(paths).toHaveLength(14);
    expect(paths[1]).toHaveAttribute("d", "M60 40 L100 80 L60 120 L20 80 Z");
    expect(paths[6]).toHaveAttribute("d", "M0 140 H240");
  });
});

describe("PatternStrip", () => {
  it("lays out six tiles by default in a hidden, clipped row", () => {
    render(<PatternStrip />);
    const strip = screen.getByTestId("pattern-strip");
    expect(strip).toHaveAttribute("aria-hidden", "true");
    expect(strip).toHaveClass("flex", "h-30", "overflow-hidden", "opacity-60");
    expect(screen.getAllByTestId("pattern-tile")).toHaveLength(6);
  });

  it("honours count and className", () => {
    render(<PatternStrip count={3} className="mt-8" />);
    expect(screen.getByTestId("pattern-strip")).toHaveClass("mt-8");
    expect(screen.getAllByTestId("pattern-tile")).toHaveLength(3);
  });
});
