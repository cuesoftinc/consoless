import { NextResponse } from "next/server";
import { isResponse, notFound, requireUser } from "./http";
import type { UserState } from "./seed";
import { syncAll, syncStudio, type StudioState } from "./studio";
import type { Project } from "@/models/types";

export interface ProjectScope {
  state: UserState;
  project: Project;
  studio: StudioState;
  now: number;
}

/** The caller's project with its Studio state brought up to now, or 401/404. */
export function projectScope(
  req: Request,
  projectId: string,
): ProjectScope | NextResponse {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const project = auth.state.projects.find((item) => item.id === projectId);
  if (!project) return notFound("project");
  const now = Date.now();
  return {
    state: auth.state,
    project,
    studio: syncStudio(auth.state, project, now),
    now,
  };
}

/**
 * Finds something inside any of the caller's projects (a generation, a
 * version, a check) with everything brought up to now, or 401/404.
 */
export function findInProjects<T>(
  req: Request,
  what: string,
  pick: (studio: StudioState) => T | undefined,
): (ProjectScope & { found: T }) | NextResponse {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const now = Date.now();
  syncAll(auth.state, now);
  for (const project of auth.state.projects) {
    const studio = auth.state.studio[project.id];
    const found = studio ? pick(studio) : undefined;
    if (found) return { state: auth.state, project, studio, now, found };
  }
  return notFound(what);
}
