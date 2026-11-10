import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { ApiError } from "@/models";
import { meRepo, studioRepo } from "@/models/repositories";
import { MeProvider } from "./me-context";
import { generation, me, PROJECT } from "./studio-fixtures";
import { useNewGameController } from "./use-new-game";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

vi.mock("@/models/repositories", () => ({
  meRepo: { get: vi.fn() },
  studioRepo: { create: vi.fn() },
}));

const repo = vi.mocked(studioRepo);
const account = vi.mocked(meRepo);

const wrapper = ({ children }: { children: ReactNode }) => (
  <MeProvider>{children}</MeProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
  account.get.mockResolvedValue(me());
  repo.create.mockResolvedValue({
    project: PROJECT,
    generation: generation({ status: "queued" }),
  });
});

describe("useNewGameController", () => {
  it("starts on the handheld with an empty prompt", () => {
    const { result } = renderHook(() => useNewGameController(), { wrapper });
    expect(result.current.style).toBe("handheld");
    expect(result.current.prompt).toBe("");
    expect(result.current.quotaOut).toBe(false);
  });

  it("creates the project and opens its Studio", async () => {
    const { result } = renderHook(() => useNewGameController(), { wrapper });
    act(() => {
      result.current.setPrompt("  A maze  ");
      result.current.setStyle("arcade");
    });
    await act(async () => {
      await result.current.create();
    });
    expect(repo.create).toHaveBeenCalledWith(
      "A maze",
      "arcade",
      expect.any(String),
    );
    expect(push).toHaveBeenCalledWith("/dashboard/studio/prj_1");
  });

  it("does nothing with an empty prompt", async () => {
    const { result } = renderHook(() => useNewGameController(), { wrapper });
    act(() => result.current.setPrompt("   "));
    await act(async () => {
      await result.current.create();
    });
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("shows the API's reason, or plain fallback copy, and lets the user retry", async () => {
    const { result } = renderHook(() => useNewGameController(), { wrapper });
    act(() => result.current.setPrompt("A maze"));

    repo.create.mockRejectedValueOnce(
      new ApiError(429, {
        code: "quota_exhausted",
        message: "You have used today's generations. They reset tomorrow.",
      }),
    );
    await act(async () => {
      await result.current.create();
    });
    expect(result.current.error).toBe(
      "You have used today's generations. They reset tomorrow.",
    );
    expect(result.current.creating).toBe(false);

    repo.create.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await result.current.create();
    });
    expect(result.current.error).toBe(
      "We could not start your game. Try again.",
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("knows when today's generations are used up", async () => {
    account.get.mockResolvedValue(me(20));
    const { result } = renderHook(() => useNewGameController(), { wrapper });
    await waitFor(() => expect(result.current.quotaOut).toBe(true));
  });
});
