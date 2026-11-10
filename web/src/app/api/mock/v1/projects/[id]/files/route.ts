import {
  isResponse,
  jsonError,
  jsonOk,
  readJson,
  type RouteContext,
} from "@/mocks/http";
import { GAME_FILE, publicCheck, startCheck } from "@/mocks/studio";
import { projectScope } from "@/mocks/studio-routes";

const MAX_BYTES = 200_000;

/**
 * PUT /projects/{id}/files: saves a hand edit. The edit is checked first
 * and becomes a version only if it passes (CON-007).
 */
export async function PUT(
  req: Request,
  { params }: RouteContext<{ id: string }>,
) {
  const { id } = await params;
  const scope = projectScope(req, id);
  if (isResponse(scope)) return scope;
  const { project, studio, now } = scope;

  const body = await readJson<{ files?: unknown }>(req);
  const files = Array.isArray(body?.files) ? body.files : [];
  const file = files[0] as { path?: unknown; content?: unknown } | undefined;
  if (
    files.length !== 1 ||
    file?.path !== GAME_FILE ||
    typeof file.content !== "string" ||
    file.content.length > MAX_BYTES
  ) {
    return jsonError(
      422,
      "validation_failed",
      `Send one file, ${GAME_FILE}, of at most ${MAX_BYTES} characters.`,
      { field: "files" },
    );
  }
  if (!project.head_version_id) {
    return jsonError(
      409,
      "no_version",
      "This game has no version to edit yet.",
    );
  }
  if (
    studio.generations.some((generation) => !generation.settled) ||
    studio.checks.some((check) => !check.settled)
  ) {
    return jsonError(
      409,
      "generation_in_flight",
      "This game is being changed. Wait for it to finish.",
    );
  }
  return jsonOk(
    publicCheck(startCheck(project, studio, file.content, now)),
    202,
  );
}
