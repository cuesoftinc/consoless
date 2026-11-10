import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Project } from "@/models";
import { DeleteDialog, RenameDialog, UnpublishDialog } from "./ProjectDialogs";

const PROJECT: Project = {
  id: "prj_1",
  title: "Neon Stack",
  style_id: "handheld",
  prompt: "A falling-block puzzle",
  status: "published",
  slug: "neon-stack",
  version_count: 2,
  artwork: "blocks",
  created_at: "2026-11-01T00:00:00.000Z",
  updated_at: "2026-11-02T00:00:00.000Z",
};

const base = { project: PROJECT, saving: false, error: null };

describe("RenameDialog", () => {
  it("starts with the current title and saves a trimmed new one", async () => {
    const onRename = vi.fn();
    render(<RenameDialog {...base} onClose={vi.fn()} onRename={onRename} />);
    const field = screen.getByRole("textbox", { name: "Title" });
    expect(field).toHaveValue("Neon Stack");
    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toBeDisabled();

    await userEvent.clear(field);
    expect(save).toBeDisabled();
    await userEvent.type(field, "  Comet Stack {Enter}");
    expect(onRename).toHaveBeenCalledWith("Comet Stack");
  });

  it("shows the action error on the field and cancels", async () => {
    const onClose = vi.fn();
    render(
      <RenameDialog
        {...base}
        error="A title is between 1 and 60 characters."
        onClose={onClose}
        onRename={vi.fn()}
      />,
    );
    expect(
      screen.getByText("A title is between 1 and 60 characters."),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("UnpublishDialog", () => {
  it("says what unpublishing does and confirms", async () => {
    const onUnpublish = vi.fn();
    render(
      <UnpublishDialog {...base} onClose={vi.fn()} onUnpublish={onUnpublish} />,
    );
    const dialog = screen.getByRole("dialog", {
      name: "Unpublish this game?",
    });
    expect(dialog).toHaveTextContent("leaves the Arcade");
    expect(dialog).toHaveTextContent("you can publish it again");
    await userEvent.click(screen.getByRole("button", { name: "Unpublish" }));
    expect(onUnpublish).toHaveBeenCalledTimes(1);
  });

  it("words it as a withdrawal while in review, and shows errors", () => {
    render(
      <UnpublishDialog
        {...base}
        project={{ ...PROJECT, status: "in_review" }}
        error="We could not unpublish the game. Try again."
        onClose={vi.fn()}
        onUnpublish={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("dialog", { name: "Withdraw this game from review?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Withdraw" })).toBeEnabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not unpublish the game. Try again.",
    );
  });
});

describe("DeleteDialog", () => {
  it("only enables Delete once the username is typed (P-13)", async () => {
    const onDelete = vi.fn();
    render(
      <DeleteDialog
        {...base}
        username="playerone"
        onClose={vi.fn()}
        onDelete={onDelete}
      />,
    );
    expect(
      screen.getByRole("dialog", { name: "Delete this game?" }),
    ).toHaveTextContent("This cannot be undone.");
    const confirm = screen.getByRole("button", { name: "Delete game" });
    const field = screen.getByRole("textbox", {
      name: "Type playerone to confirm",
    });
    expect(confirm).toBeDisabled();

    await userEvent.type(field, "player{Enter}");
    expect(confirm).toBeDisabled();
    expect(onDelete).not.toHaveBeenCalled();

    await userEvent.type(field, "one");
    expect(confirm).toBeEnabled();
    await userEvent.click(confirm);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("locks the actions while deleting", () => {
    render(
      <DeleteDialog
        {...base}
        saving
        username="playerone"
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Delete game/ })).toBeDisabled();
  });
});
