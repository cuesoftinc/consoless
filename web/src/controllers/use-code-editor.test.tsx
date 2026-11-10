import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { ApiError, type Check, type VersionDetail } from "@/models";
import { studioRepo } from "@/models/repositories";
import { VERSIONS } from "./studio-fixtures";
import { ToastProvider, useToast } from "./toast";
import { CHECK_POLL_MS, useCodeEditorController } from "./use-code-editor";

vi.mock("@/models/repositories", () => ({
  studioRepo: { version: vi.fn(), saveCode: vi.fn(), check: vi.fn() },
}));

const repo = vi.mocked(studioRepo);
const CODE = "export default {};\n";
const DETAIL: VersionDetail = {
  ...VERSIONS[0],
  files: [{ path: "game.ts", content: CODE }],
};
const CHECKING: Check = {
  id: "chk_1",
  project_id: "prj_1",
  status: "checking",
  error: null,
  version_id: null,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);
const onSaved = vi.fn();

const setup = (versionId: string | null = "ver_2") =>
  renderHook(
    ({ id }) => ({
      editor: useCodeEditorController("prj_1", id, onSaved),
      toast: useToast(),
    }),
    { wrapper, initialProps: { id: versionId } },
  );

async function loaded() {
  const view = setup();
  await waitFor(() => expect(view.result.current.editor.content).toBe(CODE));
  return view;
}

beforeEach(() => {
  vi.clearAllMocks();
  repo.version.mockResolvedValue(DETAIL);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useCodeEditorController", () => {
  it("loads the version's code, clean", async () => {
    const { result } = await loaded();
    expect(repo.version).toHaveBeenCalledWith("ver_2");
    expect(result.current.editor.dirty).toBe(false);
    expect(result.current.editor.checking).toBe(false);
  });

  it("has nothing to load before the first version", async () => {
    const { result } = setup(null);
    await waitFor(() => expect(result.current.editor.loading).toBe(false));
    expect(repo.version).not.toHaveBeenCalled();
    expect(result.current.editor.content).toBe("");
  });

  it("tracks a draft and discards it", async () => {
    const { result } = await loaded();
    act(() => result.current.editor.setContent("const a = 1;\n"));
    expect(result.current.editor.dirty).toBe(true);
    // Typing the original back is not a change.
    act(() => result.current.editor.setContent(CODE));
    expect(result.current.editor.dirty).toBe(false);

    act(() => result.current.editor.setContent("const a = 1;\n"));
    act(() => result.current.editor.discard());
    expect(result.current.editor.content).toBe(CODE);
  });

  it("drops a draft when another version is opened", async () => {
    const { result, rerender } = await loaded();
    act(() => result.current.editor.setContent("const a = 1;\n"));
    repo.version.mockResolvedValue({
      ...DETAIL,
      id: "ver_1",
      files: [{ path: "game.ts", content: "old\n" }],
    });
    rerender({ id: "ver_1" });
    await waitFor(() => expect(result.current.editor.content).toBe("old\n"));
    expect(result.current.editor.dirty).toBe(false);
  });

  it("saves, polls the check and reports a new version when it passes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    repo.saveCode.mockResolvedValue(CHECKING);
    repo.check.mockResolvedValueOnce(CHECKING).mockResolvedValueOnce({
      ...CHECKING,
      status: "passed",
      version_id: "ver_3",
    });
    const { result } = await loaded();
    act(() => result.current.editor.setContent("const a = 1;\n"));
    await act(async () => {
      await result.current.editor.save();
    });
    expect(repo.saveCode).toHaveBeenCalledWith(
      "prj_1",
      "const a = 1;\n",
      expect.any(String),
    );
    expect(result.current.editor.checking).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CHECK_POLL_MS);
    });
    expect(result.current.editor.checking).toBe(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CHECK_POLL_MS);
    });
    await waitFor(() => expect(result.current.editor.checking).toBe(false));
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(result.current.editor.dirty).toBe(false);
    expect(result.current.toast.toasts.at(-1)?.message).toBe(
      "Your edit passed its checks and is a new version.",
    );
  });

  it("keeps the user's text and names the line when the check fails", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    repo.saveCode.mockResolvedValue(CHECKING);
    repo.check.mockResolvedValue({
      ...CHECKING,
      status: "failed",
      error: { path: "game.ts", line: 3, message: "Expected '}'." },
    });
    const { result } = await loaded();
    act(() => result.current.editor.setContent("const a = {\n"));
    await act(async () => {
      await result.current.editor.save();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CHECK_POLL_MS);
    });
    await waitFor(() =>
      expect(result.current.editor.checkError).toEqual({
        path: "game.ts",
        line: 3,
        message: "Expected '}'.",
      }),
    );
    expect(result.current.editor.content).toBe("const a = {\n");
    expect(result.current.editor.dirty).toBe(true);
    expect(onSaved).not.toHaveBeenCalled();
  });

  it("does not save an unchanged file, and explains a rejected save", async () => {
    const { result } = await loaded();
    await act(async () => {
      await result.current.editor.save();
    });
    expect(repo.saveCode).not.toHaveBeenCalled();

    repo.saveCode.mockRejectedValueOnce(
      new ApiError(409, {
        code: "generation_in_flight",
        message: "This game is being changed. Wait for it to finish.",
      }),
    );
    act(() => result.current.editor.setContent("const a = 1;\n"));
    await act(async () => {
      await result.current.editor.save();
    });
    expect(result.current.editor.saveError).toBe(
      "This game is being changed. Wait for it to finish.",
    );

    repo.saveCode.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await result.current.editor.save();
    });
    expect(result.current.editor.saveError).toBe(
      "We could not save your edit. Try again.",
    );
    expect(result.current.editor.checking).toBe(false);
  });

  it("reports a failed load", async () => {
    repo.version.mockRejectedValue(new Error("offline"));
    const { result } = setup();
    await waitFor(() => expect(result.current.editor.failed).toBe(true));
  });
});
