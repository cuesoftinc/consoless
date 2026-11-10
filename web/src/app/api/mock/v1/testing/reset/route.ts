import { jsonOk } from "@/mocks/http";
import { resetDb } from "@/mocks/store";

/**
 * POST /api/mock/v1/testing/reset: re-seeds the mock store. The `testing/`
 * segment keeps it visibly outside the API contract; it does not exist in
 * the real API. Playwright calls it at the start of a journey so runs stay
 * independent on a long-lived server.
 */
export async function POST() {
  resetDb();
  return jsonOk({ reset: true });
}
