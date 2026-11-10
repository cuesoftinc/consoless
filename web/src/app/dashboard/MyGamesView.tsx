"use client";

/** My Games: every project the user has made, with its actions. */

import { Gamepad2 } from "lucide-react";
import ProjectCard from "@/components/dashboard/ProjectCard";
import {
  DeleteDialog,
  RenameDialog,
  UnpublishDialog,
} from "@/components/dashboard/ProjectDialogs";
import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import { useMe } from "@/controllers/me-context";
import { useProjectsController } from "@/controllers/use-projects";

const GRID =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function MyGamesView({ fail = false }: { fail?: boolean }) {
  const { me } = useMe();
  const games = useProjectsController({ fail });
  const { dialog } = games;

  let body: React.ReactNode;
  if (games.loading && games.projects.length === 0) {
    body = (
      <div
        aria-busy="true"
        aria-label="Loading your games"
        data-testid="my-games-loading"
        className={GRID}
      >
        {[0, 1, 2, 3].map((index) => (
          <GameCardSkeleton key={index} className="max-w-none" />
        ))}
      </div>
    );
  } else if (games.failed) {
    body = (
      <Banner
        kind="danger"
        action={
          <Button
            kind="secondary"
            size="sm"
            onClick={() => void games.reload()}
          >
            Try again
          </Button>
        }
      >
        We could not load your games.
      </Banner>
    );
  } else if (games.projects.length === 0) {
    body = (
      <EmptyState
        icon={Gamepad2}
        title="No games yet"
        body="Games you make in the Studio appear here."
      />
    );
  } else {
    body = (
      <ul className={GRID}>
        {games.projects.map((project) => (
          <li key={project.id} className="flex">
            <ProjectCard
              project={project}
              onRename={() => games.openDialog("rename", project)}
              onUnpublish={() => games.openDialog("unpublish", project)}
              onDelete={() => games.openDialog("delete", project)}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-heading-lg text-text-primary">My Games</h1>
        <p className="text-body-md text-text-secondary">
          Every game you have made, most recently changed first.
        </p>
      </header>

      {body}

      {dialog?.kind === "rename" ? (
        <RenameDialog
          key={dialog.project.id}
          project={dialog.project}
          saving={games.saving}
          error={games.actionError}
          onClose={games.closeDialog}
          onRename={(title) => void games.rename(title)}
        />
      ) : null}
      {dialog?.kind === "unpublish" ? (
        <UnpublishDialog
          project={dialog.project}
          saving={games.saving}
          error={games.actionError}
          onClose={games.closeDialog}
          onUnpublish={() => void games.unpublish()}
        />
      ) : null}
      {dialog?.kind === "delete" && me ? (
        <DeleteDialog
          key={dialog.project.id}
          project={dialog.project}
          username={me.username}
          saving={games.saving}
          error={games.actionError}
          onClose={games.closeDialog}
          onDelete={() => void games.remove()}
        />
      ) : null}
    </div>
  );
}
