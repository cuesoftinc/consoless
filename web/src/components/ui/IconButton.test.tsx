import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Share2 } from "lucide-react";
import IconButton from "./IconButton";

describe("IconButton", () => {
  it("is named by aria-label and hides the icon from assistive tech", () => {
    render(<IconButton icon={Share2} aria-label="Share" />);
    const button = screen.getByRole("button", { name: "Share" });
    expect(button).toHaveAttribute("data-kind", "ghost");
    expect(screen.getByTestId("icon-button-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders the secondary kind with a border and fires onClick", async () => {
    const onClick = vi.fn();
    render(
      <IconButton
        icon={Share2}
        aria-label="Share"
        kind="secondary"
        onClick={onClick}
      />,
    );
    const button = screen.getByRole("button", { name: "Share" });
    expect(button).toHaveClass("border-border-strong", "bg-bg-raised");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
