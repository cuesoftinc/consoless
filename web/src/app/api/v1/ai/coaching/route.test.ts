// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { COACHING_FALLBACK } from "@/lib/ai";
import { resetPaidRouteGuard } from "@/lib/request";
import { POST } from "./route";

const reply = {
  tip: "Dodge left.",
  strategy: "Save potions for the boss.",
  relevantStats: [{ label: "HP", value: "80%" }],
};

function post(body: unknown): Request {
  return new Request("http://localhost/api/v1/ai/coaching", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
      host: "localhost",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
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

const validBody = { gameTitle: "Doom", playerContext: "Level 1, low health" };

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

describe("POST /api/v1/ai/coaching", () => {
  it("returns the proxy's coaching and sends the key server-side", async () => {
    const fetchMock = proxyReturns(JSON.stringify(reply));

    const res = await POST(post(validBody));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(reply);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://gemini-proxy.cuesoft.io");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-api-key": "test-key",
    });
    const sent = JSON.parse(String(init.body));
    expect(sent.prompt).toContain("Doom");
    expect(sent.systemPrompt).toContain('"relevantStats"');
    expect(Object.keys(sent).sort()).toEqual(["prompt", "systemPrompt"]);
  });

  it("calls GEMINI_PROXY_URL when it is set", async () => {
    vi.stubEnv("GEMINI_PROXY_URL", "https://proxy.example.test");
    const fetchMock = proxyReturns(JSON.stringify(reply));

    const res = await POST(post(validBody));

    expect(res.status).toBe(200);
    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url).toBe("https://proxy.example.test");
  });

  it("parses a reply wrapped in code fences", async () => {
    proxyReturns("```json\n" + JSON.stringify(reply) + "\n```");

    const res = await POST(post(validBody));

    expect(await res.json()).toEqual(reply);
  });

  it("falls back when the proxy fails", async () => {
    proxyReturns("", 502);

    const res = await POST(post(validBody));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(COACHING_FALLBACK);
  });

  it("falls back when the proxy is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );

    const res = await POST(post(validBody));

    expect(await res.json()).toEqual(COACHING_FALLBACK);
  });

  it("falls back when the reply is not coaching JSON", async () => {
    proxyReturns("I cannot help with that.");

    const res = await POST(post(validBody));

    expect(await res.json()).toEqual(COACHING_FALLBACK);
  });

  it("falls back without calling the proxy when the key is missing", async () => {
    vi.stubEnv("GEMINI_PROXY_API_KEY", "");
    const fetchMock = proxyReturns(JSON.stringify(reply));

    const res = await POST(post(validBody));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(COACHING_FALLBACK);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects invalid input with a 400 envelope", async () => {
    const fetchMock = proxyReturns(JSON.stringify(reply));

    for (const body of [
      "not json",
      {},
      { gameTitle: "Doom" },
      { gameTitle: "x".repeat(121), playerContext: "ok" },
      { gameTitle: "Doom", playerContext: "x".repeat(501) },
    ]) {
      const res = await POST(post(body));
      expect(res.status).toBe(400);
      expect((await res.json()).error.code).toBe("invalid_argument");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
