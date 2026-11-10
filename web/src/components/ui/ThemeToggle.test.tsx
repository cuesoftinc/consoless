// ThemeToggle cycles the ThemeProvider preference light → dark → system and
// persists it under `consoless.theme`. Key absent = light, the design
// default (P-04); "system" is stored explicitly.
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { THEME_STORAGE_KEY, ThemeProvider } from "@/design/ThemeProvider";
import ThemeToggle from "./ThemeToggle";

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

const setup = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );

describe("ThemeToggle", () => {
  it("announces light when no preference is stored, and switches to dark", async () => {
    setup();
    await userEvent.click(
      screen.getByRole("button", { name: "Theme: light — switch to dark" }),
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("cycles dark → system → light, storing each choice", async () => {
    setup();
    await userEvent.click(
      screen.getByRole("button", { name: "Theme: light — switch to dark" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Theme: dark — switch to system" }),
    );
    // "system" is stored explicitly; data-theme carries the resolved theme
    // (light: jsdom reports no dark preference).
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    await userEvent.click(
      screen.getByRole("button", { name: "Theme: system — switch to light" }),
    );
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});
