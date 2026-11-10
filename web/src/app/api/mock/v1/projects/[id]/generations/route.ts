import {
  isResponse,
  jsonError,
  jsonOk,
  readJson,
  type RouteContext,
} from "@/mocks/http";
import { publicGeneration, startGeneration } from "@/mocks/studio";
import { projectScope } from "@/mocks/studio-routes";

type Context = RouteContext<{ id: string }>;

/** GET /projects/{id}/generations: every prompt and its outcome, oldest first. */
export async function GET(req: Request, { params }: Context) {
  const { id } = await params;
  const scope = projectScope(req, id);
  if (isResponse(scope)) return scope;
  return jsonOk({ items: scope.studio.generations.map(publicGeneration) });
}

/**
 * POST /projects/{id}/generations: asks for a change. One generation per
 * project at a time, and one of today's generations each (S-9, S-21).
 */
export async function POST(req: Request, { params }: Context) {
  const { id } = await params;
  const scope = projectScope(req, id);
  if (isResponse(scope)) return scope;
  const { state, project, studio, now } = scope;

  const body = await readJson<{ prompt?: unknown }>(req);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (prompt.length < 1 || prompt.length > 2000) {
    return jsonError(
      422,
      "validation_failed",
      "A prompt is between 1 and 2,000 characters.",
      { field: "prompt" },
    );
  }
  if (studio.generations.some((generation) => !generation.settled)) {
    return jsonError(
      409,
      "generation_in_flight",
      "This game is already being changed. Wait for it to finish.",
    );
  }
  if (state.me.quota.used >= state.me.quota.limit) {
    return jsonError(
      429,
      "quota_exhausted",
      "You have used today's generations. They reset tomorrow.",
    );
  }
  state.me.quota.used += 1;
  const generation = startGeneration(project, studio, prompt, now);
  return jsonOk(publicGeneration(generation), 202);
}
