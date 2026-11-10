// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../errors";
import { http } from "./client";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

describe("http client (the repositories' single network seam)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("targets the mock server in TEST_MODE and sends the idempotency key", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ ok: true }));
    await http.post(
      "/projects/p1/generations",
      { prompt: "A falling-block puzzle" },
      { idempotencyKey: "key-1" },
    );
    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe("/api/mock/v1/projects/p1/generations");
    expect(init?.method).toBe("POST");
    const headers = init?.headers as Record<string, string>;
    expect(headers["idempotency-key"]).toBe("key-1");
    expect(headers["content-type"]).toBe("application/json");
  });

  it("serializes query params and skips undefined values", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ items: [] }));
    await http.get("/arcade/games", {
      query: { style: "handheld", cursor: undefined, limit: 5 },
    });
    expect(String(fetchSpy.mock.calls[0][0])).toBe(
      "/api/mock/v1/arcade/games?style=handheld&limit=5",
    );
  });

  it("throws ApiError from the error envelope", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "quota_exceeded",
            message: "You have used today's generations.",
            details: { limit: 20 },
          },
        },
        429,
      ),
    );
    const error = await http
      .post("/projects/p1/generations")
      .catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 429,
      code: "quota_exceeded",
      details: { limit: 20 },
    });
  });

  it("synthesizes a stable code when the failure carries no envelope", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("bad gateway", { status: 502 }),
    );
    const error = await http.get("/me").catch((err: unknown) => err);
    expect(error).toMatchObject({ status: 502, code: "internal" });
  });

  it("returns undefined for 204 responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    await expect(http.delete("/projects/p1")).resolves.toBeUndefined();
  });
});
