import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/design/ThemeProvider";
import type { Me } from "@/models";
import AppBar from "./AppBar";

const push = vi.fn();
let pathname = "/dashboard";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}));

const ME: Me = {
  id: "usr_playerone",
  email: "playerone@example.com",
  display_name: "Player One",
  username: "playerone",
  creator_attested_at: "2026-11-01T00:00:00.000Z",
  created_at: "2026-11-01T00:00:00.000Z",
  quota: { limit: 20, used: 6, resets_at: "2026-11-11T00:00:00.000Z" },
};

function setup(me: Me | null = ME) {
  const onSignOut = vi.fn();
  render(
    <ThemeProvider>
      <AppBar me={me} onSignOut={onSignOut} />
    </ThemeProvider>,
  );
  return { onSignOut };
}

beforeEach(() => {
  push.mockClear();
  pathname = "/dashboard";
});

describe("AppBar", () => {
  it("links the areas and marks the current one", () => {
    setup();
    const nav = screen.getByRole("navigation", { name: "App" });
    const games = within(nav).getByRole("link", { name: "My Games" });
    expect(games).toHaveAttribute("href", "/dashboard");
    expect(games).toHaveAttribute("aria-current", "page");
    expect(
      within(nav).getByRole("link", { name: "Settings" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps Settings current on its sub-routes", () => {
    pathname = "/dashboard/settings/appearance";
    setup();
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "My Games" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows how many generations are left today", () => {
    setup();
    expect(
      screen.getByRole("meter", { name: "Generations left today" }),
    ).toHaveAttribute("aria-valuenow", "14");
  });

  it("opens the account menu with the user, Settings and Sign out", async () => {
    const { onSignOut } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Account menu" }));
    const menu = screen.getByRole("menu", { name: "Account" });
    expect(menu).toHaveTextContent("Player One");
    expect(menu).toHaveTextContent("playerone@example.com");

    await userEvent.click(
      within(menu).getByRole("menuitem", { name: "Settings" }),
    );
    expect(push).toHaveBeenCalledWith("/dashboard/settings");

    await userEvent.click(screen.getByRole("button", { name: "Account menu" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("hides the quota and the account menu while the user loads", () => {
    setup(null);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Account menu" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Consoless" })).toBeInTheDocument();
  });
});
