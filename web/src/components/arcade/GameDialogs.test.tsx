import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ArcadeGame } from "@/models";
import { RemixDialog, ReportDialog, ShareDialog } from "./GameDialogs";

const GAME: ArcadeGame = {
  id: "neon-stack",
  slug: "neon-stack",
  title: "Neon Stack",
  author: { username: "ada", display_name: "Ada" },
  style_id: "handheld",
  prompt: "A falling-block puzzle",
  artwork: "blocks",
  plays: 10,
  published_at: "2026-11-01T00:00:00.000Z",
  remixed_from: null,
};

describe("ShareDialog", () => {
  const base = {
    game: GAME,
    url: "https://consoless.cuesoft.io/arcade/neon-stack",
    copied: false,
    error: null,
    onClose: vi.fn(),
  };

  it("shows the link and copies it", async () => {
    const onCopy = vi.fn();
    render(<ShareDialog {...base} onCopy={onCopy} />);
    expect(
      screen.getByRole("dialog", { name: "Share Neon Stack" }),
    ).toHaveTextContent("No account is needed.");
    const field = screen.getByRole("textbox", { name: "Link" });
    expect(field).toHaveValue(base.url);
    expect(field).toHaveAttribute("readonly");
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("confirms the copy in the button and to screen readers", () => {
    render(<ShareDialog {...base} copied onCopy={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Link copied" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Link copied.");
  });

  it("shows a copy failure", () => {
    render(
      <ShareDialog
        {...base}
        error="We could not copy the link. Select it and copy it."
        onCopy={vi.fn()}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Select it and copy it",
    );
  });
});

describe("ReportDialog", () => {
  const base = {
    game: GAME,
    saving: false,
    sent: false,
    error: null,
    onClose: vi.fn(),
  };

  it("needs a reason, then sends it with trimmed details", async () => {
    const onReport = vi.fn();
    render(<ReportDialog {...base} onReport={onReport} />);
    const send = screen.getByRole("button", { name: "Send report" });
    expect(send).toBeDisabled();
    expect(screen.getAllByRole("radio")).toHaveLength(4);

    await userEvent.click(
      screen.getByRole("radio", { name: "It does not work" }),
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Details (optional)" }),
      " It freezes ",
    );
    await userEvent.click(send);
    expect(onReport).toHaveBeenCalledWith("broken", "It freezes");
  });

  it("shows an error and locks the actions while sending", () => {
    render(
      <ReportDialog
        {...base}
        saving
        error="We could not send the report. Try again."
        onReport={vi.fn()}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Try again.");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("thanks the reporter once sent", async () => {
    const onClose = vi.fn();
    render(
      <ReportDialog {...base} sent onClose={onClose} onReport={vi.fn()} />,
    );
    expect(
      screen.getByRole("dialog", { name: "Report sent" }),
    ).toHaveTextContent("We review every report");
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("RemixDialog", () => {
  const base = {
    game: GAME,
    saving: false,
    error: null,
    onClose: vi.fn(),
  };

  it("sends a visitor to sign in", () => {
    render(<RemixDialog {...base} signedIn={false} onRemix={vi.fn()} />);
    expect(
      screen.getByRole("dialog", { name: "Sign in to remix" }),
    ).toHaveTextContent("playing does not");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/signin",
    );
    expect(screen.queryByRole("button", { name: "Remix" })).toBeNull();
  });

  it("explains the credit and remixes for a signed-in player", async () => {
    const onRemix = vi.fn();
    render(<RemixDialog {...base} signedIn onRemix={onRemix} />);
    expect(
      screen.getByRole("dialog", { name: "Remix Neon Stack?" }),
    ).toHaveTextContent("it credits Neon Stack by Ada");
    await userEvent.click(screen.getByRole("button", { name: "Remix" }));
    expect(onRemix).toHaveBeenCalledTimes(1);
  });

  it("shows why a remix failed", () => {
    render(
      <RemixDialog
        {...base}
        signedIn
        error="Confirm you are 16 or older before making games."
        onRemix={vi.fn()}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("16 or older");
  });
});
