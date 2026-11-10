"use client";

/**
 * The My Games dialogs: rename, unpublish and delete. Deleting asks the
 * user to type their username (P-13). Each dialog keeps only its own field
 * text; the controller owns the action and its state.
 */

import { useState, type FormEvent } from "react";
import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import type { Project } from "@/models";

interface DialogBaseProps {
  project: Project;
  saving: boolean;
  error: string | null;
  onClose: () => void;
}

export interface RenameDialogProps extends DialogBaseProps {
  onRename: (title: string) => void;
}

export function RenameDialog({
  project,
  saving,
  error,
  onClose,
  onRename,
}: RenameDialogProps) {
  const [title, setTitle] = useState(project.title);
  const trimmed = title.trim();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (trimmed && !saving) onRename(trimmed);
  };
  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title="Rename game"
      size="sm"
      footer={
        <>
          <Button kind="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="rename-game"
            loading={saving}
            disabled={!trimmed || trimmed === project.title}
          >
            Save
          </Button>
        </>
      }
    >
      <form id="rename-game" onSubmit={submit}>
        <Input
          label="Title"
          value={title}
          maxLength={60}
          onChange={(event) => setTitle(event.target.value)}
          error={error ?? undefined}
          autoFocus
        />
      </form>
    </Modal>
  );
}

export interface UnpublishDialogProps extends DialogBaseProps {
  onUnpublish: () => void;
}

export function UnpublishDialog({
  project,
  saving,
  error,
  onClose,
  onUnpublish,
}: UnpublishDialogProps) {
  const live = project.status === "published";
  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={live ? "Unpublish this game?" : "Withdraw this game from review?"}
      description={
        live
          ? `${project.title} leaves the Arcade and its public link stops working. The game and its versions stay in My Games, and you can publish it again.`
          : `${project.title} leaves the review queue. The game and its versions stay in My Games, and you can publish it again.`
      }
      size="sm"
      footer={
        <>
          <Button kind="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button kind="danger" onClick={onUnpublish} loading={saving}>
            {live ? "Unpublish" : "Withdraw"}
          </Button>
        </>
      }
    >
      {error ? <Banner kind="danger">{error}</Banner> : null}
    </Modal>
  );
}

export interface DeleteDialogProps extends DialogBaseProps {
  /** The text the user must type to confirm (P-13). */
  username: string;
  onDelete: () => void;
}

export function DeleteDialog({
  project,
  username,
  saving,
  error,
  onClose,
  onDelete,
}: DeleteDialogProps) {
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === username;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (matches && !saving) onDelete();
  };
  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title="Delete this game?"
      description={`${project.title} and all of its versions are deleted. If it is published, it leaves the Arcade. This cannot be undone.`}
      kind="destructive"
      size="sm"
      footer={
        <>
          <Button kind="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            kind="danger"
            type="submit"
            form="delete-game"
            loading={saving}
            disabled={!matches}
          >
            Delete game
          </Button>
        </>
      }
    >
      <form id="delete-game" onSubmit={submit} className="flex flex-col gap-3">
        <Input
          label={`Type ${username} to confirm`}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          autoFocus
        />
        {error ? <Banner kind="danger">{error}</Banner> : null}
      </form>
    </Modal>
  );
}
