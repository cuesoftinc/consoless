import { jsonOk, notFound, type RouteContext } from "@/mocks/http";
import { getDb } from "@/mocks/store";

/** GET /arcade/games/{slug}: one published game. Public. */
export async function GET(
  _req: Request,
  { params }: RouteContext<{ slug: string }>,
) {
  const { slug } = await params;
  const game = getDb().arcade.games.find((item) => item.slug === slug);
  return game ? jsonOk(game) : notFound("game");
}
