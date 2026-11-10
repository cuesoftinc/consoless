import {
  isResponse,
  jsonError,
  jsonOk,
  notFound,
  optionalUser,
  readJson,
  requireUser,
  type RouteContext,
} from "@/mocks/http";
import type { StoredScore } from "@/mocks/seed";
import { getDb } from "@/mocks/store";
import type { Score } from "@/models/types";

type Context = RouteContext<{ slug: string }>;

const TOP = 10;
/** Stage 1 guard (S-18): the mock accepts scores up to this value. */
const MAX_SCORE = 9_999_999;

function ranked(rows: StoredScore[], username: string | null): Score[] {
  return [...rows]
    .sort((a, b) => b.value - a.value)
    .map((row, index) => ({
      rank: index + 1,
      player: row.player,
      value: row.value,
      submitted_at: row.submitted_at,
      you: row.player.username === username,
    }));
}

/**
 * GET /arcade/games/{slug}/scores: the top ten, plus the caller's own row
 * when they are signed in and outside the top ten. Public.
 */
export async function GET(req: Request, { params }: Context) {
  const { slug } = await params;
  const db = getDb();
  if (!db.arcade.games.some((game) => game.slug === slug)) {
    return notFound("game");
  }
  const caller = optionalUser(req);
  const all = ranked(
    db.arcade.scores[slug] ?? [],
    caller?.state.me.username ?? null,
  );
  const top = all.slice(0, TOP);
  const mine = all.find((row) => row.you);
  if (mine && mine.rank > TOP) top.push(mine);
  return jsonOk({ items: top });
}

/**
 * POST /arcade/games/{slug}/scores: submit a score. Signed-in players only
 * (anonymous players can play but not submit). Keeps each player's best.
 */
export async function POST(req: Request, { params }: Context) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { slug } = await params;
  const db = getDb();
  if (!db.arcade.games.some((game) => game.slug === slug)) {
    return notFound("game");
  }
  const body = await readJson<{ value?: unknown }>(req);
  const value = body?.value;
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > MAX_SCORE
  ) {
    return jsonError(422, "validation_failed", "That score is not valid.", {
      field: "value",
    });
  }

  const { username, display_name } = auth.state.me;
  const rows = (db.arcade.scores[slug] ??= []);
  const existing = rows.find((row) => row.player.username === username);
  if (!existing) {
    rows.push({
      player: { username, display_name },
      value,
      submitted_at: new Date().toISOString(),
    });
  } else if (value > existing.value) {
    existing.value = value;
    existing.submitted_at = new Date().toISOString();
  }
  const mine = ranked(rows, username).find((row) => row.you);
  return jsonOk(mine, 201);
}
