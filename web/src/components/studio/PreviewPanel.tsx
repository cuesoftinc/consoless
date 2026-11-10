/**
 * PreviewPanel: the game in its console frame. Until the engine and the
 * play origin exist the frame shows a picture of the game.
 */

import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import ConsoleFrame from "@/components/ui/ConsoleFrame";
import GameScreen from "@/components/ui/GameScreen";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { frameStyleOf, paletteOf } from "@/lib/console-styles";
import type { Project, Version } from "@/models";

export interface PreviewPanelProps {
  project: Project;
  /** The version on show; null before the first one is ready. */
  viewing: Version | null;
  viewingHead: boolean;
  /** A generation is building: the frame waits for the first version. */
  building: boolean;
  restoring: boolean;
  onRestore: () => void;
  onBackToLatest: () => void;
}

export default function PreviewPanel({
  project,
  viewing,
  viewingHead,
  building,
  restoring,
  onRestore,
  onBackToLatest,
}: PreviewPanelProps) {
  if (!viewing) {
    return (
      <div
        data-testid="preview-empty"
        aria-busy={building}
        className="flex min-h-100 flex-col items-center justify-center gap-4 rounded-xl border border-border-default bg-bg-surface p-6"
      >
        {building ? (
          <>
            <Skeleton kind="block" className="h-60 w-full max-w-80" />
            <p className="text-body-sm text-text-secondary">
              Your game appears here when its first version is ready.
            </p>
          </>
        ) : (
          <p className="text-body-md text-text-secondary">
            There is no version to show yet. Send a prompt to build one.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!viewingHead ? (
        <Banner
          kind="info"
          action={
            <div className="flex gap-2">
              <Button kind="secondary" size="sm" onClick={onBackToLatest}>
                Back to latest
              </Button>
              <Button size="sm" onClick={onRestore} loading={restoring}>
                Restore this version
              </Button>
            </div>
          }
        >
          You are looking at version {viewing.number}. Restoring makes a new
          version that copies it.
        </Banner>
      ) : null}
      <div
        data-testid="preview-frame"
        data-version={viewing.number}
        data-style={project.style_id}
        className="flex min-h-100 items-center justify-center rounded-xl border border-border-default bg-bg-surface p-6"
      >
        <div
          className={cn(
            "flex w-full justify-center",
            project.style_id === "arcade" ? "max-w-80" : "max-w-120",
          )}
        >
          <ConsoleFrame consoleStyle={frameStyleOf(project.style_id)}>
            <GameScreen
              game={project.artwork}
              palette={paletteOf(project.style_id)}
              className="h-full w-full"
            />
          </ConsoleFrame>
        </div>
      </div>
      <p className="text-caption text-text-muted">
        This is a picture of the game. Playing in the preview arrives with the
        game engine.
      </p>
    </div>
  );
}
