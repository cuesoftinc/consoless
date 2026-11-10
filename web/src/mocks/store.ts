import { buildSeed, buildUserState, type MockDb, type UserState } from "./seed";

/**
 * In-memory mock state: a module singleton kept on `globalThis` so it
 * survives Next dev HMR reloads (dev-persistent, per the web standard).
 */
const GLOBAL_KEY = "__consolessMockDb" as const;

type GlobalWithDb = typeof globalThis & { [GLOBAL_KEY]?: MockDb };

export function getDb(): MockDb {
  const g = globalThis as GlobalWithDb;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = buildSeed(Date.now());
  return g[GLOBAL_KEY];
}

/** Re-seeds the store. Tests and Playwright journeys call this to start clean. */
export function resetDb(now = Date.now()): MockDb {
  const g = globalThis as GlobalWithDb;
  g[GLOBAL_KEY] = buildSeed(now);
  return g[GLOBAL_KEY];
}

/** Monotonic ids, stable in order within one store lifetime. */
export function nextId(prefix: string): string {
  const db = getDb();
  db.seq += 1;
  return `${prefix}_${db.seq.toString(36).padStart(4, "0")}`;
}

/** One user's state, seeded on first use. */
export function userState(userId: string): UserState {
  const db = getDb();
  if (!db.users[userId]) {
    db.users[userId] = buildUserState(userId, db.seededAt);
  }
  return db.users[userId];
}

/** Removes everything held for a user (`DELETE /me`). */
export function dropUser(userId: string): void {
  delete getDb().users[userId];
}
