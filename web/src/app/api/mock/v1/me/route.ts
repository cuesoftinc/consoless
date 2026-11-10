import {
  isResponse,
  jsonError,
  jsonOk,
  readJson,
  requireUser,
} from "@/mocks/http";
import { dropUser } from "@/mocks/store";

/** GET /me: the signed-in user with today's quota. */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  return jsonOk(auth.state.me);
}

/** PATCH /me: change the display name. */
export async function PATCH(req: Request) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const body = await readJson<{ display_name?: unknown }>(req);
  const name =
    typeof body?.display_name === "string" ? body.display_name.trim() : "";
  if (name.length < 1 || name.length > 40) {
    return jsonError(
      422,
      "validation_failed",
      "A display name is between 1 and 40 characters.",
      { field: "display_name" },
    );
  }
  auth.state.me.display_name = name;
  return jsonOk(auth.state.me);
}

/** DELETE /me: deletes every project and then the user (CON-014). */
export async function DELETE(req: Request) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  dropUser(auth.userId);
  return new Response(null, { status: 204 });
}
