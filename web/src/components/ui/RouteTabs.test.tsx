import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RouteTabs from "./RouteTabs";

let pathname = "/settings/profile";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

const TABS = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/account", label: "Account" },
  { href: "/settings/data-privacy", label: "Data & privacy" },
];

const renderTabs = () =>
  render(
    <RouteTabs
      tabs={TABS}
      aria-label="Settings sections"
      className="mt-4"
      paneClassName="max-w-120"
    >
      <p>Pane content</p>
    </RouteTabs>,
  );

describe("RouteTabs", () => {
  beforeEach(() => {
    pathname = "/settings/profile";
  });

  it("renders link tabs in a labelled tablist and marks the active route", () => {
    renderTabs();
    expect(
      screen.getByRole("tablist", { name: "Settings sections" }),
    ).toHaveClass("flex", "gap-6");

    const active = screen.getByRole("tab", { name: "Profile" });
    expect(active).toHaveAttribute("href", TABS[0].href);
    expect(active).toHaveAttribute("aria-selected", "true");
    expect(active).toHaveAttribute("aria-current", "page");
    expect(active).toHaveAttribute("tabindex", "0");
    expect(active).toHaveAttribute("data-state", "active");
    expect(active).toHaveClass(
      "border-b-2",
      "px-1",
      "py-3",
      "text-label-md",
      "border-accent-default",
      "text-text-primary",
    );

    const inactive = screen.getByRole("tab", { name: "Account" });
    expect(inactive).toHaveAttribute("aria-selected", "false");
    expect(inactive).not.toHaveAttribute("aria-current");
    expect(inactive).toHaveAttribute("tabindex", "-1");
    expect(inactive).toHaveClass("border-transparent", "text-text-secondary");
  });

  it("labels the tabpanel by the active tab and renders the pane", () => {
    renderTabs();
    const panel = screen.getByRole("tabpanel");
    const active = screen.getByRole("tab", { name: "Profile" });
    expect(active).toHaveAttribute("id", "route-tab-settings-profile");
    expect(panel).toHaveAttribute("aria-labelledby", active.id);
    expect(panel).toHaveTextContent("Pane content");
    expect(panel).toHaveClass("pt-4", "max-w-120");
  });

  it("keeps the active tab marked on deeper sub-paths", () => {
    pathname = "/settings/data-privacy/export";
    renderTabs();
    expect(screen.getByRole("tab", { name: "Data & privacy" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("prefers the longest matching href when hrefs nest", () => {
    pathname = "/projects/archive";
    render(
      <RouteTabs
        tabs={[
          { href: "/projects", label: "Active" },
          { href: "/projects/archive", label: "Archive" },
        ]}
        aria-label="Project views"
      >
        <p>Archive pane</p>
      </RouteTabs>,
    );
    expect(screen.getByRole("tab", { name: "Archive" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Active" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("falls back to the first tab for focus when no route matches", () => {
    pathname = "/elsewhere";
    renderTabs();
    const first = screen.getByRole("tab", { name: "Profile" });
    expect(first).toHaveAttribute("tabindex", "0");
    expect(first).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).not.toHaveAttribute("aria-labelledby");
  });

  it("moves focus with the arrow keys, Home and End without navigating", async () => {
    const user = userEvent.setup();
    renderTabs();
    const [profile, account, privacy] = TABS.map((tab) =>
      screen.getByRole("tab", { name: tab.label }),
    );

    profile.focus();
    await user.keyboard("{ArrowRight}");
    expect(account).toHaveFocus();
    await user.keyboard("{End}");
    expect(privacy).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(profile).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(privacy).toHaveFocus();
    await user.keyboard("{Home}");
    expect(profile).toHaveFocus();
    expect(profile).toHaveAttribute("aria-current", "page");
  });
});
