// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import { POST as REMIX } from "@/app/api/mock/v1/arcade/games/[slug]/remix/route";
import { POST as REPORT } from "@/app/api/mock/v1/arcade/games/[slug]/reports/route";
import { GET as GET_ONE } from "@/app/api/mock/v1/arcade/games/[slug]/route";
import {
  GET as GET_SCORES,
  POST as POST_SCORE,
} from "@/app/api/mock/v1/arcade/games/[slug]/scores/route";
import { GET } from "@/app/api/mock/v1/arcade/games/route";
import type { ApiErrorBody, ArcadeGame, Page, Project, Score } from "@/models";
import { getDb, resetDb, userState } from "./store";
import { json, mockRequest, params } from "./test-helpers";

beforeEach(() => {
  resetDb(Date.UTC(2026, 10, 10));
});

const anon = { userId: null };
const list = async (query = "") =>
  json<Page<ArcadeGame>>(await GET(mockRequest(`/arcade/games${query}`, anon)));
const slugs = (page: Page<ArcadeGame>) => page.items.map((game) => game.slug);

describe("GET /arcade/games", () => {
  it("is public and lists games most played first", async () => {
    const page = await list();
    expect(page.items).toHaveLength(8);
    expect(slugs(page).slice(0, 3)).toEqual([
      "neon-stack",
      "coin-run",
      "orbit-drop",
    ]);
  });

  it("searches the title, the author and the prompt", async () => {
    expect(slugs(await list("?q=STACK"))).toEqual(["neon-stack", "moss-stack"]);
    expect(slugs(await list("?q=kofi"))).toEqual([
      "orbit-drop",
      "harbour-dash",
    ]);
    expect(slugs(await list("?q=double%20jump"))).toEqual(["cloud-hopper"]);
    expect(slugs(await list("?q=zzz"))).toEqual([]);
  });

  it("filters by console style, alone or with a search", async () => {
    expect(slugs(await list("?style=8bit"))).toEqual([
      "coin-run",
      "comet-guard",
    ]);
    expect(slugs(await list("?style=handheld&q=moss"))).toEqual(["moss-stack"]);
  });

  it("pages by cursor and rejects an unknown one", async () => {
    const first = await list("?limit=5");
    expect(first.next_cursor).toBe("moss-stack");
    const second = await list("?limit=5&cursor=moss-stack");
    expect(second.items).toHaveLength(3);
    expect(second.next_cursor).toBeNull();

    const bad = await GET(mockRequest("/arcade/games?cursor=nope", anon));
    expect(bad.status).toBe(422);
  });

  it("answers 500 on request, for the error state", async () => {
    const res = await GET(mockRequest("/arcade/games?fail=1", anon));
    expect(res.status).toBe(500);
  });
});

describe("GET /arcade/games/{slug}", () => {
  it("returns a game with its remix credit", async () => {
    const res = await GET_ONE(
      mockRequest("/arcade/games/moss-stack", anon),
      params({ slug: "moss-stack" }),
    );
    const game = await json<ArcadeGame>(res);
    expect(game.title).toBe("Moss Stack");
    expect(game.remixed_from).toMatchObject({
      slug: "neon-stack",
      author: { display_name: "Player One" },
    });
  });

  it("answers 404 for an unknown game", async () => {
    const res = await GET_ONE(
      mockRequest("/arcade/games/nope", anon),
      params({ slug: "nope" }),
    );
    expect(res.status).toBe(404);
  });
});

describe("/arcade/games/{slug}/scores", () => {
  const ctx = params({ slug: "neon-stack" });
  const scores = async (userId: string | null = null) =>
    (
      await json<{ items: Score[] }>(
        await GET_SCORES(
          mockRequest("/arcade/games/neon-stack/scores", { userId }),
          ctx,
        ),
      )
    ).items;
  const submit = (value: unknown, userId: string | null = "usr_scorer") =>
    POST_SCORE(
      mockRequest("/arcade/games/neon-stack/scores", {
        method: "POST",
        userId,
        body: { value },
      }),
      ctx,
    );

  it("ranks scores, best first, for anyone", async () => {
    const rows = await scores();
    expect(rows.map((row) => [row.rank, row.player.display_name])).toEqual([
      [1, "Mei"],
      [2, "Ada"],
      [3, "Kofi"],
      [4, "Tunde"],
    ]);
    expect(rows.every((row) => !row.you)).toBe(true);
  });

  it("is empty for a game nobody has scored in, and 404 for an unknown game", async () => {
    const res = await GET_SCORES(
      mockRequest("/arcade/games/harbour-dash/scores", anon),
      params({ slug: "harbour-dash" }),
    );
    expect(await json(res)).toEqual({ items: [] });
    const missing = await GET_SCORES(
      mockRequest("/arcade/games/nope/scores", anon),
      params({ slug: "nope" }),
    );
    expect(missing.status).toBe(404);
  });

  it("needs sign-in to submit", async () => {
    expect((await submit(100, null)).status).toBe(401);
  });

  it("records a score, marks the player's row and keeps their best", async () => {
    const res = await submit(45000);
    expect(res.status).toBe(201);
    expect(await json<Score>(res)).toMatchObject({
      rank: 2,
      value: 45000,
      you: true,
    });

    await submit(100);
    const rows = await scores("usr_scorer");
    const mine = rows.find((row) => row.you);
    expect(mine).toMatchObject({ rank: 2, value: 45000 });
    expect(rows).toHaveLength(5);

    expect(await json<Score>(await submit(50000))).toMatchObject({ rank: 1 });
  });

  it("adds the caller's own row when they are outside the top ten", async () => {
    const rows = getDb().arcade.scores["neon-stack"];
    for (let index = 0; index < 8; index += 1) {
      rows.push({
        player: { username: `p${index}`, display_name: `P${index}` },
        value: 30000 - index,
        submitted_at: "2026-11-01T00:00:00.000Z",
      });
    }
    await submit(1);
    const mine = (await scores("usr_scorer")).at(-1);
    expect(mine).toMatchObject({ rank: 13, you: true });
    expect(await scores()).toHaveLength(10);
  });

  it.each([-1, 1.5, "100", 10_000_000, undefined])(
    "rejects the score %j",
    async (value) => {
      const res = await submit(value);
      expect(res.status).toBe(422);
      expect((await json<ApiErrorBody>(res)).error.details).toEqual({
        field: "value",
      });
    },
  );
});

describe("POST /arcade/games/{slug}/reports", () => {
  const report = (body: unknown, slug = "coin-run") =>
    REPORT(
      mockRequest(`/arcade/games/${slug}/reports`, {
        method: "POST",
        userId: null,
        body,
      }),
      params({ slug }),
    );

  it("accepts a report from anyone", async () => {
    const res = await report({ reason: "copied", details: " Looks familiar " });
    expect(res.status).toBe(202);
    expect(getDb().arcade.reports).toEqual([
      { slug: "coin-run", reason: "copied", details: "Looks familiar" },
    ]);
  });

  it("needs a known reason and bounded details", async () => {
    expect((await report({ reason: "boring" })).status).toBe(422);
    expect((await report({})).status).toBe(422);
    const long = await report({ reason: "other", details: "x".repeat(501) });
    expect((await json<ApiErrorBody>(long)).error.details).toEqual({
      field: "details",
    });
    expect(getDb().arcade.reports).toEqual([]);
  });

  it("answers 404 for an unknown game", async () => {
    expect((await report({ reason: "other" }, "nope")).status).toBe(404);
  });
});

describe("POST /arcade/games/{slug}/remix", () => {
  const remix = (userId: string | null, slug = "orbit-drop") =>
    REMIX(
      mockRequest(`/arcade/games/${slug}/remix`, { method: "POST", userId }),
      params({ slug }),
    );

  it("needs sign-in", async () => {
    expect((await remix(null)).status).toBe(401);
  });

  it("needs the 16-or-older attestation", async () => {
    const res = await remix("usr_new_remixer");
    expect(res.status).toBe(403);
    expect((await json<ApiErrorBody>(res)).error.code).toBe(
      "attestation_required",
    );
  });

  it("copies the game into a new draft project for the caller", async () => {
    const res = await remix("usr_remixer");
    expect(res.status).toBe(201);
    const project = await json<Project>(res);
    expect(project).toMatchObject({
      title: "Orbit Drop remix",
      status: "draft",
      style_id: "arcade",
      artwork: "shooter",
      slug: null,
    });
    expect(userState("usr_remixer").projects.at(-1)?.id).toBe(project.id);
  });

  it("answers 404 for an unknown game", async () => {
    expect((await remix("usr_remixer", "nope")).status).toBe(404);
  });
});
