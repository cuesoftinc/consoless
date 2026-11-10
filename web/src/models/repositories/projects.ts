import type { Page, Project } from "../types";
import { http } from "./client";

export interface ListProjectsOptions {
  cursor?: string | null;
  limit?: number;
  /** TEST_MODE only: makes the mock answer 500. */
  fail?: boolean;
}

/** The signed-in user's projects. */
export const projectsRepo = {
  list(options: ListProjectsOptions = {}): Promise<Page<Project>> {
    const query: Record<string, string> = {};
    if (options.cursor) query.cursor = options.cursor;
    if (options.limit) query.limit = String(options.limit);
    if (options.fail) query.fail = "1";
    return http.get<Page<Project>>("/projects", { query });
  },
  rename(id: string, title: string): Promise<Project> {
    return http.patch<Project>(`/projects/${id}`, { title });
  },
  /** Takes the game out of the Arcade; the project stays. */
  unpublish(id: string): Promise<Project> {
    return http.delete<Project>(`/projects/${id}/publish`);
  },
  remove(id: string): Promise<void> {
    return http.delete(`/projects/${id}`);
  },
};
