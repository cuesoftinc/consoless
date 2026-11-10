import { jsonOk, readJson } from "@/mocks/http";
import { dropUser, resetDb } from "@/mocks/store";

/**
 * POST /api/mock/v1/testing/reset: re-seeds the mock store. The `testing/`
 * segment keeps it visibly outside the API contract; it does not exist in
 * the real API.
 *
 * With `{"user_id": "usr_..."}` only that user's state is re-seeded, so a
 * Playwright journey can start clean on a long-lived server without
 * touching the users other journeys are signed in as. With no body the
 * whole store is re-seeded.
 */
export async function POST(req: Request) {
  const body = await readJson<{ user_id?: unknown }>(req);
  if (typeof body?.user_id === "string") {
    dropUser(body.user_id);
    return jsonOk({ reset: true, user_id: body.user_id });
  }
  resetDb();
  return jsonOk({ reset: true });
}
