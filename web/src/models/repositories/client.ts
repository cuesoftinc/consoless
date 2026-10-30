import { env } from "@/config/env";
import { ApiError, type ApiErrorBody } from "../errors";

/**
 * HTTP client for the repository layer: the only place the browser talks to
 * the network. TEST_MODE targets the in-app mock routes at `/api/mock`;
 * otherwise `/api`.
 */
export function apiBase(): string {
  return env.testMode ? "/api/mock" : "/api";
}

async function parseError(res: Response): Promise<never> {
  let body: ApiErrorBody | null = null;
  try {
    body = (await res.json()) as ApiErrorBody;
  } catch {
    // non-envelope failure (proxy, network edge): synthesize a stable code
  }
  throw new ApiError(
    res.status,
    body?.error ?? { code: "internal", message: `HTTP ${res.status}` },
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const http = {
  get<T>(path: string): Promise<T> {
    return request<T>(path);
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },
};
