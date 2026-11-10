import {
  isResponse,
  jsonError,
  jsonOk,
  notFound,
  readJson,
  requireUser,
  type RouteContext,
} from "@/mocks/http";

type Context = RouteContext<{ id: string }>;

/** GET /projects/{id}. Another user's project is 404, never 403. */
export async function GET(req: Request, { params }: Context) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;
  const project = auth.state.projects.find((item) => item.id === id);
  return project ? jsonOk(project) : notFound("project");
}

/** PATCH /projects/{id}: rename. */
export async function PATCH(req: Request, { params }: Context) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;
  const project = auth.state.projects.find((item) => item.id === id);
  if (!project) return notFound("project");

  const body = await readJson<{ title?: unknown }>(req);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (title.length < 1 || title.length > 60) {
    return jsonError(
      422,
      "validation_failed",
      "A title is between 1 and 60 characters.",
      { field: "title" },
    );
  }
  project.title = title;
  project.updated_at = new Date().toISOString();
  return jsonOk(project);
}

/** DELETE /projects/{id}: deletes the project and takes down its game. */
export async function DELETE(req: Request, { params }: Context) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { id } = await params;
  const index = auth.state.projects.findIndex((item) => item.id === id);
  if (index === -1) return notFound("project");
  auth.state.projects.splice(index, 1);
  return new Response(null, { status: 204 });
}
