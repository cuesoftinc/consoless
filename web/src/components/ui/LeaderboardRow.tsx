/**
 * LeaderboardRow: one row of a leaderboard, rendered as a list item. The
 * top three ranks take the gold, silver and bronze rank colours. The
 * signed-in player's row is tinted and reads "You". Colour is never the
 * only signal: the rank number is always shown.
 */

import { cn } from "@/lib/cn";
import Avatar from "./Avatar";

export type LeaderboardRowKind = "first" | "second" | "third" | "other" | "you";

export interface LeaderboardRowProps {
  rank: number;
  name: string;
  /** Numbers are formatted with thousands separators. */
  score: number | string;
  /** Marks the signed-in player's own row. */
  you?: boolean;
  className?: string;
}

const RANK_CLASSES: Record<LeaderboardRowKind, string> = {
  first: "text-rank-gold",
  second: "text-rank-silver",
  third: "text-rank-bronze",
  other: "text-text-muted",
  you: "text-accent-text",
};

function kindOf(rank: number, you: boolean): LeaderboardRowKind {
  if (you) return "you";
  if (rank === 1) return "first";
  if (rank === 2) return "second";
  if (rank === 3) return "third";
  return "other";
}

export default function LeaderboardRow({
  rank,
  name,
  score,
  you = false,
  className,
}: LeaderboardRowProps) {
  const kind = kindOf(rank, you);
  return (
    <li
      data-kind={kind}
      className={cn(
        "flex items-center gap-4 border-b border-border-default px-4 py-3",
        you && "bg-accent-subtle",
        className,
      )}
    >
      <span
        data-testid="leaderboard-rank"
        className={cn("w-8 text-label-md tabular-nums", RANK_CLASSES[kind])}
      >
        <span className="sr-only">Rank </span>
        {rank}
      </span>
      <Avatar name={name} size="sm" />
      <span className="flex-1 truncate text-body-md text-text-primary">
        {you ? "You" : name}
      </span>
      <span
        data-testid="leaderboard-score"
        className="text-label-md text-text-primary tabular-nums"
      >
        {typeof score === "number" ? score.toLocaleString("en-US") : score}
      </span>
    </li>
  );
}
