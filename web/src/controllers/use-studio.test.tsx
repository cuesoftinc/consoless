import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { ApiError } from "@/models";
import { meRepo, studioRepo } from "@/models/repositories";
import { MeProvider } from "./me-context";
import { generation, me, PROJECT, VERSIONS } from "./studio-fixtures";
import { ToastProvider, useToast } from "./toast";
import { POLL_MS, useStudioController } from "./use-studio";

vi.mock("@/models/repositories", () => ({
  meRepo: { get: vi.fn() },
  studioRepo: {
    project: vi.fn(),
    generations: vi.fn(),
    versions: vi.fn(),
    generate: vi.fn(),
    generation: vi.fn(),
    restore: vi.fn(),
    setStyle: vi.fn(),
    publish: vi.fn(),
  },
}));

const repo = vi.mocked(studioRepo);
const account = vi.mocked(meRepo);

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>
    <MeProvider>{children}</MeProvider>
  </ToastProvider>
);

const setup = () =>
  renderHook(
    () => ({ studio: useStudioController("prj_1"), toast: useToast() }),
    { wrapper },
  );

async function loaded() {
  const view = setup();
  await waitFor(() =>
    expect(view.result.current.studio.project).toEqual(PROJECT),
  );
  await waitFor(() =>
    expect(view.result.current.studio.versions).toHaveLength(2),
  );
  return view;
}

beforeEach(() => {
  vi.clearAllMocks();
  account.get.mockResolvedValue(me());
  repo.project.mockResolvedValue(PROJECT);
  repo.generations.mockResolvedValue([generation()]);
  repo.versions.mockResolvedValue(VERSIONS);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useStudioController", () => {
  it("loads the project, its chat and its versions, showing the head", async () => {
    const { result } = await loaded();
    const { studio } = result.current;
    expect(studio.generations).toHaveLength(1);
    expect(studio.active).toBeNull();
    expect(studio.viewing?.id).toBe("ver_2");
    expect(studio.viewingHead).toBe(true);
    expect(studio.promptDisabled).toBe(false);
    expect(repo.project).toHaveBeenCalledWith("prj_1");
  });

  it("tells a missing project from a failed load", async () => {
    repo.project.mockRejectedValue(
      new ApiError(404, { code: "not_found", message: "project not found" }),
    );
    const { result } = setup();
    await waitFor(() => expect(result.current.studio.notFound).toBe(true));
    expect(result.current.studio.failed).toBe(false);
  });

  it("reports any other load error as failed", async () => {
    repo.project.mockRejectedValue(new Error("offline"));
    const { result } = setup();
    await waitFor(() => expect(result.current.studio.failed).toBe(true));
    expect(result.current.studio.notFound).toBe(false);
  });

  it("sends a trimmed prompt, locks the box and polls until it is ready", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const queued = generation({
      id: "gen_2",
      prompt: "Add a boss",
      status: "queued",
      message: null,
      version_id: null,
    });
    repo.generate.mockResolvedValue(queued);
    repo.generation
      .mockResolvedValueOnce({ ...queued, status: "generating" })
      .mockResolvedValueOnce({
        ...queued,
        status: "ready",
        version_id: "ver_3",
        message: "Done.",
      });
    const { result } = await loaded();

    act(() => result.current.studio.setPrompt("  Add a boss  "));
    await act(async () => {
      await result.current.studio.send();
    });
    expect(repo.generate).toHaveBeenCalledWith(
      "prj_1",
      "Add a boss",
      expect.any(String),
    );
    expect(result.current.studio.prompt).toBe("");
    expect(result.current.studio.active?.id).toBe("gen_2");
    expect(result.current.studio.promptDisabled).toBe(true);
    expect(result.current.studio.generations).toHaveLength(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLL_MS);
    });
    expect(result.current.studio.active?.status).toBe("generating");

    const before = repo.versions.mock.calls.length;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLL_MS);
    });
    await waitFor(() => expect(result.current.studio.active).toBeNull());
    expect(repo.generation).toHaveBeenCalledWith("gen_2");
    expect(repo.versions.mock.calls.length).toBeGreaterThan(before);
    expect(result.current.studio.promptDisabled).toBe(false);

    // Settled: no more polling.
    const polls = repo.generation.mock.calls.length;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLL_MS * 2);
    });
    expect(repo.generation.mock.calls.length).toBe(polls);
  });

  it("does not send an empty prompt, or anything while one is building", async () => {
    repo.generations.mockResolvedValue([
      generation({ status: "generating", message: null, version_id: null }),
    ]);
    const { result } = await loaded();
    await waitFor(() => expect(result.current.studio.active).not.toBeNull());
    act(() => result.current.studio.setPrompt("More"));
    await act(async () => {
      await result.current.studio.send();
    });
    expect(repo.generate).not.toHaveBeenCalled();
  });

  it("locks the prompt when today's generations are used up", async () => {
    account.get.mockResolvedValue(me(20));
    const { result } = await loaded();
    await waitFor(() => expect(result.current.studio.quotaOut).toBe(true));
    expect(result.current.studio.promptDisabled).toBe(true);
    act(() => result.current.studio.setPrompt("More"));
    await act(async () => {
      await result.current.studio.send();
    });
    expect(repo.generate).not.toHaveBeenCalled();
  });

  it("keeps the prompt and shows why a send was rejected", async () => {
    repo.generate.mockRejectedValueOnce(
      new ApiError(409, {
        code: "generation_in_flight",
        message: "This game is already being changed. Wait for it to finish.",
      }),
    );
    const { result } = await loaded();
    act(() => result.current.studio.setPrompt("More"));
    await act(async () => {
      await result.current.studio.send();
    });
    expect(result.current.studio.prompt).toBe("More");
    expect(result.current.studio.sendError).toBe(
      "This game is already being changed. Wait for it to finish.",
    );

    repo.generate.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await result.current.studio.send();
    });
    expect(result.current.studio.sendError).toBe(
      "We could not send that. Try again.",
    );
  });

  it("retries the last prompt only when it failed", async () => {
    const { result } = await loaded();
    await act(async () => {
      await result.current.studio.retry();
    });
    expect(repo.generate).not.toHaveBeenCalled();

    repo.generations.mockResolvedValue([
      generation(),
      generation({
        id: "gen_2",
        prompt: "Add a boss",
        status: "failed",
        message: null,
        version_id: null,
      }),
    ]);
    repo.generate.mockResolvedValue(
      generation({ id: "gen_3", prompt: "Add a boss", status: "queued" }),
    );
    await act(async () => {
      await result.current.studio.reload();
    });
    await act(async () => {
      await result.current.studio.retry();
    });
    expect(repo.generate).toHaveBeenCalledWith(
      "prj_1",
      "Add a boss",
      expect.any(String),
    );
  });

  it("previews an older version and restores it as a new one", async () => {
    repo.restore.mockResolvedValue({
      ...VERSIONS[1],
      id: "ver_3",
      number: 3,
      source: "restored",
      summary: "Restored version 1",
    });
    const { result } = await loaded();

    // The head cannot be restored.
    await act(async () => {
      await result.current.studio.restore();
    });
    expect(repo.restore).not.toHaveBeenCalled();

    act(() => result.current.studio.selectVersion("ver_1"));
    expect(result.current.studio.viewing?.id).toBe("ver_1");
    expect(result.current.studio.viewingHead).toBe(false);

    await act(async () => {
      await result.current.studio.restore();
    });
    expect(repo.restore).toHaveBeenCalledWith("ver_1");
    expect(result.current.toast.toasts.at(-1)?.message).toBe(
      "Restored version 1. It is now version 3.",
    );
    expect(result.current.studio.viewingHead).toBe(true);
  });

  it("toasts when a restore fails", async () => {
    repo.restore.mockRejectedValue(new Error("offline"));
    const { result } = await loaded();
    act(() => result.current.studio.selectVersion("ver_1"));
    await act(async () => {
      await result.current.studio.restore();
    });
    expect(result.current.toast.toasts.at(-1)).toMatchObject({
      type: "error",
      message: "We could not restore that version. Try again.",
    });
    expect(result.current.studio.restoring).toBe(false);
  });

  it("switches the console style", async () => {
    repo.setStyle.mockResolvedValue({ ...PROJECT, style_id: "arcade" });
    const { result } = await loaded();
    await act(async () => {
      await result.current.studio.setStyle("arcade");
    });
    expect(repo.setStyle).toHaveBeenCalledWith("prj_1", "arcade");
    expect(result.current.studio.project?.style_id).toBe("arcade");

    repo.setStyle.mockRejectedValue(new Error("offline"));
    await act(async () => {
      await result.current.studio.setStyle("modern");
    });
    expect(result.current.studio.project?.style_id).toBe("arcade");
    expect(result.current.toast.toasts.at(-1)?.type).toBe("error");
  });

  it("publishes: the dialog closes and the game is in review", async () => {
    repo.publish.mockResolvedValue({ ...PROJECT, status: "in_review" });
    const { result } = await loaded();
    act(() => result.current.studio.openPublish());
    expect(result.current.studio.publishOpen).toBe(true);
    await act(async () => {
      await result.current.studio.publish();
    });
    expect(repo.publish).toHaveBeenCalledWith("prj_1", expect.any(String));
    expect(result.current.studio.publishOpen).toBe(false);
    expect(result.current.studio.project?.status).toBe("in_review");
  });

  it("keeps the publish dialog open with the reason when it fails", async () => {
    repo.publish.mockRejectedValue(
      new ApiError(409, {
        code: "already_published",
        message: "This game is already published or in review.",
      }),
    );
    const { result } = await loaded();
    act(() => result.current.studio.openPublish());
    await act(async () => {
      await result.current.studio.publish();
    });
    expect(result.current.studio.publishOpen).toBe(true);
    expect(result.current.studio.publishError).toBe(
      "This game is already published or in review.",
    );
    act(() => result.current.studio.closePublish());
    expect(result.current.studio.publishOpen).toBe(false);
  });
});
