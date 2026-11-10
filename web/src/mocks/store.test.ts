// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import { paginate } from "./http";
import { dropUser, getDb, nextId, resetDb, userState } from "./store";

beforeEach(() => {
  resetDb(1_000);
});

describe("mock store", () => {
  it("keeps one seeded database until it is reset", () => {
    const db = getDb();
    expect(db.seededAt).toBe(1_000);
    expect(getDb()).toBe(db);

    const fresh = resetDb(2_000);
    expect(fresh).not.toBe(db);
    expect(fresh.seededAt).toBe(2_000);
  });

  it("keeps state per user, seeded on first use", () => {
    const creator = userState("usr_playerone");
    expect(creator.me.username).toBe("playerone");
    expect(creator.me.creator_attested_at).not.toBeNull();
    expect(creator.projects.length).toBeGreaterThan(0);

    creator.projects.pop();
    expect(userState("usr_playerone")).toBe(creator);
    expect(userState("usr_other").projects.length).toBe(
      creator.projects.length + 1,
    );
  });

  it("starts ids beginning usr_new as first-time users", () => {
    const state = userState("usr_new_1");
    expect(state.me.creator_attested_at).toBeNull();
    expect(state.projects).toEqual([]);
    expect(state.me.quota.used).toBe(0);
  });

  it("forgets a dropped user", () => {
    const state = userState("usr_playerone");
    dropUser("usr_playerone");
    expect(userState("usr_playerone")).not.toBe(state);
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
