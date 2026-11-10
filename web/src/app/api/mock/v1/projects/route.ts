import {
  isResponse,
  jsonError,
  jsonOk,
  paginate,
  requireUser,
} from "@/mocks/http";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/** GET /projects: the caller's projects, most recently updated first. */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;

  const url = new URL(req.url);
  // TEST_MODE only: `?fail=1` answers 500 so the error state can be driven.
  if (url.searchParams.get("fail") === "1") {
    return jsonError(500, "internal", "Something went wrong on our side.");
  }
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit")) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const sorted = [...auth.state.projects].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  );
  const page = paginate(sorted, url.searchParams.get("cursor"), limit);
  if (!page) {
    return jsonError(422, "invalid_cursor", "That page no longer exists.");
  }
  return jsonOk(page);
}
