import { isResponse, jsonOk, type RouteContext } from "@/mocks/http";
import { publicCheck } from "@/mocks/studio";
import { findInProjects } from "@/mocks/studio-routes";

/** GET /checks/{id}: the status of a hand edit's check. */
export async function GET(
  req: Request,
  { params }: RouteContext<{ id: string }>,
) {
  const { id } = await params;
  const scope = findInProjects(req, "check", (studio) =>
    studio.checks.find((check) => check.id === id),
  );
  if (isResponse(scope)) return scope;
  return jsonOk(publicCheck(scope.found));
}
