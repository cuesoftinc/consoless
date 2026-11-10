import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ArcadeGame } from "@/models";
import { arcadeRepo } from "@/models/repositories";
import { SEARCH_DEBOUNCE_MS, useArcadeController } from "./use-arcade";

vi.mock("@/models/repositories", () => ({
  arcadeRepo: { list: vi.fn() },
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

beforeEach(() => {
  vi.clearAllMocks();
  repo.list.mockResolvedValue({ items: [GAME], next_cursor: null });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useArcadeController", () => {
  it("loads every game with no filters", async () => {
    const { result } = renderHook(() => useArcadeController());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.games).toEqual([GAME]);
    expect(result.current.filtered).toBe(false);
    expect(repo.list).toHaveBeenCalledWith({ q: "", style: null, fail: false });
  });

  it("debounces the search and trims it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { result } = renderHook(() => useArcadeController());
    await waitFor(() => expect(repo.list).toHaveBeenCalledTimes(1));

    act(() => result.current.setQuery(" sta"));
    act(() => result.current.setQuery(" stack "));
    expect(result.current.query).toBe(" stack ");
    expect(repo.list).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS + 20);
    });
    await waitFor(() => expect(repo.list).toHaveBeenCalledTimes(2));
    expect(repo.list).toHaveBeenLastCalledWith({
      q: "stack",
      style: null,
      fail: false,
    });
    expect(result.current.filtered).toBe(true);
  });

  it("filters by style at once and clears every filter together", async () => {
    const { result } = renderHook(() => useArcadeController());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setStyle("arcade"));
    await waitFor(() =>
      expect(repo.list).toHaveBeenLastCalledWith({
        q: "",
        style: "arcade",
        fail: false,
      }),
    );
    expect(result.current.filtered).toBe(true);

    act(() => result.current.clearFilters());
    await waitFor(() => expect(result.current.filtered).toBe(false));
    expect(result.current.query).toBe("");
    expect(result.current.style).toBeNull();
  });

  it("reports a failed load", async () => {
    repo.list.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useArcadeController({ fail: true }));
    await waitFor(() => expect(result.current.failed).toBe(true));
    expect(result.current.games).toEqual([]);
  });
});
