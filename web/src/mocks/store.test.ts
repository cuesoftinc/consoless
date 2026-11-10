// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import { paginate } from "./http";
import { getDb, nextId, resetDb } from "./store";

beforeEach(() => {
  resetDb(1_000);
});

describe("mock store", () => {
  it("keeps one seeded database until it is reset", () => {
    const db = getDb();
    expect(db.seededAt).toBe(1_000);
    expect(db.leaderboard.length).toBeGreaterThan(0);
    db.leaderboard.pop();
    expect(getDb()).toBe(db);

    const fresh = resetDb(2_000);
    expect(fresh).not.toBe(db);
    expect(fresh.seededAt).toBe(2_000);
    expect(fresh.leaderboard.length).toBe(db.leaderboard.length + 1);
  });

  it("hands out monotonic ids", () => {
    expect(nextId("prj")).toBe("prj_0001");
    expect(nextId("ver")).toBe("ver_0002");
  });
});

describe("paginate", () => {
  const items = ["a", "b", "c", "d", "e"].map((id) => ({ id }));

  it("pages by cursor and ends with a null cursor", () => {
    const first = paginate(items, null, 2);
    expect(first).toEqual({
      items: [{ id: "a" }, { id: "b" }],
      next_cursor: "b",
    });
    const last = paginate(items, "d", 2);
    expect(last).toEqual({ items: [{ id: "e" }], next_cursor: null });
  });

  it("returns null for an unknown cursor", () => {
    expect(paginate(items, "zzz", 2)).toBeNull();
  });
});
