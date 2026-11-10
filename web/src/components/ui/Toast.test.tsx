import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toast, { type ToastKind } from "./Toast";

describe("Toast", () => {
  it.each<[ToastKind, string, string]>([
    ["success", "status", "text-success-text"],
    ["info", "status", "text-accent-text"],
    ["error", "alert", "text-danger-text"],
  ])("%s uses role=%s and its icon colour", (kind, role, text) => {
    render(<Toast kind={kind} title="Game published" />);
    const toast = screen.getByRole(role);
    expect(toast).toHaveAttribute("data-kind", kind);
    expect(toast).toHaveClass(
      "w-90",
      "max-w-full",
      "rounded-lg",
      "border-border-strong",
      "bg-bg-raised",
      "shadow-lg",
    );
    expect(screen.getByTestId("toast-icon")).toHaveClass(text, "h-5", "w-5");
  });

  it("renders the title and the optional body", () => {
    const { rerender } = render(<Toast kind="info" title="Link copied" />);
    expect(screen.getByText("Link copied")).toHaveClass(
      "text-label-md",
      "text-text-primary",
    );
    expect(screen.queryByText("Share it anywhere.")).not.toBeInTheDocument();
    rerender(
      <Toast kind="info" title="Link copied" body="Share it anywhere." />,
    );
    expect(screen.getByText("Share it anywhere.")).toHaveClass(
      "text-body-sm",
      "text-text-secondary",
    );
  });

  it("shows a dismiss button only when onDismiss is set", async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Toast kind="success" title="Saved" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    rerender(<Toast kind="success" title="Saved" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("merges className", () => {
    render(<Toast kind="info" title="Saved" className="mt-4" />);
    expect(screen.getByRole("status")).toHaveClass("mt-4");
  });
});
