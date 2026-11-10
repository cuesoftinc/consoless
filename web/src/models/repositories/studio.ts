import type {
  Check,
  ConsoleStyleId,
  Generation,
  Project,
  Version,
  VersionDetail,
} from "../types";
import { GAME_FILE } from "../game-file";
import { http } from "./client";

/** The Studio: a project's prompts, versions, code and publishing. */
export const studioRepo = {
  /** Creates a project from a first prompt and starts its first generation. */
  create(
    prompt: string,
    styleId: ConsoleStyleId,
    idempotencyKey: string,
  ): Promise<{ project: Project; generation: Generation }> {
    return http.post(
      "/projects",
      { prompt, style_id: styleId },
      { idempotencyKey },
    );
  },
  project(id: string): Promise<Project> {
    return http.get<Project>(`/projects/${id}`);
  },
  async generations(projectId: string): Promise<Generation[]> {
    const { items } = await http.get<{ items: Generation[] }>(
      `/projects/${projectId}/generations`,
    );
    return items;
  },
  generate(
    projectId: string,
    prompt: string,
    idempotencyKey: string,
  ): Promise<Generation> {
    return http.post<Generation>(
      `/projects/${projectId}/generations`,
      { prompt },
      { idempotencyKey },
    );
  },
  generation(id: string): Promise<Generation> {
    return http.get<Generation>(`/generations/${id}`);
  },
  async versions(projectId: string): Promise<Version[]> {
    const { items } = await http.get<{ items: Version[] }>(
      `/projects/${projectId}/versions`,
    );
    return items;
  },
  version(id: string): Promise<VersionDetail> {
    return http.get<VersionDetail>(`/versions/${id}`);
  },
  restore(versionId: string): Promise<Version> {
    return http.post<Version>(`/versions/${versionId}/restore`);
  },
  /** Saves a hand edit; it is checked before it becomes a version. */
  saveCode(
    projectId: string,
    content: string,
    idempotencyKey: string,
  ): Promise<Check> {
    return http.put<Check>(
      `/projects/${projectId}/files`,
      { files: [{ path: GAME_FILE, content }] },
      { idempotencyKey },
    );
  },
  check(id: string): Promise<Check> {
    return http.get<Check>(`/checks/${id}`);
  },
  setStyle(projectId: string, styleId: ConsoleStyleId): Promise<Project> {
    return http.patch<Project>(`/projects/${projectId}`, { style_id: styleId });
  },
  publish(projectId: string, idempotencyKey: string): Promise<Project> {
    return http.post<Project>(`/projects/${projectId}/publish`, undefined, {
      idempotencyKey,
    });
  },
};
