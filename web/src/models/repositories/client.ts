import { getAuthProvider } from "@/auth";
import { env } from "@/config/env";
import { ApiError, type ApiErrorBody } from "../errors";

/**
 * HTTP client for the repository layer: the only place the browser talks to
 * the network. TEST_MODE targets the in-app mock server at `/api/mock/v1`;
 * otherwise the `/api/v1` proxy. Responses carrying the ecosystem error
 * envelope are thrown as ApiError.
 */
export interface RequestOptions {
  /** Sent as Idempotency-Key on client-retryable mutations. */
  idempotencyKey?: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

export function apiBase(): string {
  return env.apiBase;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${apiBase()}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function bearerToken(): Promise<string | null> {
  try {
    return await getAuthProvider().getBearerToken();
  } catch {
    return null;
  }
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

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { ...options.headers };
  const token = await bearerToken();
  if (token) headers.authorization = `Bearer ${token}`;
  if (options.idempotencyKey)
    headers["idempotency-key"] = options.idempotencyKey;
  if (body !== undefined) headers["content-type"] = "application/json";

  const res = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: options.signal,
  });
  if (!res.ok) await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const http = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", path, undefined, options);
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("POST", path, body, options);
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PUT", path, body, options);
  },
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PATCH", path, body, options);
  },
  delete<T = void>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },
};

/**
 * GET a public JSON document from outside the API (for example the GitHub
 * REST API). No credentials are sent. Resolves null on any failure.
 */
export async function getExternalJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
