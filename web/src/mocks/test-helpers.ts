/** Helpers for exercising the mock route handlers directly in unit tests. */

export interface MockRequestInit {
  method?: string;
  /** The signed-in user id; null sends no token. */
  userId?: string | null;
  body?: unknown;
}

export const DEFAULT_USER = "usr_playerone";

export function mockRequest(path: string, init: MockRequestInit = {}): Request {
  const headers = new Headers();
  if (init.userId !== null) {
    headers.set(
      "authorization",
      `Bearer test-mode-token.${init.userId ?? DEFAULT_USER}`,
    );
  }
  let body: string | undefined;
  if (init.body !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(init.body);
  }
  return new Request(`http://mock.local/api/mock/v1${path}`, {
    method: init.method ?? "GET",
    headers,
    body,
  });
}

export function params<T extends Record<string, string>>(
  value: T,
): { params: Promise<T> } {
  return { params: Promise.resolve(value) };
}

export async function json<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}
