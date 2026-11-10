// @vitest-environment node

import { describe, expect, it } from "vitest";
import { getDb, userState } from "@/mocks/store";
import { POST } from "./route";

const request = (body?: unknown) =>
  new Request("http://mock.local/api/mock/v1/testing/reset", {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

describe("POST /api/mock/v1/testing/reset", () => {
  it("re-seeds the mock store", async () => {
    const before = getDb();
    userState("usr_playerone").projects.length = 0;

    const res = await POST(request());

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reset: true });
    expect(getDb()).not.toBe(before);
    expect(userState("usr_playerone").projects.length).toBeGreaterThan(0);
  });

  it("re-seeds one user and leaves the others alone", async () => {
    const db = getDb();
    const target = userState("usr_a");
    const other = userState("usr_b");
    target.projects.length = 0;
    other.projects.length = 0;

    const res = await POST(request({ user_id: "usr_a" }));

    expect(await res.json()).toEqual({ reset: true, user_id: "usr_a" });
    expect(getDb()).toBe(db);
    expect(userState("usr_a").projects.length).toBeGreaterThan(0);
    expect(userState("usr_b").projects).toHaveLength(0);
  });
});
