/**
 * GameCardSkeleton: the loading frame of a GameCard. Same outer box, a
 * skeleton block for the thumbnail and two skeleton lines for the text.
 * It is decorative: the screen that shows it announces the loading state.
 */

import { cn } from "@/lib/cn";
import Skeleton from "./Skeleton";

export interface GameCardSkeletonProps {
  className?: string;
}

export default function GameCardSkeleton({ className }: GameCardSkeletonProps) {
  return (
    <div
      aria-hidden
      data-testid="game-card-skeleton"
      className={cn(
        "block w-full max-w-74 overflow-hidden rounded-lg border border-border-default bg-bg-raised",
        className,
      )}
    >
      {/* The inline size backs up the utilities: cn does not resolve the
          clash with the block kind's own h-34 w-60 rounded-md. */}
      <Skeleton
        kind="block"
        className="aspect-[296/176] h-auto w-full rounded-none"
        style={{ width: "100%", height: "auto", borderRadius: 0 }}
      />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton
          className="w-44"
          style={{ width: "calc(var(--spacing) * 44)" }}
        />
        <Skeleton
          className="w-28"
          style={{ width: "calc(var(--spacing) * 28)" }}
        />
      </div>
    </div>
  );
}
