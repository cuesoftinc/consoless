import { isResponse, jsonOk, type RouteContext } from "@/mocks/http";
import { publicGeneration } from "@/mocks/studio";
import { findInProjects } from "@/mocks/studio-routes";

/** GET /generations/{id}: the status row the Studio polls (S-11). */
export async function GET(
  req: Request,
  { params }: RouteContext<{ id: string }>,
) {
  const { id } = await params;
  const scope = findInProjects(req, "generation", (studio) =>
    studio.generations.find((generation) => generation.id === id),
  );
  if (isResponse(scope)) return scope;
  return jsonOk(publicGeneration(scope.found));
}
