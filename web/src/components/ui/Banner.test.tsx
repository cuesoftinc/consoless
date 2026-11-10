import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Banner, { type BannerKind } from "./Banner";

describe("Banner", () => {
  it.each<[BannerKind, string, string, string]>([
    ["info", "status", "bg-accent-subtle", "text-accent-text"],
    ["warning", "status", "bg-warning-subtle", "text-warning-text"],
    ["success", "status", "bg-success-subtle", "text-success-text"],
    ["danger", "alert", "bg-danger-subtle", "text-danger-text"],
  ])(
    "%s uses role=%s with its tint and icon colour",
    (kind, role, bg, text) => {
      render(<Banner kind={kind}>Your quota resets at midnight.</Banner>);
      const banner = screen.getByRole(role);
      expect(banner).toHaveAttribute("data-kind", kind);
      expect(banner).toHaveClass(bg, "rounded-md", "p-3");
      expect(banner).toHaveTextContent("Your quota resets at midnight.");
      const icon = screen.getByTestId("banner-icon");
      expect(icon).toHaveClass(text, "h-5", "w-5");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    },
  );

  it("renders the body in the primary text token", () => {
    render(<Banner kind="info">Saved.</Banner>);
    expect(screen.getByText("Saved.")).toHaveClass(
      "flex-1",
      "text-body-sm",
      "text-text-primary",
    );
  });

  it("renders an action and merges className", () => {
    render(
      <Banner kind="warning" action={<button>Upgrade</button>} className="mt-4">
        You have 2 generations left.
      </Banner>,
    );
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("mt-4");
  });
});
