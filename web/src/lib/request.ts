import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 4096;

/** Parsed JSON body, or null when it is missing, too large or not JSON. */
export async function readJsonBody(request: Request): Promise<unknown | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return null;
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return null;
  }
  if (
    raw.length === 0 ||
    new TextEncoder().encode(raw).length > MAX_BODY_BYTES
  ) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function invalidArgument(message: string): NextResponse {
  return NextResponse.json(
    { error: { code: "invalid_argument", message } },
    { status: 400 },
  );
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const hits = new Map<string, number[]>();

/** A 403 or 429 response when a call to a paid route must not go through, else null. */
export function guardPaidRoute(
  request: Request,
  now = Date.now(),
): NextResponse | null {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  let sameOrigin = false;
  try {
    sameOrigin = !!origin && !!host && new URL(origin).host === host;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) {
    return NextResponse.json(
      {
        error: {
          code: "forbidden",
          message: "Cross-origin calls are refused.",
        },
      },
      { status: 403 },
    );
  }
  const client =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const recent = (hits.get(client) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_MAX) {
    hits.set(client, recent);
    return NextResponse.json(
      {
        error: {
          code: "rate_limited",
          message: "Too many requests; try again shortly.",
        },
      },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }
  recent.push(now);
  hits.set(client, recent);
  return null;
}

/** Test seam: clears the in-memory rate window. */
export function resetPaidRouteGuard(): void {
  hits.clear();
}
