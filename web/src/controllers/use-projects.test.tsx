import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { ApiError, type Project } from "@/models";
import { projectsRepo } from "@/models/repositories";
import { ToastProvider, useToast } from "./toast";
import { useProjectsController } from "./use-projects";

vi.mock("@/models/repositories", () => ({
  projectsRepo: {
    list: vi.fn(),
    rename: vi.fn(),
    unpublish: vi.fn(),
    remove: vi.fn(),
  },
}));

const repo = vi.mocked(projectsRepo);

const PROJECT: Project = {
  id: "prj_1",
  title: "Neon Stack",
  style_id: "handheld",
  prompt: "A falling-block puzzle",
  status: "published",
  slug: "neon-stack",
  version_count: 2,
  head_version_id: null,
  artwork: "blocks",
  created_at: "2026-11-01T00:00:00.000Z",
  updated_at: "2026-11-02T00:00:00.000Z",
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

function setup(options?: { fail?: boolean }) {
  return renderHook(
    () => ({ games: useProjectsController(options), toast: useToast() }),
    { wrapper },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  repo.list.mockResolvedValue({ items: [PROJECT], next_cursor: null });
});

describe("useProjectsController", () => {
  it("loads the projects", async () => {
    const { result } = setup();
    expect(result.current.games.loading).toBe(true);
    await waitFor(() => expect(result.current.games.loading).toBe(false));
    expect(result.current.games.projects).toEqual([PROJECT]);
    expect(result.current.games.failed).toBe(false);
    expect(repo.list).toHaveBeenCalledWith({ fail: false });
  });

  it("reports a failed load", async () => {
    repo.list.mockRejectedValue(new Error("offline"));
    const { result } = setup({ fail: true });
    await waitFor(() => expect(result.current.games.failed).toBe(true));
    expect(result.current.games.projects).toEqual([]);
    expect(repo.list).toHaveBeenCalledWith({ fail: true });
  });

  it("renames, closes the dialog, toasts and reloads", async () => {
    repo.rename.mockResolvedValue({ ...PROJECT, title: "Comet" });
    const { result } = setup();
    await waitFor(() => expect(result.current.games.loading).toBe(false));

    act(() => result.current.games.openDialog("rename", PROJECT));
    expect(result.current.games.dialog).toEqual({
      kind: "rename",
      project: PROJECT,
    });
    await act(async () => {
      await result.current.games.rename("Comet");
    });

    expect(repo.rename).toHaveBeenCalledWith("prj_1", "Comet");
    expect(result.current.games.dialog).toBeNull();
    expect(result.current.toast.toasts.at(-1)?.message).toBe("Game renamed.");
    expect(repo.list).toHaveBeenCalledTimes(2);
  });

  it("keeps the dialog open and shows the API message on a 4xx", async () => {
    repo.rename.mockRejectedValue(
      new ApiError(422, {
        code: "validation_failed",
        message: "A title is between 1 and 60 characters.",
      }),
    );
    const { result } = setup();
    await waitFor(() => expect(result.current.games.loading).toBe(false));
    act(() => result.current.games.openDialog("rename", PROJECT));
    await act(async () => {
      await result.current.games.rename("");
    });
    expect(result.current.games.dialog?.kind).toBe("rename");
    expect(result.current.games.actionError).toBe(
      "A title is between 1 and 60 characters.",
    );
    expect(result.current.games.saving).toBe(false);
  });

  it("uses plain fallback copy when the server fails", async () => {
    repo.remove.mockRejectedValue(
      new ApiError(500, { code: "internal", message: "stack trace" }),
    );
    const { result } = setup();
    await waitFor(() => expect(result.current.games.loading).toBe(false));
    act(() => result.current.games.openDialog("delete", PROJECT));
    await act(async () => {
      await result.current.games.remove();
    });
    expect(result.current.games.actionError).toBe(
      "We could not delete the game. Try again.",
    );
  });

  it("unpublishes and deletes the open project", async () => {
    repo.unpublish.mockResolvedValue({ ...PROJECT, status: "draft" });
    repo.remove.mockResolvedValue(undefined);
    const { result } = setup();
    await waitFor(() => expect(result.current.games.loading).toBe(false));

    act(() => result.current.games.openDialog("unpublish", PROJECT));
    await act(async () => {
      await result.current.games.unpublish();
    });
    expect(repo.unpublish).toHaveBeenCalledWith("prj_1");

    act(() => result.current.games.openDialog("delete", PROJECT));
    await act(async () => {
      await result.current.games.remove();
    });
    expect(repo.remove).toHaveBeenCalledWith("prj_1");
    expect(result.current.toast.toasts.at(-1)?.message).toBe("Game deleted.");
  });

  it("does nothing when no dialog is open, and clears errors on close", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.games.loading).toBe(false));
    await act(async () => {
      await result.current.games.rename("x");
      await result.current.games.unpublish();
      await result.current.games.remove();
    });
    expect(repo.rename).not.toHaveBeenCalled();
    expect(repo.unpublish).not.toHaveBeenCalled();
    expect(repo.remove).not.toHaveBeenCalled();

    act(() => result.current.games.openDialog("delete", PROJECT));
    act(() => result.current.games.closeDialog());
    expect(result.current.games.dialog).toBeNull();
    expect(result.current.games.actionError).toBeNull();
  });
});
