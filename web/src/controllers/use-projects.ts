"use client";

/**
 * My Games: the user's projects with rename, unpublish and delete. The
 * controller owns the list, which dialog is open and each action's state;
 * the view only renders.
 */

import { useCallback, useState } from "react";
import { ApiError, type Project } from "@/models";
import { projectsRepo } from "@/models/repositories";
import { useToast } from "./toast";
import { useRequest } from "./use-request";

export type ProjectDialogKind = "rename" | "unpublish" | "delete";

export interface ProjectDialog {
  kind: ProjectDialogKind;
  project: Project;
}

export interface ProjectsController {
  projects: Project[];
  loading: boolean;
  /** True when the list could not be loaded. */
  failed: boolean;
  reload: () => Promise<void>;
  dialog: ProjectDialog | null;
  openDialog: (kind: ProjectDialogKind, project: Project) => void;
  closeDialog: () => void;
  /** True while the open dialog's action is in flight. */
  saving: boolean;
  /** A message for the open dialog when its action failed. */
  actionError: string | null;
  rename: (title: string) => Promise<void>;
  unpublish: () => Promise<void>;
  remove: () => Promise<void>;
}

export interface ProjectsControllerOptions {
  /** TEST_MODE only: ask the mock for a failure. */
  fail?: boolean;
}

function messageOf(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.status < 500
    ? error.message
    : fallback;
}

export function useProjectsController(
  options: ProjectsControllerOptions = {},
): ProjectsController {
  const { addToast } = useToast();
  const fail = options.fail ?? false;
  const request = useRequest(() => projectsRepo.list({ fail }), [fail]);
  const [dialog, setDialog] = useState<ProjectDialog | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const openDialog = useCallback(
    (kind: ProjectDialogKind, project: Project) => {
      setActionError(null);
      setDialog({ kind, project });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialog(null);
    setActionError(null);
  }, []);

  const { reload } = request;
  const run = useCallback(
    async (action: () => Promise<unknown>, done: string, fallback: string) => {
      setSaving(true);
      setActionError(null);
      try {
        await action();
        setDialog(null);
        addToast(done, "success");
        await reload();
      } catch (error) {
        setActionError(messageOf(error, fallback));
      } finally {
        setSaving(false);
      }
    },
    [addToast, reload],
  );

  const project = dialog?.project;

  const rename = useCallback(
    async (title: string) => {
      if (!project) return;
      await run(
        () => projectsRepo.rename(project.id, title),
        "Game renamed.",
        "We could not rename the game. Try again.",
      );
    },
    [project, run],
  );

  const unpublish = useCallback(async () => {
    if (!project) return;
    await run(
      () => projectsRepo.unpublish(project.id),
      "Game unpublished. It is no longer in the Arcade.",
      "We could not unpublish the game. Try again.",
    );
  }, [project, run]);

  const remove = useCallback(async () => {
    if (!project) return;
    await run(
      () => projectsRepo.remove(project.id),
      "Game deleted.",
      "We could not delete the game. Try again.",
    );
  }, [project, run]);

  return {
    projects: request.data?.items ?? [],
    loading: request.loading,
    failed: request.error !== null,
    reload,
    dialog,
    openDialog,
    closeDialog,
    saving,
    actionError,
    rename,
    unpublish,
    remove,
  };
}
