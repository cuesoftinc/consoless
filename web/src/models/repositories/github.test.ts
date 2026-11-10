// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { githubRepo } from "./github";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("githubRepo.stars", () => {
  it("reads stargazers_count from the GitHub API", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ stargazers_count: 42 }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    await expect(githubRepo.stars("cuesoftinc/consoless")).resolves.toBe(42);
    expect(String(fetchSpy.mock.calls[0][0])).toBe(
      "https://api.github.com/repos/cuesoftinc/consoless",
    );
  });

  it("resolves null when the request fails or the shape is wrong", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("rate limited", { status: 403 }),
    );
    await expect(githubRepo.stars("cuesoftinc/consoless")).resolves.toBeNull();
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    await expect(githubRepo.stars("cuesoftinc/consoless")).resolves.toBeNull();
  });
});
