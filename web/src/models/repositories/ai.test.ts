import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COACHING_FALLBACK,
  LOBBY_EMPTY_FALLBACK,
  LOBBY_ERROR_FALLBACK,
} from "@/lib/ai";
import { MOCK_COACHING, MOCK_LOBBY_CHATTER } from "@/mocks/ai";
import { getGameCoaching, getLobbyChatter } from "./ai";
import { apiBase } from "./client";

function respond(body: unknown, status = 200) {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AI repository", () => {
  it("targets the mock routes in TEST_MODE", async () => {
    expect(apiBase()).toBe("/api/mock");
    const fetchMock = respond(MOCK_COACHING);

    await expect(getGameCoaching("Doom", "Level 1")).resolves.toEqual(
      MOCK_COACHING,
    );
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("/api/mock/v1/ai/coaching");
    expect(JSON.parse(String(init.body))).toEqual({
      gameTitle: "Doom",
      playerContext: "Level 1",
    });
  });

  it("returns the coaching fallback on an error or a bad shape", async () => {
    respond({ error: { code: "internal", message: "boom" } }, 500);
    await expect(getGameCoaching("Doom", "Level 1")).resolves.toEqual(
      COACHING_FALLBACK,
    );

    respond({ tip: "only a tip" });
    await expect(getGameCoaching("Doom", "Level 1")).resolves.toEqual(
      COACHING_FALLBACK,
    );
  });

  it("returns lobby chatter, with the prototype's two fallbacks", async () => {
    const fetchMock = respond({ text: MOCK_LOBBY_CHATTER });
    await expect(getLobbyChatter("Doom")).resolves.toBe(MOCK_LOBBY_CHATTER);
    expect((fetchMock.mock.calls[0] as unknown as [string])[0]).toBe(
      "/api/mock/v1/ai/lobby",
    );

    respond({ text: "" });
    await expect(getLobbyChatter("Doom")).resolves.toBe(LOBBY_EMPTY_FALLBACK);

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("offline");
      }),
    );
    await expect(getLobbyChatter("Doom")).resolves.toBe(LOBBY_ERROR_FALLBACK);
  });

  it("clips inputs to the route limits", async () => {
    const fetchMock = respond(MOCK_COACHING);

    await getGameCoaching("t".repeat(300), "c".repeat(900));

    const body = JSON.parse(
      String(
        (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body,
      ),
    );
    expect(body.gameTitle).toHaveLength(120);
    expect(body.playerContext).toHaveLength(500);
  });
});
