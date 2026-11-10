import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import GameCard from "./GameCard";

const props = {
  title: "Neon Stack",
  byline: "by Ada Okafor",
  meta: "128 plays",
  badge: "Handheld",
  href: "/play/neon-stack",
  screen: <span>Thumbnail picture</span>,
};

describe("GameCard", () => {
  it("is a link named by the title", () => {
    render(<GameCard {...props} />);
    const card = screen.getByRole("link", { name: /Neon Stack/ });
    expect(card).toHaveAttribute("href", "/play/neon-stack");
    expect(card).toHaveClass(
      "group",
      "block",
      "max-w-74",
      "rounded-lg",
      "border-border-default",
      "bg-bg-raised",
    );
  });

  it("carries the MI-12 hover and the focus ring", () => {
    render(<GameCard {...props} />);
    expect(screen.getByRole("link")).toHaveClass(
      "hover:border-border-strong",
      "hover:shadow-md",
      "duration-fast",
      "motion-reduce:transition-none",
      "focus-visible:outline-focus-ring",
    );
  });

  it("renders the screen in the thumbnail", () => {
    render(<GameCard {...props} />);
    const thumbnail = screen.getByTestId("game-card-thumbnail");
    expect(thumbnail).toHaveClass(
      "aspect-[296/176]",
      "overflow-hidden",
      "bg-bg-inset",
    );
    expect(
      within(thumbnail).getByText("Thumbnail picture"),
    ).toBeInTheDocument();
  });

  it("shows the title, byline, neutral badge and meta", () => {
    render(<GameCard {...props} />);
    expect(screen.getByText("Neon Stack")).toHaveClass(
      "truncate",
      "text-heading-sm",
      "text-text-primary",
    );
    expect(screen.getByText("by Ada Okafor")).toHaveClass(
      "text-caption",
      "text-text-secondary",
    );
    expect(screen.getByText("Handheld")).toHaveAttribute(
      "data-kind",
      "neutral",
    );
    const meta = screen.getByTestId("game-card-meta");
    expect(meta).toHaveTextContent("128 plays");
    expect(meta).toHaveClass("text-caption", "text-text-muted");
  });

  it("renders a project the same way and merges className", () => {
    render(
      <GameCard
        {...props}
        title="Kart Draft"
        byline="Edited 2 minutes ago"
        meta="Not published"
        badge="Draft"
        href="/studio/kart-draft"
        className="mx-auto"
      />,
    );
    const card = screen.getByRole("link", { name: /Kart Draft/ });
    expect(card).toHaveAttribute("href", "/studio/kart-draft");
    expect(card).toHaveClass("mx-auto");
    expect(screen.getByText("Edited 2 minutes ago")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByTestId("game-card-meta")).toHaveTextContent(
      "Not published",
    );
  });
});
