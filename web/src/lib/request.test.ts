// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { guardPaidRoute, resetPaidRouteGuard } from "./request";

function req(headers: Record<string, string>): Request {
  return new Request("http://localhost/api/v1/ai/lobby", {
    method: "POST",
    headers,
  });
}

const same = {
  origin: "https://consoless.cuesoft.io",
  host: "consoless.cuesoft.io",
  "x-forwarded-for": "1.2.3.4",
};

beforeEach(() => resetPaidRouteGuard());

describe("guardPaidRoute", () => {
  it("lets a same-origin call through", () => {
    expect(guardPaidRoute(req(same))).toBeNull();
  });

  it("refuses a call with no Origin", () => {
    expect(guardPaidRoute(req({ host: "consoless.cuesoft.io" }))?.status).toBe(
      403,
    );
  });

  it("refuses a cross-origin call", () => {
    expect(
      guardPaidRoute(req({ ...same, origin: "https://evil.example" }))?.status,
    ).toBe(403);
  });

  it("uses the forwarded host behind the proxy", () => {
    expect(
      guardPaidRoute(
        req({
          ...same,
          host: "internal:8080",
          "x-forwarded-host": "consoless.cuesoft.io",
        }),
      ),
    ).toBeNull();
  });

  it("rate limits one client after 20 calls a minute and recovers after the window", () => {
    const t = 1_000_000;
    for (let i = 0; i < 20; i++)
      expect(guardPaidRoute(req(same), t + i)).toBeNull();
    const limited = guardPaidRoute(req(same), t + 100);
    expect(limited?.status).toBe(429);
    expect(
      guardPaidRoute(req({ ...same, "x-forwarded-for": "5.6.7.8" }), t + 100),
    ).toBeNull();
    expect(guardPaidRoute(req(same), t + 61_000)).toBeNull();
  });
});
