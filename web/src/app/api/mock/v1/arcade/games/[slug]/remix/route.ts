import {
  isResponse,
  jsonError,
  jsonOk,
  notFound,
  requireUser,
  type RouteContext,
} from "@/mocks/http";
import { getDb, nextId } from "@/mocks/store";
import type { Project } from "@/models/types";

/**
 * POST /arcade/games/{slug}/remix: copies a published game into a new
 * project owned by the caller. Creating needs the 16-or-older attestation
 * (S-15).
 */
export async function POST(
  req: Request,
  { params }: RouteContext<{ slug: string }>,
) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { slug } = await params;
  const game = getDb().arcade.games.find((item) => item.slug === slug);
  if (!game) return notFound("game");
  if (!auth.state.me.creator_attested_at) {
    return jsonError(
      403,
      "attestation_required",
      "Confirm you are 16 or older before making games.",
    );
  }

  const now = new Date().toISOString();
  const project: Project = {
    id: nextId("prj"),
    title: `${game.title} remix`,
    style_id: game.style_id,
    prompt: game.prompt,
    status: "draft",
    slug: null,
    version_count: 1,
    artwork: game.artwork,
    created_at: now,
    updated_at: now,
  };
  auth.state.projects.push(project);
  return jsonOk(project, 201);
}
