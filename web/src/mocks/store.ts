import { buildSeed, type MockDb } from "./seed";

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
