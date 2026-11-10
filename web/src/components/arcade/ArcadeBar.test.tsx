import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/design/ThemeProvider";
import ArcadeBar from "./ArcadeBar";

const setup = (signedIn: boolean | null) =>
  render(
    <ThemeProvider>
      <ArcadeBar signedIn={signedIn} />
    </ThemeProvider>,
  );

describe("ArcadeBar", () => {
  it("links home and to the Arcade", () => {
    setup(false);
    expect(screen.getByRole("link", { name: "Consoless" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Arcade" })).toHaveAttribute(
      "href",
      "/arcade",
    );
  });

  it("offers Sign in to a visitor", () => {
    setup(false);
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/signin",
    );
    expect(screen.queryByRole("link", { name: "My Games" })).toBeNull();
  });

  it("offers My Games to a signed-in player", () => {
    setup(true);
    expect(screen.getByRole("link", { name: "My Games" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
  });

  it("shows neither while the session is being read", () => {
    setup(null);
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
    expect(screen.queryByRole("link", { name: "My Games" })).toBeNull();
  });
});
