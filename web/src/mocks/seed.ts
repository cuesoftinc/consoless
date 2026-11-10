import type { Me, Project } from "@/models/types";

/**
 * Seed data for the TEST_MODE mock server. State is kept per user, keyed by
 * the user id in the bearer token, so parallel Playwright journeys that
 * sign in as different test users never see each other's changes.
 *
 * Game names are original; no trademarked names (PRD section 7).
 */
export interface UserState {
  me: Me;
  projects: Project[];
}

export interface MockDb {
  seededAt: number;
  seq: number;
  users: Record<string, UserState>;
}

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

/** `usr_playerone` → `playerone`; ids are already lower-case and URL-safe. */
function usernameOf(userId: string): string {
  return userId.replace(/^usr_/, "");
}

function seededProjects(now: number): Project[] {
  return [
    {
      id: "prj_neonstack",
      title: "Neon Stack",
      style_id: "handheld",
      prompt: "A falling-block puzzle on a handheld with a green screen",
      status: "published",
      slug: "neon-stack",
      version_count: 6,
      artwork: "blocks",
      created_at: iso(now - 9 * DAY),
      updated_at: iso(now - 2 * HOUR),
    },
    {
      id: "prj_coincanyon",
      title: "Coin Canyon",
      style_id: "8bit",
      prompt: "A platformer where you collect coins and jump over gaps",
      status: "in_review",
      slug: null,
      version_count: 4,
      artwork: "platformer",
      created_at: iso(now - 5 * DAY),
      updated_at: iso(now - 1 * DAY),
    },
    {
      id: "prj_starfall",
      title: "Starfall Patrol",
      style_id: "arcade",
      prompt: "A top-down space shooter with waves of enemies",
      status: "draft",
      slug: null,
      version_count: 2,
      artwork: "shooter",
      created_at: iso(now - 3 * DAY),
      updated_at: iso(now - 3 * DAY),
    },
    {
      id: "prj_kartdraft",
      title: "Kart Draft",
      style_id: "16bit",
      prompt: "A top-down kart race around a dirt track",
      status: "rejected",
      slug: null,
      version_count: 3,
      artwork: "kart",
      created_at: iso(now - 12 * DAY),
      updated_at: iso(now - 6 * DAY),
    },
  ];
}

/**
 * The state a user starts with. Ids beginning `usr_new` are first-time
 * users: no attestation and no projects. Every other id is a returning
 * creator with the sample projects.
 */
export function buildUserState(userId: string, now: number): UserState {
  const firstTime = userId.startsWith("usr_new");
  const username = usernameOf(userId);
  return {
    me: {
      id: userId,
      email: `${username}@example.com`,
      display_name: firstTime ? "New Player" : "Player One",
      username,
      creator_attested_at: firstTime ? null : iso(now - 9 * DAY),
      created_at: iso(now - (firstTime ? 0 : 9 * DAY)),
      quota: {
        limit: 20,
        used: firstTime ? 0 : 6,
        resets_at: iso(now + 8 * HOUR),
      },
    },
    projects: firstTime ? [] : seededProjects(now),
  };
}

export function buildSeed(now: number): MockDb {
  return { seededAt: now, seq: 0, users: {} };
}
