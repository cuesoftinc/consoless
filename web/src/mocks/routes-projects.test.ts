// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import {
  DELETE,
  GET as GET_ONE,
  PATCH,
} from "@/app/api/mock/v1/projects/[id]/route";
import { DELETE as UNPUBLISH } from "@/app/api/mock/v1/projects/[id]/publish/route";
import { GET } from "@/app/api/mock/v1/projects/route";
import type { ApiErrorBody, Page, Project } from "@/models";
import { resetDb } from "./store";
import { json, mockRequest, params } from "./test-helpers";

beforeEach(() => {
  resetDb(Date.UTC(2026, 10, 10));
});

const list = async (query = "", userId?: string) =>
  GET(mockRequest(`/projects${query}`, { userId }));

describe("GET /projects", () => {
  it("answers 401 without a token", async () => {
    const res = await GET(mockRequest("/projects", { userId: null }));
    expect(res.status).toBe(401);
  });

  it("lists the caller's projects, most recently updated first", async () => {
    const page = await json<Page<Project>>(await list());
    expect(page.items.map((project) => project.title)).toEqual([
      "Neon Stack",
      "Coin Canyon",
      "Starfall Patrol",
      "Kart Draft",
    ]);
    expect(page.next_cursor).toBeNull();
  });

  it("is empty for a first-time user", async () => {
    const page = await json<Page<Project>>(await list("", "usr_new_b"));
    expect(page.items).toEqual([]);
  });

  it("pages by cursor and rejects an unknown one", async () => {
    const first = await json<Page<Project>>(await list("?limit=3"));
    expect(first.items).toHaveLength(3);
    expect(first.next_cursor).toBe("prj_starfall");

    const second = await json<Page<Project>>(
      await list(`?limit=3&cursor=${first.next_cursor}`),
    );
    expect(second.items.map((project) => project.id)).toEqual([
      "prj_kartdraft",
    ]);

    const bad = await list("?cursor=prj_missing");
    expect(bad.status).toBe(422);
    expect((await json<ApiErrorBody>(bad)).error.code).toBe("invalid_cursor");
  });

  it("answers 500 on request, for the error state", async () => {
    expect((await list("?fail=1")).status).toBe(500);
  });
});

describe("/projects/{id}", () => {
  const ctx = params({ id: "prj_starfall" });

  it("reads one project and hides other users' projects as 404", async () => {
    const mine = await GET_ONE(mockRequest("/projects/prj_starfall"), ctx);
    expect((await json<Project>(mine)).title).toBe("Starfall Patrol");

    const theirs = await GET_ONE(
      mockRequest("/projects/prj_starfall", { userId: "usr_new_c" }),
      ctx,
    );
    expect(theirs.status).toBe(404);
  });

  it("renames a project and moves it to the top of the list", async () => {
    const res = await PATCH(
      mockRequest("/projects/prj_starfall", {
        method: "PATCH",
        body: { title: " Comet Patrol " },
      }),
      ctx,
    );
    expect((await json<Project>(res)).title).toBe("Comet Patrol");
    const page = await json<Page<Project>>(await list());
    expect(page.items[0].title).toBe("Comet Patrol");
  });

  it("rejects an empty or over-long title", async () => {
    for (const title of ["  ", "x".repeat(61)]) {
      const res = await PATCH(
        mockRequest("/projects/prj_starfall", {
          method: "PATCH",
          body: { title },
        }),
        ctx,
      );
      expect(res.status).toBe(422);
    }
  });

  it("deletes a project", async () => {
    const res = await DELETE(
      mockRequest("/projects/prj_starfall", { method: "DELETE" }),
      ctx,
    );
    expect(res.status).toBe(204);
    const again = await DELETE(
      mockRequest("/projects/prj_starfall", { method: "DELETE" }),
      ctx,
    );
    expect(again.status).toBe(404);
  });
});

describe("DELETE /projects/{id}/publish", () => {
  const unpublish = (id: string) =>
    UNPUBLISH(
      mockRequest(`/projects/${id}/publish`, { method: "DELETE" }),
      params({ id }),
    );

  it("takes a published game back to a draft with no slug", async () => {
    const project = await json<Project>(await unpublish("prj_neonstack"));
    expect(project).toMatchObject({ status: "draft", slug: null });
  });

  it("withdraws a game that is in review", async () => {
    const project = await json<Project>(await unpublish("prj_coincanyon"));
    expect(project.status).toBe("draft");
  });

  it("answers 409 for a game that is not published", async () => {
    const res = await unpublish("prj_starfall");
    expect(res.status).toBe(409);
    expect((await json<ApiErrorBody>(res)).error.code).toBe("not_published");
  });

  it("answers 404 for an unknown project", async () => {
    expect((await unpublish("prj_missing")).status).toBe(404);
  });
});
