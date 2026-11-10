import {
  isResponse,
  jsonError,
  jsonOk,
  notFound,
  requireUser,
  type RouteContext,
} from "@/mocks/http";

type Context = RouteContext<{ id: string }>;

/**
 * DELETE /projects/{id}/publish: takes a published game out of the Arcade,
 * or withdraws one that is in review. The project and its versions stay.
 */
export async function DELETE(req: Request, { params }: Context) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;
  const project = auth.state.projects.find((item) => item.id === id);
  if (!project) return notFound("project");
  if (project.status !== "published" && project.status !== "in_review") {
    return jsonError(409, "not_published", "This game is not published.");
  }
  project.status = "draft";
  project.slug = null;
  project.updated_at = new Date().toISOString();
  return jsonOk(project);
}
