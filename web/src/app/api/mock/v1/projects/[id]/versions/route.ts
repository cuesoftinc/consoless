import { isResponse, jsonOk, type RouteContext } from "@/mocks/http";
import { publicVersion } from "@/mocks/studio";
import { projectScope } from "@/mocks/studio-routes";

/** GET /projects/{id}/versions: every version, newest first. */
export async function GET(
  req: Request,
  { params }: RouteContext<{ id: string }>,
) {
  const { id } = await params;
  const scope = projectScope(req, id);
  if (isResponse(scope)) return scope;
  return jsonOk({
    items: [...scope.studio.versions].reverse().map(publicVersion),
  });
}
