/** Wire shapes of the Consoless API (`/api/v1`). Field names are snake_case. */

/** The five Stage 1 console styles (CON-003). */
export type ConsoleStyleId =
  "handheld" | "8bit" | "16bit" | "arcade" | "modern";

/** The daily allowance of generations and refinements (S-21). */
export interface Quota {
  limit: number;
  used: number;
  /** ISO time the count resets. */
  resets_at: string;
}

/** The signed-in user (`GET /me`). */
export interface Me {
  id: string;
  email: string;
  display_name: string;
  /** Unique handle. Destructive confirmations ask the user to type it (P-13). */
  username: string;
  /** ISO time of the one-time 16-or-older attestation; null until given (S-15). */
  creator_attested_at: string | null;
  created_at: string;
  quota: Quota;
}

/**
 * Where a project stands. `draft` has never been published; the other three
 * follow its publication (system design 5.2).
 */
export type ProjectStatus = "draft" | "in_review" | "published" | "rejected";

/** Which sample artwork stands in for a project's screen until play exists. */
export type ProjectArtwork = "blocks" | "platformer" | "shooter" | "kart";

export interface Project {
  id: string;
  title: string;
  style_id: ConsoleStyleId;
  /** The prompt that made the first version. */
  prompt: string;
  status: ProjectStatus;
  /** The public Arcade slug while published; null otherwise. */
  slug: string | null;
  version_count: number;
  artwork: ProjectArtwork;
  created_at: string;
  updated_at: string;
}

/** Cursor pagination envelope. */
export interface Page<T> {
  items: T[];
  next_cursor: string | null;
}

/** A public name: the author of a game or a player on a leaderboard. */
export interface PublicUser {
  username: string;
  display_name: string;
}

/** The game a remix was made from. */
export interface RemixSource {
  slug: string;
  title: string;
  author: PublicUser;
}

/** A published game in the Arcade (`GET /arcade/games`). */
export interface ArcadeGame {
  /** Same as the slug; cursors use it. */
  id: string;
  slug: string;
  title: string;
  author: PublicUser;
  style_id: ConsoleStyleId;
  /** The prompt that made the game. */
  prompt: string;
  artwork: ProjectArtwork;
  plays: number;
  published_at: string;
  remixed_from: RemixSource | null;
}

/** One leaderboard row: a player's best score in a game (CON-008). */
export interface Score {
  rank: number;
  player: PublicUser;
  value: number;
  submitted_at: string;
  /** True on the signed-in player's own row. */
  you: boolean;
}

export type ReportReason = "copied" | "inappropriate" | "broken" | "other";
