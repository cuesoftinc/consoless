import { isResponse, jsonOk, type RouteContext } from "@/mocks/http";
import { findInProjects } from "@/mocks/studio-routes";

/** GET /versions/{id}: one version with its files. */
export async function GET(
  req: Request,
  { params }: RouteContext<{ id: string }>,
) {
  const { id } = await params;
  const scope = findInProjects(req, "version", (studio) =>
    studio.versions.find((version) => version.id === id),
  );
  if (isResponse(scope)) return scope;
  return jsonOk(scope.found);
}
