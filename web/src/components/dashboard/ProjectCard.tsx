"use client";

/**
 * ProjectCard: one of the user's games in My Games. Shows the screen, the
 * title, where the game stands and when it last changed, with a menu for
 * rename, unpublish and delete.
 */

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import Badge, { type BadgeKind } from "@/components/ui/Badge";
import GameScreen from "@/components/ui/GameScreen";
import IconButton from "@/components/ui/IconButton";
import { MenuItem } from "@/components/ui/Menu";
import PopoverMenu from "@/components/ui/PopoverMenu";
import { cn } from "@/lib/cn";
import { paletteOf, STYLE_LABEL } from "@/lib/console-styles";
import { relativeTime } from "@/lib/relative-time";
import type { Project, ProjectStatus } from "@/models";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
  rejected: "Not approved",
};

export const STATUS_KIND: Record<ProjectStatus, BadgeKind> = {
  draft: "neutral",
  in_review: "warning",
  published: "success",
  rejected: "danger",
};

export interface ProjectCardProps {
  project: Project;
  onRename: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  /** Injected in tests so relative dates are stable. */
  now?: number;
  className?: string;
}

export default function ProjectCard({
  project,
  onRename,
  onUnpublish,
  onDelete,
  now,
  className,
}: ProjectCardProps) {
  const canUnpublish =
    project.status === "published" || project.status === "in_review";
  return (
    <article
      aria-label={project.title}
      data-status={project.status}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border border-border-default bg-bg-raised",
        className,
      )}
    >
      <div className="aspect-[296/176] w-full overflow-hidden bg-bg-inset">
        <GameScreen
          game={project.artwork}
          palette={paletteOf(project.style_id)}
          className="h-full w-full"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="min-w-0 truncate text-heading-sm text-text-primary">
            <Link
              href={`/dashboard/studio/${project.id}`}
              className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              {project.title}
            </Link>
          </h2>
          <PopoverMenu
            aria-label={`Actions for ${project.title}`}
            trigger={
              <IconButton
                icon={Ellipsis}
                aria-label={`Actions for ${project.title}`}
                className="-mt-1 -mr-2 shrink-0"
              />
            }
          >
            <MenuItem onSelect={onRename}>Rename</MenuItem>
            {canUnpublish ? (
              <MenuItem onSelect={onUnpublish}>
                {project.status === "published"
                  ? "Unpublish"
                  : "Withdraw from review"}
              </MenuItem>
            ) : null}
            <MenuItem kind="danger" onSelect={onDelete}>
              Delete
            </MenuItem>
          </PopoverMenu>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge kind={STATUS_KIND[project.status]}>
            {STATUS_LABEL[project.status]}
          </Badge>
          <span className="text-caption text-text-secondary">
            {STYLE_LABEL[project.style_id]}
          </span>
        </div>
        <p className="text-caption text-text-muted">
          Updated {relativeTime(project.updated_at, now)}
        </p>
      </div>
    </article>
  );
}
