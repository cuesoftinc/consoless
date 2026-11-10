import type { Generation, Me, Project, Version } from "@/models";

/** Shared fixtures for the Studio controller and component tests. */
export const PROJECT: Project = {
  id: "prj_1",
  title: "Coin Canyon",
  style_id: "8bit",
  prompt: "A platformer where you collect coins",
  status: "draft",
  slug: null,
  version_count: 2,
  head_version_id: "ver_2",
  artwork: "platformer",
  created_at: "2026-11-01T00:00:00.000Z",
  updated_at: "2026-11-02T00:00:00.000Z",
};

export const VERSIONS: Version[] = [
  {
    id: "ver_2",
    project_id: "prj_1",
    number: 2,
    source: "generated",
    summary: "Made the game faster",
    created_at: "2026-11-02T00:00:00.000Z",
  },
  {
    id: "ver_1",
    project_id: "prj_1",
    number: 1,
    source: "generated",
    summary: "First version",
    created_at: "2026-11-01T00:00:00.000Z",
  },
];

export function generation(overrides: Partial<Generation> = {}): Generation {
  return {
    id: "gen_1",
    project_id: "prj_1",
    prompt: "A platformer where you collect coins",
    status: "ready",
    attempt: 1,
    max_attempts: 3,
    reason_code: null,
    message: "I built your game.",
    version_id: "ver_1",
    requested_at: "2026-11-01T00:00:00.000Z",
    updated_at: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

export function me(used = 6): Me {
  return {
    id: "usr_playerone",
    email: "playerone@example.com",
    display_name: "Player One",
    username: "playerone",
    creator_attested_at: "2026-11-01T00:00:00.000Z",
    created_at: "2026-11-01T00:00:00.000Z",
    quota: { limit: 20, used, resets_at: "2026-11-11T00:00:00.000Z" },
  };
}
