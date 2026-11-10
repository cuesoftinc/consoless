import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/design/ThemeProvider";
import MarketingNav, { type MarketingNavProps } from "./MarketingNav";

const STAR_NAME = "Star cuesoftinc/consoless on GitHub";

const setup = (props: MarketingNavProps = {}) =>
  render(
    <ThemeProvider>
      <MarketingNav {...props} />
    </ThemeProvider>,
  );

/** Stops jsdom from trying to navigate when a link is pressed. */
const pressLink = async (link: HTMLElement) => {
  link.addEventListener("click", (event) => event.preventDefault());
  await userEvent.click(link);
};

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("MarketingNav", () => {
  it("is a header bar with the Marketing nav landmark and the logo home link", () => {
    setup();
    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "border-b",
      "border-border-default",
      "bg-bg-base",
    );
    expect(
      screen.getByRole("navigation", { name: "Marketing" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Consoless" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders the four fixed links, externals in a new tab", () => {
    setup();
    const features = screen.getByRole("link", { name: "Features" });
    expect(features).toHaveAttribute("href", "#features");
    expect(features).not.toHaveAttribute("target");
    expect(features).toHaveClass("text-label-md", "text-text-secondary");
    expect(screen.getByRole("link", { name: "Consoles" })).toHaveAttribute(
      "href",
      "#consoles",
    );
    const docs = screen.getByRole("link", { name: "Docs" });
    expect(docs).toHaveAttribute(
      "href",
      "https://cuesoft.gitbook.io/consoless",
    );
    expect(docs).toHaveAttribute("target", "_blank");
    expect(docs).toHaveAttribute("rel", "noreferrer");
    const github = screen.getByRole("link", { name: STAR_NAME });
    expect(github).toHaveAttribute(
      "href",
      "https://github.com/cuesoftinc/consoless",
    );
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noreferrer");
  });

  it("shows the neutral Star with no number when the count is unknown", () => {
    const { rerender } = setup();
    expect(screen.getByTestId("star-badge")).toHaveTextContent(/^Star$/);
    expect(screen.queryByTestId("star-count")).not.toBeInTheDocument();
    rerender(
      <ThemeProvider>
        <MarketingNav starCount={null} />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("star-badge")).toHaveTextContent(/^Star$/);
  });

  it("shows the live star count when one is passed", () => {
    setup({ starCount: 1280 });
    expect(screen.getByTestId("star-count")).toHaveTextContent("1,280");
  });

  it("Sign in is a text link and Try Cloud the primary CTA, both to /signin", () => {
    setup();
    const signIn = screen.getByRole("link", { name: "Sign in" });
    expect(signIn).toHaveAttribute("href", "/signin");
    expect(signIn).not.toHaveClass("bg-accent-default");
    const tryCloud = screen.getByRole("link", { name: "Try Cloud" });
    expect(tryCloud).toHaveAttribute("href", "/signin");
    expect(tryCloud).toHaveClass("bg-accent-default", "h-9");
  });

  it("renders the theme toggle", () => {
    setup();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("reports the id of each pressed link", async () => {
    const onLinkClick = vi.fn();
    setup({ onLinkClick });
    await pressLink(screen.getByRole("link", { name: "Features" }));
    expect(onLinkClick).toHaveBeenLastCalledWith("features");
    await pressLink(screen.getByRole("link", { name: "Consoles" }));
    expect(onLinkClick).toHaveBeenLastCalledWith("consoles");
    await pressLink(screen.getByRole("link", { name: "Docs" }));
    expect(onLinkClick).toHaveBeenLastCalledWith("docs");
    await pressLink(screen.getByRole("link", { name: STAR_NAME }));
    expect(onLinkClick).toHaveBeenLastCalledWith("github");
    await pressLink(screen.getByRole("link", { name: "Sign in" }));
    expect(onLinkClick).toHaveBeenLastCalledWith("sign-in");
    await pressLink(screen.getByRole("link", { name: "Try Cloud" }));
    expect(onLinkClick).toHaveBeenLastCalledWith("try-cloud");
    expect(onLinkClick).toHaveBeenCalledTimes(6);
  });

  it("the hamburger opens a panel with the four links, the toggle and Sign in", async () => {
    setup();
    const menu = screen.getByRole("button", { name: "Menu" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("marketing-nav-panel")).not.toBeInTheDocument();

    await userEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByTestId("marketing-nav-panel");
    expect(panel).toHaveAttribute("id", menu.getAttribute("aria-controls"));
    expect(panel).toHaveClass("md:hidden");

    const inPanel = within(panel);
    expect(inPanel.getByRole("link", { name: "Features" })).toHaveAttribute(
      "href",
      "#features",
    );
    expect(inPanel.getByRole("link", { name: "Consoles" })).toHaveAttribute(
      "href",
      "#consoles",
    );
    expect(inPanel.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "https://cuesoft.gitbook.io/consoless",
    );
    expect(inPanel.getByRole("link", { name: STAR_NAME })).toHaveAttribute(
      "href",
      "https://github.com/cuesoftinc/consoless",
    );
    expect(inPanel.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/signin",
    );
    expect(inPanel.getByTestId("theme-toggle")).toBeInTheDocument();
    // Try Cloud stays in the bar: it renders once and not in the panel.
    expect(screen.getAllByRole("link", { name: "Try Cloud" })).toHaveLength(1);
    expect(
      inPanel.queryByRole("link", { name: "Try Cloud" }),
    ).not.toBeInTheDocument();

    await userEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("marketing-nav-panel")).not.toBeInTheDocument();
  });

  it("closes the panel on Escape and when a panel link is pressed", async () => {
    const onLinkClick = vi.fn();
    setup({ onLinkClick });
    const menu = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(menu);
    await userEvent.keyboard("{Escape}");
    expect(menu).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(menu);
    await pressLink(
      within(screen.getByTestId("marketing-nav-panel")).getByRole("link", {
        name: "Features",
      }),
    );
    expect(onLinkClick).toHaveBeenCalledWith("features");
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  it("merges className on the header", () => {
    setup({ className: "sticky" });
    expect(screen.getByRole("banner")).toHaveClass("sticky", "bg-bg-base");
  });
});
