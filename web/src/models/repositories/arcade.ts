import type {
  ArcadeGame,
  ConsoleStyleId,
  Page,
  Project,
  ReportReason,
  Score,
} from "../types";
import { http } from "./client";

export interface ListGamesOptions {
  q?: string;
  style?: ConsoleStyleId | null;
  cursor?: string | null;
  /** TEST_MODE only: makes the mock answer 500. */
  fail?: boolean;
}

/** The public Arcade. Reads need no account. */
export const arcadeRepo = {
  list(options: ListGamesOptions = {}): Promise<Page<ArcadeGame>> {
    const query: Record<string, string> = {};
    if (options.q) query.q = options.q;
    if (options.style) query.style = options.style;
    if (options.cursor) query.cursor = options.cursor;
    if (options.fail) query.fail = "1";
    return http.get<Page<ArcadeGame>>("/arcade/games", { query });
  },
  get(slug: string): Promise<ArcadeGame> {
    return http.get<ArcadeGame>(`/arcade/games/${slug}`);
  },
  async scores(slug: string): Promise<Score[]> {
    const { items } = await http.get<{ items: Score[] }>(
      `/arcade/games/${slug}/scores`,
    );
    return items;
  },
  report(slug: string, reason: ReportReason, details: string): Promise<void> {
    return http.post(`/arcade/games/${slug}/reports`, { reason, details });
  },
  /** Copies the game into a new project owned by the caller. */
  remix(slug: string, idempotencyKey: string): Promise<Project> {
    return http.post<Project>(`/arcade/games/${slug}/remix`, undefined, {
      idempotencyKey,
    });
  },
};
