import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { getAuthProvider } from "@/auth";
import { ApiError, type ArcadeGame, type Score } from "@/models";
import { arcadeRepo } from "@/models/repositories";
import { ToastProvider, useToast } from "./toast";
import { useGameController } from "./use-game";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

vi.mock("@/models/repositories", () => ({
  arcadeRepo: {
    get: vi.fn(),
    scores: vi.fn(),
    report: vi.fn(),
    remix: vi.fn(),
  },
}));

const repo = vi.mocked(arcadeRepo);

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

const SCORE: Score = {
  rank: 1,
  player: { username: "mei", display_name: "Mei" },
  value: 100,
  submitted_at: "2026-11-02T00:00:00.000Z",
  you: false,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

const setup = () =>
  renderHook(
    () => ({ page: useGameController("neon-stack"), toast: useToast() }),
    { wrapper },
  );

const writeText = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  window.sessionStorage.clear();
  repo.get.mockResolvedValue(GAME);
  repo.scores.mockResolvedValue([SCORE]);
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
});

describe("useGameController", () => {
  it("loads the game and its scores, and knows a visitor is signed out", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.page.game).toEqual(GAME));
    await waitFor(() => expect(result.current.page.scores).toEqual([SCORE]));
    expect(repo.get).toHaveBeenCalledWith("neon-stack");
    await waitFor(() => expect(result.current.page.signedIn).toBe(false));
    expect(result.current.page.notFound).toBe(false);
    expect(result.current.page.failed).toBe(false);
  });

  it("knows a signed-in player", async () => {
    await getAuthProvider().signInWithGoogle();
    const { result } = setup();
    await waitFor(() => expect(result.current.page.signedIn).toBe(true));
  });

  it("reads a 404 as a game that is not available", async () => {
    repo.get.mockRejectedValue(
      new ApiError(404, { code: "not_found", message: "game not found" }),
    );
    const { result } = setup();
    await waitFor(() => expect(result.current.page.notFound).toBe(true));
    expect(result.current.page.failed).toBe(false);
  });

  it("reads any other error as a failed load", async () => {
    repo.get.mockRejectedValue(new Error("offline"));
    const { result } = setup();
    await waitFor(() => expect(result.current.page.failed).toBe(true));
    expect(result.current.page.notFound).toBe(false);
  });

  it("reports failed scores without failing the page", async () => {
    repo.scores.mockRejectedValue(new Error("offline"));
    const { result } = setup();
    await waitFor(() => expect(result.current.page.scoresFailed).toBe(true));
    expect(result.current.page.game).toEqual(GAME);
  });

  it("copies the public link", async () => {
    const { result } = setup();
    act(() => result.current.page.openDialog("share"));
    await act(async () => {
      await result.current.page.copyLink();
    });
    expect(writeText).toHaveBeenCalledWith(
      `${window.location.origin}/arcade/neon-stack`,
    );
    expect(result.current.page.copied).toBe(true);
  });

  it("explains what to do when the clipboard is blocked", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const { result } = setup();
    await act(async () => {
      await result.current.page.copyLink();
    });
    expect(result.current.page.copied).toBe(false);
    expect(result.current.page.actionError).toBe(
      "We could not copy the link. Select it and copy it.",
    );
  });

  it("sends a report and resets when the dialog reopens", async () => {
    repo.report.mockResolvedValue(undefined);
    const { result } = setup();
    act(() => result.current.page.openDialog("report"));
    await act(async () => {
      await result.current.page.report("broken", "It freezes");
    });
    expect(repo.report).toHaveBeenCalledWith(
      "neon-stack",
      "broken",
      "It freezes",
    );
    expect(result.current.page.reportSent).toBe(true);

    act(() => result.current.page.openDialog("report"));
    expect(result.current.page.reportSent).toBe(false);
  });

  it("shows why a report failed", async () => {
    repo.report.mockRejectedValueOnce(
      new ApiError(422, {
        code: "validation_failed",
        message: "Choose a reason.",
      }),
    );
    const { result } = setup();
    await act(async () => {
      await result.current.page.report("other", "");
    });
    expect(result.current.page.actionError).toBe("Choose a reason.");

    repo.report.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await result.current.page.report("other", "");
    });
    expect(result.current.page.actionError).toBe(
      "We could not send the report. Try again.",
    );
    expect(result.current.page.saving).toBe(false);
  });

  it("remixes with an idempotency key, toasts and opens My Games", async () => {
    repo.remix.mockResolvedValue({} as never);
    const { result } = setup();
    act(() => result.current.page.openDialog("remix"));
    await act(async () => {
      await result.current.page.remix();
    });
    expect(repo.remix).toHaveBeenCalledWith("neon-stack", expect.any(String));
    expect(repo.remix.mock.calls[0][1].length).toBeGreaterThan(8);
    expect(result.current.toast.toasts.at(-1)?.message).toBe(
      "Remix created. It is in My Games.",
    );
    expect(result.current.page.dialog).toBeNull();
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("keeps the remix dialog open with the API's reason on a 4xx", async () => {
    repo.remix.mockRejectedValue(
      new ApiError(403, {
        code: "attestation_required",
        message: "Confirm you are 16 or older before making games.",
      }),
    );
    const { result } = setup();
    act(() => result.current.page.openDialog("remix"));
    await act(async () => {
      await result.current.page.remix();
    });
    expect(result.current.page.dialog).toBe("remix");
    expect(result.current.page.actionError).toBe(
      "Confirm you are 16 or older before making games.",
    );
    expect(push).not.toHaveBeenCalled();

    act(() => result.current.page.closeDialog());
    expect(result.current.page.actionError).toBeNull();
  });
});
