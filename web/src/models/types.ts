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
