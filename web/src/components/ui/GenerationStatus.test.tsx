import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenerationStatus, { type GenerationState } from "./GenerationStatus";

describe("GenerationStatus", () => {
  it.each<[GenerationState, string, string, string]>([
    [
      "queued",
      "text-text-secondary",
      "In the queue",
      "Your game starts building in a moment.",
    ],
    [
      "generating",
      "text-accent-text",
      "Writing your game",
      "Step 1 of 2. This usually takes under a minute.",
    ],
    [
      "checking",
      "text-accent-text",
      "Checking that it runs",
      "Step 2 of 2. We type-check the game and play it for a few seconds.",
    ],
    [
      "retrying",
      "text-warning-text",
      "Fixing a problem",
      "The last try failed a check. This is attempt 2 of 3.",
    ],
    [
      "ready",
      "text-success-text",
      "Your game is ready",
      "It passed its checks. Play it in the preview.",
    ],
    [
      "failed",
      "text-danger-text",
      "We could not build this",
      "The game failed its checks after 3 attempts. Try again or change the prompt.",
    ],
    [
      "refused",
      "text-warning-text",
      "We can’t make that",
      "This prompt breaks the content policy. Change the prompt and try again. This did not use your quota.",
    ],
  ])(
    "%s shows its icon colour, title and detail",
    (state, tone, title, detail) => {
      render(<GenerationStatus state={state} />);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("data-state", state);
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveClass(
        "flex",
        "gap-3",
        "rounded-md",
        "border-border-default",
        "bg-bg-raised",
        "p-3",
      );
      const icon = screen.getByTestId("generation-status-icon");
      expect(icon).toHaveClass(tone, "h-5", "w-5");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByText(title)).toHaveClass(
        "text-label-md",
        "text-text-primary",
      );
      expect(screen.getByText(detail)).toHaveClass(
        "text-body-sm",
        "text-text-secondary",
      );
    },
  );

  it("spins only while generating or checking, with a reduced-motion fallback", () => {
    const { rerender } = render(<GenerationStatus state="generating" />);
    expect(screen.getByTestId("generation-status-icon")).toHaveClass(
      "animate-spin",
      "motion-reduce:animate-none",
    );
    rerender(<GenerationStatus state="checking" />);
    expect(screen.getByTestId("generation-status-icon")).toHaveClass(
      "animate-spin",
    );
    rerender(<GenerationStatus state="retrying" />);
    expect(screen.getByTestId("generation-status-icon")).not.toHaveClass(
      "animate-spin",
    );
  });

  it("names the version when it is ready", () => {
    render(<GenerationStatus state="ready" version={4} />);
    expect(screen.getByText("Version 4 is ready")).toBeInTheDocument();
  });

  it("uses the given attempt and maxAttempts", () => {
    const { rerender } = render(
      <GenerationStatus state="retrying" attempt={3} maxAttempts={5} />,
    );
    expect(
      screen.getByText("The last try failed a check. This is attempt 3 of 5."),
    ).toBeInTheDocument();
    rerender(<GenerationStatus state="failed" maxAttempts={5} />);
    expect(
      screen.getByText(
        "The game failed its checks after 5 attempts. Try again or change the prompt.",
      ),
    ).toBeInTheDocument();
  });

  it("offers Try again only when failed with onRetry", async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<GenerationStatus state="failed" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    rerender(<GenerationStatus state="refused" onRetry={onRetry} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    rerender(<GenerationStatus state="failed" onRetry={onRetry} />);
    const button = screen.getByRole("button", { name: "Try again" });
    expect(button).toHaveAttribute("data-kind", "secondary");
    expect(button).toHaveAttribute("data-size", "sm");
    expect(button).toHaveClass("mt-1");
    await userEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("merges className", () => {
    render(<GenerationStatus state="queued" className="mt-4" />);
    expect(screen.getByRole("status")).toHaveClass("mt-4");
  });
});
