// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as GET_CHECK } from "@/app/api/mock/v1/checks/[id]/route";
import { GET as GET_GENERATION } from "@/app/api/mock/v1/generations/[id]/route";
import { PUT as PUT_FILES } from "@/app/api/mock/v1/projects/[id]/files/route";
import {
  GET as LIST_GENERATIONS,
  POST as GENERATE,
} from "@/app/api/mock/v1/projects/[id]/generations/route";
import { POST as PUBLISH } from "@/app/api/mock/v1/projects/[id]/publish/route";
import {
  GET as GET_PROJECT,
  PATCH,
} from "@/app/api/mock/v1/projects/[id]/route";
import { GET as LIST_VERSIONS } from "@/app/api/mock/v1/projects/[id]/versions/route";
import { POST as CREATE } from "@/app/api/mock/v1/projects/route";
import { POST as RESTORE } from "@/app/api/mock/v1/versions/[id]/restore/route";
import { GET as GET_VERSION } from "@/app/api/mock/v1/versions/[id]/route";
import type {
  ApiErrorBody,
  Check,
  Generation,
  Project,
  Version,
  VersionDetail,
} from "@/models";
import { resetDb, userState } from "./store";
import { TIMING } from "./studio";
import { json, mockRequest, params } from "./test-helpers";

const START = Date.UTC(2026, 10, 10, 12);
const USER = "usr_maker";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(START);
  resetDb(START);
});

afterEach(() => {
  vi.useRealTimers();
});

const advance = (ms: number) => vi.setSystemTime(Date.now() + ms);
const code = async (res: Response) =>
  (await json<ApiErrorBody>(res)).error.code;

const create = (body: unknown, userId: string | null = USER) =>
  CREATE(mockRequest("/projects", { method: "POST", userId, body }));

async function newProject(prompt = "A platformer where you collect coins") {
  const res = await create({ prompt, style_id: "8bit" });
  return json<{ project: Project; generation: Generation }>(res);
}

const generation = async (id: string) =>
  json<Generation>(
    await GET_GENERATION(
      mockRequest(`/generations/${id}`, { userId: USER }),
      params({ id }),
    ),
  );

const generate = (projectId: string, prompt: unknown) =>
  GENERATE(
    mockRequest(`/projects/${projectId}/generations`, {
      method: "POST",
      userId: USER,
      body: { prompt },
    }),
    params({ id: projectId }),
  );

const versions = async (projectId: string) =>
  (
    await json<{ items: Version[] }>(
      await LIST_VERSIONS(
        mockRequest(`/projects/${projectId}/versions`, { userId: USER }),
        params({ id: projectId }),
      ),
    )
  ).items;

const project = async (id: string) =>
  json<Project>(
    await GET_PROJECT(
      mockRequest(`/projects/${id}`, { userId: USER }),
      params({ id }),
    ),
  );

describe("POST /projects", () => {
  it("creates a draft from the prompt and queues its first generation", async () => {
    const res = await create({
      prompt: "A platformer where you collect coins",
      style_id: "8bit",
    });
    expect(res.status).toBe(201);
    const body = await json<{ project: Project; generation: Generation }>(res);
    expect(body.project).toMatchObject({
      title: "Platformer Collect Coins",
      style_id: "8bit",
      status: "draft",
      version_count: 0,
      head_version_id: null,
      artwork: "platformer",
    });
    expect(body.generation).toMatchObject({
      project_id: body.project.id,
      status: "queued",
      version_id: null,
    });
    expect(body.generation).not.toHaveProperty("outcome");
    expect(userState(USER).me.quota.used).toBe(7);
  });

  it("needs sign-in, the attestation, a prompt and a style", async () => {
    const valid = { prompt: "A maze", style_id: "handheld" };
    expect((await create(valid, null)).status).toBe(401);
    expect(await code(await create(valid, "usr_new_maker"))).toBe(
      "attestation_required",
    );
    expect((await create({ prompt: "  ", style_id: "handheld" })).status).toBe(
      422,
    );
    expect((await create({ prompt: "A maze", style_id: "vr" })).status).toBe(
      422,
    );
  });

  it("answers 429 when today's generations are used up", async () => {
    userState(USER).me.quota.used = 20;
    const res = await create({ prompt: "A maze", style_id: "handheld" });
    expect(res.status).toBe(429);
    expect(await code(res)).toBe("quota_exhausted");
    expect(userState(USER).projects).toHaveLength(4);
  });
});

describe("a generation", () => {
  it("moves through queued, generating and checking to a first version", async () => {
    const { project: made, generation: first } = await newProject();
    expect((await generation(first.id)).status).toBe("queued");
    advance(TIMING.queued);
    expect((await generation(first.id)).status).toBe("generating");
    advance(TIMING.generating - TIMING.queued);
    expect((await generation(first.id)).status).toBe("checking");
    advance(TIMING.checking - TIMING.generating);

    const done = await generation(first.id);
    expect(done.status).toBe("ready");
    expect(done.message).toMatch(/^I built your game\./);
    const list = await versions(made.id);
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({
      id: done.version_id,
      number: 1,
      source: "generated",
      summary: "First version",
    });
    expect(await project(made.id)).toMatchObject({
      head_version_id: done.version_id,
      version_count: 1,
    });
    // Reading again changes nothing.
    advance(10_000);
    expect(await versions(made.id)).toHaveLength(1);
  });

  it("allows one at a time per project", async () => {
    const { project: made } = await newProject();
    const second = await generate(made.id, "Make it faster");
    expect(second.status).toBe(409);
    expect(await code(second)).toBe("generation_in_flight");

    advance(TIMING.checking);
    const third = await generate(made.id, "Make it faster");
    expect(third.status).toBe(202);
    advance(TIMING.checking);
    const list = await versions(made.id);
    expect(list.map((version) => version.summary)).toEqual([
      "Make it faster",
      "First version",
    ]);
    expect(userState(USER).me.quota.used).toBe(8);
  });

  it("fails its checks, keeps the last good version and refunds the generation", async () => {
    const { project: made } = await newProject();
    advance(TIMING.checking);
    const res = await json<Generation>(
      await generate(made.id, "Break it [fail]"),
    );
    advance(TIMING.checking);
    expect(await generation(res.id)).toMatchObject({
      status: "failed",
      reason_code: "check_failed",
      attempt: 3,
      version_id: null,
    });
    expect(await versions(made.id)).toHaveLength(1);
    expect(userState(USER).me.quota.used).toBe(7);
  });

  it("refuses a prompt that breaks the rules without using a generation", async () => {
    const { project: made } = await newProject();
    advance(TIMING.checking);
    const res = await json<Generation>(
      await generate(made.id, "Bad idea [refuse]"),
    );
    advance(TIMING.queued);
    const refused = await generation(res.id);
    expect(refused).toMatchObject({
      status: "refused",
      reason_code: "content_policy",
    });
    expect(refused.message).toContain("did not use a generation");
    expect(userState(USER).me.quota.used).toBe(7);
  });

  it("validates the prompt, the quota and ownership", async () => {
    const { project: made } = await newProject();
    advance(TIMING.checking);
    expect((await generate(made.id, "  ")).status).toBe(422);
    userState(USER).me.quota.used = 20;
    expect(await code(await generate(made.id, "More"))).toBe("quota_exhausted");
    expect((await generate("prj_missing", "More")).status).toBe(404);

    const other = await GET_GENERATION(
      mockRequest("/generations/gen_x", { userId: "usr_other" }),
      params({ id: "gen_x" }),
    );
    expect(other.status).toBe(404);
  });

  it("lists every prompt of a project, oldest first", async () => {
    const res = await LIST_GENERATIONS(
      mockRequest("/projects/prj_starfall/generations", { userId: USER }),
      params({ id: "prj_starfall" }),
    );
    const { items } = await json<{ items: Generation[] }>(res);
    expect(items.map((item) => item.prompt)).toEqual([
      "A top-down space shooter with waves of enemies",
      "Make it a little faster",
    ]);
    expect(items.every((item) => item.status === "ready")).toBe(true);
  });
});

describe("versions", () => {
  const detail = async (id: string) =>
    json<VersionDetail>(
      await GET_VERSION(
        mockRequest(`/versions/${id}`, { userId: USER }),
        params({ id }),
      ),
    );
  const restore = (id: string) =>
    RESTORE(
      mockRequest(`/versions/${id}/restore`, { method: "POST", userId: USER }),
      params({ id }),
    );

  it("seeds a returning creator's versions without moving the project", async () => {
    const before = userState(USER).projects.find(
      (item) => item.id === "prj_neonstack",
    )?.updated_at;
    const list = await versions("prj_neonstack");
    expect(list.map((version) => version.number)).toEqual([6, 5, 4, 3, 2, 1]);
    expect(list[0]).not.toHaveProperty("files");
    const fresh = await project("prj_neonstack");
    expect(fresh.head_version_id).toBe(list[0].id);
    expect(fresh.updated_at).toBe(before);
  });

  it("returns a version's code", async () => {
    const [head] = await versions("prj_starfall");
    const version = await detail(head.id);
    expect(version.files).toHaveLength(1);
    expect(version.files[0].path).toBe("game.ts");
    expect(version.files[0].content).toContain('title: "Starfall Patrol"');
  });

  it("restores an older version as a new one", async () => {
    const list = await versions("prj_starfall");
    const oldest = list.at(-1) as Version;
    const res = await restore(oldest.id);
    expect(res.status).toBe(201);
    const restored = await json<Version>(res);
    expect(restored).toMatchObject({
      number: 3,
      source: "restored",
      summary: "Restored version 1",
    });
    expect((await detail(restored.id)).files).toEqual(
      (await detail(oldest.id)).files,
    );
    expect((await project("prj_starfall")).head_version_id).toBe(restored.id);
  });

  it("will not restore the current version, or anything unknown", async () => {
    const [head] = await versions("prj_starfall");
    expect(await code(await restore(head.id))).toBe("already_current");
    expect((await restore("ver_missing")).status).toBe(404);
  });
});

describe("hand edits", () => {
  const save = (content: unknown, projectId = "prj_starfall") =>
    PUT_FILES(
      mockRequest(`/projects/${projectId}/files`, {
        method: "PUT",
        userId: USER,
        body: { files: [{ path: "game.ts", content }] },
      }),
      params({ id: projectId }),
    );
  const check = async (id: string) =>
    json<Check>(
      await GET_CHECK(
        mockRequest(`/checks/${id}`, { userId: USER }),
        params({ id }),
      ),
    );

  it("checks an edit and turns it into a version when it passes", async () => {
    const res = await save("export default { speed: 9 };\n");
    expect(res.status).toBe(202);
    const started = await json<Check>(res);
    expect(started.status).toBe("checking");
    expect(started).not.toHaveProperty("content");

    advance(TIMING.check);
    const passed = await check(started.id);
    expect(passed).toMatchObject({ status: "passed", error: null });
    const [head] = await versions("prj_starfall");
    expect(head).toMatchObject({
      id: passed.version_id,
      number: 3,
      source: "edited",
    });
  });

  it("never makes a version from an edit that fails, and names the line", async () => {
    const started = await json<Check>(await save("const a = {\n  b: 1,\n"));
    advance(TIMING.check);
    expect(await check(started.id)).toMatchObject({
      status: "failed",
      version_id: null,
      error: { path: "game.ts", line: 3, message: "Expected '}'." },
    });
    expect(await versions("prj_starfall")).toHaveLength(2);

    const extra = await json<Check>(await save("const a = 1;\n}\n"));
    advance(TIMING.check);
    expect((await check(extra.id)).error).toMatchObject({
      line: 2,
      message: "Unexpected '}'.",
    });
  });

  it("rejects a bad payload and a second edit while one is being checked", async () => {
    expect((await save(42)).status).toBe(422);
    expect((await save("x".repeat(200_001))).status).toBe(422);
    await save("const a = 1;\n");
    expect(await code(await save("const a = 2;\n"))).toBe(
      "generation_in_flight",
    );
  });

  it("needs a version to edit", async () => {
    const { project: made } = await newProject();
    expect(await code(await save("const a = 1;\n", made.id))).toBe(
      "no_version",
    );
  });
});

describe("style and publishing", () => {
  const patch = (body: unknown) =>
    PATCH(
      mockRequest("/projects/prj_starfall", {
        method: "PATCH",
        userId: USER,
        body,
      }),
      params({ id: "prj_starfall" }),
    );
  const publish = (id: string) =>
    PUBLISH(
      mockRequest(`/projects/${id}/publish`, { method: "POST", userId: USER }),
      params({ id }),
    );

  it("switches the console style without making a version", async () => {
    const res = await patch({ style_id: "modern" });
    expect((await json<Project>(res)).style_id).toBe("modern");
    expect(await versions("prj_starfall")).toHaveLength(2);
    expect((await patch({ style_id: "vr" })).status).toBe(422);
  });

  it("sends a draft for review", async () => {
    const res = await publish("prj_starfall");
    expect(res.status).toBe(202);
    expect((await json<Project>(res)).status).toBe("in_review");
    expect(await code(await publish("prj_starfall"))).toBe("already_published");
  });

  it("will not publish a live game again, or one with no version", async () => {
    expect(await code(await publish("prj_neonstack"))).toBe(
      "already_published",
    );
    const { project: made } = await newProject();
    expect(await code(await publish(made.id))).toBe("no_version");
  });
});
