import { NextResponse } from "next/server";

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
