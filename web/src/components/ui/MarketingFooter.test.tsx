import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import MarketingFooter from "./MarketingFooter";

const COLUMNS: Record<string, Array<[string, string]>> = {
  Product: [
    ["Features", "#features"],
    ["Try Cloud", "/signin"],
    ["Self Host", "#self-host"],
    ["Consoles", "#consoles"],
  ],
  Docs: [
    ["Docs", "https://cuesoft.gitbook.io/consoless"],
    ["Quickstart", "https://cuesoft.gitbook.io/consoless/setup"],
    ["API reference", "https://consoless.cuesoft.io/docs/api"],
    [
      "Self-host guide",
      "https://cuesoft.gitbook.io/consoless/system/deployment",
    ],
  ],
  Community: [
    ["GitHub", "https://github.com/cuesoftinc/consoless"],
    ["Discord", "https://discord.gg/CDfZxxrxbb"],
    ["Roadmap", "https://cuesoft.gitbook.io/consoless/product/roadmap"],
    ["CueLABS™", "https://cuelabs.cuesoft.io"],
  ],
  Legal: [
    ["Privacy", "https://privacy.cuesoft.io"],
    ["Terms", "https://terms.cuesoft.io"],
    ["Status", "https://status.cuesoft.io"],
  ],
};

describe("MarketingFooter", () => {
  it("is a footer landmark on the base surface", () => {
    render(<MarketingFooter className="mt-16" />);
    expect(screen.getByRole("contentinfo")).toHaveClass(
      "border-t",
      "border-border-default",
      "bg-bg-base",
      "mt-16",
    );
  });

  it("renders the brand block", () => {
    render(<MarketingFooter />);
    expect(screen.getByTestId("logo-placeholder")).toHaveTextContent(
      "Consoless",
    );
    expect(
      screen.getByText("Describe it. Play it. Share it."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("An open-source product by CueLABS™"),
    ).toBeInTheDocument();
  });

  it.each(Object.entries(COLUMNS))(
    "the %s column has exactly its links",
    (heading, links) => {
      render(<MarketingFooter />);
      const title = screen.getByRole("heading", { level: 2, name: heading });
      expect(title).toHaveClass("uppercase", "text-text-muted");
      const column = within(screen.getByRole("navigation", { name: heading }));
      expect(column.getAllByRole("listitem")).toHaveLength(links.length);
      expect(column.getAllByRole("link")).toHaveLength(links.length);
      for (const [label, href] of links) {
        const link = column.getByRole("link", { name: label });
        expect(link).toHaveAttribute("href", href);
        expect(link).toHaveClass("text-body-sm", "text-text-secondary");
        if (href.startsWith("http")) {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noreferrer");
        } else {
          expect(link).not.toHaveAttribute("target");
        }
      }
    },
  );

  it("renders the legal line verbatim with its three links", () => {
    render(<MarketingFooter year={2026} />);
    const legal = screen.getByTestId("footer-legal");
    expect(legal).toHaveTextContent(
      "© Cuesoft Inc. 2026. Consoless. CueLABS™ Division. MIT License.",
    );
    const inLegal = within(legal);
    expect(inLegal.getByRole("link", { name: "Cuesoft Inc." })).toHaveAttribute(
      "href",
      "https://cuesoft.io",
    );
    expect(
      inLegal.getByRole("link", { name: "CueLABS™ Division" }),
    ).toHaveAttribute("href", "https://cuelabs.cuesoft.io");
    expect(inLegal.getByRole("link", { name: "MIT License" })).toHaveAttribute(
      "href",
      "https://github.com/cuesoftinc/consoless/blob/main/LICENSE",
    );
  });

  it("defaults the year to the current year", () => {
    render(<MarketingFooter />);
    expect(screen.getByTestId("footer-legal")).toHaveTextContent(
      `© Cuesoft Inc. ${new Date().getFullYear()}.`,
    );
  });

  it("carries the language selector and the security policy link", () => {
    render(<MarketingFooter />);
    const language = screen.getByRole("combobox", { name: "Language" });
    expect(within(language).getAllByRole("option")).toHaveLength(1);
    expect(
      within(language).getByRole("option", { name: "English" }),
    ).toBeInTheDocument();
    const security = screen.getByRole("link", { name: "Security policy" });
    expect(security).toHaveAttribute(
      "href",
      "https://github.com/cuesoftinc/consoless/blob/main/SECURITY.md",
    );
    expect(security).toHaveAttribute("target", "_blank");
  });
});
