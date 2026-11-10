import { NextResponse } from "next/server";
import type { UserState } from "./seed";
import { userState } from "./store";

/** Ecosystem error envelope: `{"error": {code, message, details?}}`, snake_case codes. */
export function jsonError(
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );
}

export function jsonOk<T>(body: T, status = 200): NextResponse {
  return NextResponse.json(body as unknown as Record<string, unknown>, {
    status,
  });
}

export function notFound(what = "resource"): NextResponse {
  return jsonError(404, "not_found", `${what} not found`);
}

export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Cursor pagination over an already-filtered array. An unknown cursor
 * returns null so the handler can answer 422; restarting from page one
 * would serve rows twice.
 */
export function paginate<T extends { id: string }>(
  items: T[],
  cursor: string | null,
  limit: number,
): { items: T[]; next_cursor: string | null } | null {
  if (cursor && !items.some((item) => item.id === cursor)) return null;
  const start = cursor ? items.findIndex((item) => item.id === cursor) + 1 : 0;
  const pageItems = items.slice(start, start + limit);
  const next =
    start + limit < items.length
      ? (pageItems[pageItems.length - 1]?.id ?? null)
      : null;
  return { items: pageItems, next_cursor: next };
}

const TOKEN_PREFIX = "test-mode-token.";

/**
 * Resolves the caller from the bearer token. TEST_MODE tokens carry the
 * user id (`test-mode-token.<user id>`); anything else is 401.
 */
export function requireUser(
  req: Request,
): { userId: string; state: UserState } | NextResponse {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const userId = token.startsWith(TOKEN_PREFIX)
    ? token.slice(TOKEN_PREFIX.length)
    : "";
  if (!/^usr_[a-z0-9_]+$/.test(userId)) {
    return jsonError(401, "unauthenticated", "Sign in to continue.");
  }
  return { userId, state: userState(userId) };
}

export function isResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

/** Route-handler context (Next 16 async params). */
export interface RouteContext<T extends Record<string, string>> {
  params: Promise<T>;
}
