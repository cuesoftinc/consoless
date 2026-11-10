import {
  isResponse,
  jsonError,
  jsonOk,
  notFound,
  requireUser,
  type RouteContext,
} from "@/mocks/http";
import { syncStudio } from "@/mocks/studio";

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

/**
 * POST /projects/{id}/publish: sends the current version for review
 * (CON-006). The game is live only after the review approves it.
 */
export async function POST(req: Request, { params }: Context) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;
  const project = auth.state.projects.find((item) => item.id === id);
  if (!project) return notFound("project");
  syncStudio(auth.state, project, Date.now());
  if (!project.head_version_id) {
    return jsonError(
      409,
      "no_version",
      "This game has no version that passed its checks yet.",
    );
  }
  if (project.status === "published" || project.status === "in_review") {
    return jsonError(
      409,
      "already_published",
      "This game is already published or in review.",
    );
  }
  project.status = "in_review";
  project.updated_at = new Date().toISOString();
  return jsonOk(project, 202);
}
