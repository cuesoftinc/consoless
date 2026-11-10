import { isResponse, jsonError, jsonOk, type RouteContext } from "@/mocks/http";
import { publicVersion, restoreVersion } from "@/mocks/studio";
import { findInProjects } from "@/mocks/studio-routes";

/**
 * POST /versions/{id}/restore: makes a new version that copies an older
 * one. Nothing is lost: the versions in between stay in the list.
 */
export async function POST(
  req: Request,
  { params }: RouteContext<{ id: string }>,
) {
  const { id } = await params;
  const scope = findInProjects(req, "version", (studio) =>
    studio.versions.find((version) => version.id === id),
  );
  if (isResponse(scope)) return scope;
  const { project, studio, found, now } = scope;
  if (project.head_version_id === found.id) {
    return jsonError(
      409,
      "already_current",
      "The game is already on this version.",
    );
  }
  if (studio.generations.some((generation) => !generation.settled)) {
    return jsonError(
      409,
      "generation_in_flight",
      "This game is being changed. Wait for it to finish.",
    );
  }
  return jsonOk(
    publicVersion(restoreVersion(project, studio, found, now)),
    201,
  );
}
