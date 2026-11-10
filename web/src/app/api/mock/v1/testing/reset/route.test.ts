// @vitest-environment node

import { describe, expect, it } from "vitest";
import { getDb } from "@/mocks/store";
import { POST } from "./route";

describe("POST /api/mock/v1/testing/reset", () => {
  it("re-seeds the mock store", async () => {
    const before = getDb();
    before.leaderboard.length = 0;

    const res = await POST();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reset: true });
    expect(getDb()).not.toBe(before);
    expect(getDb().leaderboard.length).toBeGreaterThan(0);
  });
});
