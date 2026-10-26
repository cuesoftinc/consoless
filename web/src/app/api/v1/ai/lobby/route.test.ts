// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LOBBY_EMPTY_FALLBACK, LOBBY_ERROR_FALLBACK } from "@/lib/ai";
import { resetPaidRouteGuard } from "@/lib/request";
import { POST } from "./route";

function post(body: unknown): Request {
  return new Request("http://localhost/api/v1/ai/lobby", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
      host: "localhost",
    },
    body: JSON.stringify(body),
  });
}

function proxyReturns(text: string, status = 200) {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify({ text }), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  resetPaidRouteGuard();
  vi.stubEnv("GEMINI_PROXY_API_KEY", "test-key");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/v1/ai/lobby", () => {
  it("returns the proxy's hype line, prompt only", async () => {
    const fetchMock = proxyReturns("  Let's go, legends!  ");

    const res = await POST(post({ gameTitle: "Doom" }));

    expect(await res.json()).toEqual({ text: "Let's go, legends!" });
    const init = (
      fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    )[1];
    const sent = JSON.parse(String(init.body));
    expect(Object.keys(sent)).toEqual(["prompt"]);
    expect(sent.prompt).toContain("Doom");
  });

  it("uses the empty-reply fallback when the proxy returns no text", async () => {
    proxyReturns("   ");

    const res = await POST(post({ gameTitle: "Doom" }));

    expect(await res.json()).toEqual({ text: LOBBY_EMPTY_FALLBACK });
  });

  it("uses the error fallback when the proxy fails", async () => {
    proxyReturns("", 500);

    const res = await POST(post({ gameTitle: "Doom" }));

    expect(await res.json()).toEqual({ text: LOBBY_ERROR_FALLBACK });
  });

  it("uses the error fallback without calling the proxy when the key is missing", async () => {
    vi.stubEnv("GEMINI_PROXY_API_KEY", "");
    const fetchMock = proxyReturns("unused");

    const res = await POST(post({ gameTitle: "Doom" }));

    expect(await res.json()).toEqual({ text: LOBBY_ERROR_FALLBACK });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing or oversized title", async () => {
    proxyReturns("unused");

    expect((await POST(post({}))).status).toBe(400);
    expect((await POST(post({ gameTitle: "x".repeat(121) }))).status).toBe(400);
  });
});
