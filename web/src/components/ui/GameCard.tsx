/**
 * GameCard: a published game or a project, as a link to it. The thumbnail
 * is any screen content, usually a GameScreen. MI-12: on hover the border
 * strengthens and the card lifts onto shadow-md over duration-fast.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import Badge from "./Badge";

export interface GameCardProps {
  title: string;
  /** For example "by Ada Okafor" or "Edited 2 minutes ago". */
  byline: string;
  /** For example "128 plays" or "Not published". */
  meta: string;
  /** For example "Handheld", "Published" or "Draft". */
  badge: string;
  href: string;
  /** Thumbnail content, usually a GameScreen. */
  screen: ReactNode;
  className?: string;
}

export default function GameCard({
  title,
  byline,
  meta,
  badge,
  href,
  screen,
  className,
}: GameCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block w-full max-w-74 overflow-hidden rounded-lg border border-border-default bg-bg-raised",
        "hover:border-border-strong hover:shadow-md",
        "transition-[border-color,box-shadow] duration-fast ease-enter motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        className,
      )}
    >
      <div
        data-testid="game-card-thumbnail"
        className="aspect-[296/176] w-full overflow-hidden bg-bg-inset"
      >
        {screen}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="truncate text-heading-sm text-text-primary">
          {title}
        </span>
        <span className="text-caption text-text-secondary">{byline}</span>
        <div className="flex items-center justify-between">
          <Badge kind="neutral">{badge}</Badge>
          <span
            data-testid="game-card-meta"
            className="inline-flex items-center gap-1 text-caption text-text-muted"
          >
            <Play aria-hidden className="h-3.5 w-3.5" />
            {meta}
          </span>
        </div>
      </div>
    </Link>
  );
}
