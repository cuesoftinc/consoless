import { jsonError, jsonOk, paginate } from "@/mocks/http";
import { getDb } from "@/mocks/store";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 48;

/**
 * GET /arcade/games: published games, most played first. Public: no token
 * is needed. `q` matches the title, the author and the prompt; `style`
 * filters by console style.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  // TEST_MODE only: `?fail=1` answers 500 so the error state can be driven.
  if (url.searchParams.get("fail") === "1") {
    return jsonError(500, "internal", "Something went wrong on our side.");
  }
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const style = url.searchParams.get("style");
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit")) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  const games = getDb()
    .arcade.games.filter((game) => !style || game.style_id === style)
    .filter(
      (game) =>
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.author.display_name.toLowerCase().includes(q) ||
        game.prompt.toLowerCase().includes(q),
    )
    .sort((a, b) => b.plays - a.plays);

  const page = paginate(games, url.searchParams.get("cursor"), limit);
  if (!page) {
    return jsonError(422, "invalid_cursor", "That page no longer exists.");
  }
  return jsonOk(page);
}
