import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ConsoleFrame, { type ConsoleFrameStyle } from "./ConsoleFrame";

const STYLES: Array<[ConsoleFrameStyle, string, string]> = [
  ["handheld", "max-w-[360px]", "aspect-[10/9]"],
  ["8-bit", "max-w-[640px]", "aspect-[16/15]"],
  ["16-bit", "max-w-[640px]", "aspect-[8/7]"],
  ["arcade", "max-w-[480px]", "aspect-[3/4]"],
  ["modern", "max-w-[720px]", "aspect-video"],
  ["3d", "max-w-[720px]", "aspect-video"],
];

describe("ConsoleFrame", () => {
  it.each(STYLES)(
    "%s sets data-style, is fluid and renders children in the screen slot",
    (consoleStyle, maxWidth, aspect) => {
      render(
        <ConsoleFrame consoleStyle={consoleStyle} className="mx-auto">
          <span>Game picture</span>
        </ConsoleFrame>,
      );
      const frame = screen.getByTestId("console-frame");
      expect(frame).toHaveAttribute("data-style", consoleStyle);
      expect(frame).toHaveClass("w-full", maxWidth, "mx-auto");
      const slot = screen.getByTestId("console-screen");
      expect(slot).toHaveClass("overflow-hidden", aspect);
      expect(within(slot).getByText("Game picture")).toBeInTheDocument();
    },
  );

  it("renders an empty slot without children", () => {
    render(<ConsoleFrame consoleStyle="handheld" />);
    expect(screen.getByTestId("console-screen")).toBeInTheDocument();
  });

  it("arcade shows the ARCADE marquee", () => {
    render(<ConsoleFrame consoleStyle="arcade" />);
    expect(screen.getByText("ARCADE")).toHaveClass(
      "font-retro",
      "text-retro-lg",
      "text-console-screen-black",
    );
  });

  it("8-bit shows the POWER label", () => {
    render(<ConsoleFrame consoleStyle="8-bit" />);
    expect(screen.getByText("POWER")).toHaveClass(
      "font-retro",
      "text-retro-sm",
      "text-console-shell-charcoal",
    );
  });

  it("the other styles carry no marquee or power label", () => {
    render(<ConsoleFrame consoleStyle="16-bit" />);
    expect(screen.queryByText("ARCADE")).not.toBeInTheDocument();
    expect(screen.queryByText("POWER")).not.toBeInTheDocument();
  });

  it("modern has the strong border and 3d the accent border with the glow", () => {
    const { rerender } = render(<ConsoleFrame consoleStyle="modern" />);
    expect(screen.getByTestId("console-shell")).toHaveClass(
      "border",
      "border-border-strong",
      "bg-bg-inset",
      "shadow-lg",
    );
    expect(screen.getByTestId("console-screen")).toHaveClass("rounded-lg");
    rerender(<ConsoleFrame consoleStyle="3d" />);
    expect(screen.getByTestId("console-shell")).toHaveClass(
      "border-2",
      "border-accent-default",
      "shadow-glow",
    );
  });

  it("binds each retro shell to its token", () => {
    const { rerender } = render(<ConsoleFrame consoleStyle="handheld" />);
    expect(screen.getByTestId("console-shell")).toHaveClass(
      "bg-console-shell-cream",
    );
    rerender(<ConsoleFrame consoleStyle="8-bit" />);
    expect(screen.getByTestId("console-shell")).toHaveClass(
      "bg-console-shell-grey",
    );
    rerender(<ConsoleFrame consoleStyle="16-bit" />);
    expect(screen.getByTestId("console-shell")).toHaveClass(
      "bg-console-shell-cream",
    );
    rerender(<ConsoleFrame consoleStyle="arcade" />);
    expect(screen.getByTestId("console-shell")).toHaveClass(
      "bg-console-shell-wood",
    );
  });
});
