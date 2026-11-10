// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import { DELETE, GET, PATCH } from "@/app/api/mock/v1/me/route";
import { POST as ATTEST } from "@/app/api/mock/v1/me/attestation/route";
import type { ApiErrorBody, Me } from "@/models";
import { resetDb, userState } from "./store";
import { json, mockRequest } from "./test-helpers";

beforeEach(() => {
  resetDb(Date.UTC(2026, 10, 10));
});

describe("/me", () => {
  it("answers 401 without a token", async () => {
    const res = await GET(mockRequest("/me", { userId: null }));
    expect(res.status).toBe(401);
    expect((await json<ApiErrorBody>(res)).error.code).toBe("unauthenticated");
  });

  it("returns the signed-in user with the daily quota", async () => {
    const me = await json<Me>(await GET(mockRequest("/me")));
    expect(me).toMatchObject({
      id: "usr_playerone",
      username: "playerone",
      quota: { limit: 20, used: 6 },
    });
    expect(me.creator_attested_at).not.toBeNull();
  });

  it("renames the user and trims the name", async () => {
    const res = await PATCH(
      mockRequest("/me", {
        method: "PATCH",
        body: { display_name: "  Ada  " },
      }),
    );
    expect((await json<Me>(res)).display_name).toBe("Ada");
  });

  it.each([{ display_name: "   " }, { display_name: "x".repeat(41) }, {}])(
    "rejects the display name in %j",
    async (body) => {
      const res = await PATCH(mockRequest("/me", { method: "PATCH", body }));
      expect(res.status).toBe(422);
      const { error } = await json<ApiErrorBody>(res);
      expect(error.code).toBe("validation_failed");
      expect(error.details).toEqual({ field: "display_name" });
    },
  );

  it("records the attestation once", async () => {
    const init = { method: "POST", userId: "usr_new_a" };
    const first = await json<Me>(
      await ATTEST(mockRequest("/me/attestation", init)),
    );
    expect(first.creator_attested_at).not.toBeNull();
    const second = await json<Me>(
      await ATTEST(mockRequest("/me/attestation", init)),
    );
    expect(second.creator_attested_at).toBe(first.creator_attested_at);
  });

  it("deletes the account and everything it holds", async () => {
    const before = userState("usr_playerone");
    before.projects.pop();
    const res = await DELETE(mockRequest("/me", { method: "DELETE" }));
    expect(res.status).toBe(204);
    expect(userState("usr_playerone")).not.toBe(before);
  });
});
