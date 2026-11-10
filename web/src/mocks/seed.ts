import type {
  ArcadeGame,
  Me,
  Project,
  PublicUser,
  ReportReason,
} from "@/models/types";

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

/** A stored score: one best value per player and game. */
export interface StoredScore {
  player: PublicUser;
  value: number;
  submitted_at: string;
}

export interface StoredReport {
  slug: string;
  reason: ReportReason;
  details: string;
}

export interface ArcadeState {
  games: ArcadeGame[];
  /** Scores by game slug. */
  scores: Record<string, StoredScore[]>;
  reports: StoredReport[];
}

export interface MockDb {
  seededAt: number;
  seq: number;
  users: Record<string, UserState>;
  /** The public Arcade, shared by every user. */
  arcade: ArcadeState;
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

const AUTHORS: Record<string, PublicUser> = {
  ada: { username: "ada", display_name: "Ada" },
  kofi: { username: "kofi", display_name: "Kofi" },
  mei: { username: "mei", display_name: "Mei" },
  tunde: { username: "tunde", display_name: "Tunde" },
};

function game(
  now: number,
  slug: string,
  title: string,
  author: PublicUser,
  style_id: ArcadeGame["style_id"],
  artwork: ArcadeGame["artwork"],
  prompt: string,
  plays: number,
  daysAgo: number,
  remixed_from: ArcadeGame["remixed_from"] = null,
): ArcadeGame {
  return {
    id: slug,
    slug,
    title,
    author,
    style_id,
    prompt,
    artwork,
    plays,
    published_at: iso(now - daysAgo * DAY),
    remixed_from,
  };
}

function seededArcade(now: number): ArcadeState {
  const games = [
    game(
      now,
      "neon-stack",
      "Neon Stack",
      { username: "playerone", display_name: "Player One" },
      "handheld",
      "blocks",
      "A falling-block puzzle on a handheld with a green screen",
      1204,
      9,
    ),
    game(
      now,
      "coin-run",
      "Coin Run",
      AUTHORS.ada,
      "8bit",
      "platformer",
      "A platformer where you collect coins and jump over gaps",
      982,
      14,
    ),
    game(
      now,
      "orbit-drop",
      "Orbit Drop",
      AUTHORS.kofi,
      "arcade",
      "shooter",
      "A top-down space shooter with waves of enemies",
      871,
      6,
    ),
    game(
      now,
      "dust-circuit",
      "Dust Circuit",
      AUTHORS.mei,
      "16bit",
      "kart",
      "A top-down kart race around a dirt track with three laps",
      655,
      11,
    ),
    game(
      now,
      "moss-stack",
      "Moss Stack",
      AUTHORS.tunde,
      "handheld",
      "blocks",
      "Neon Stack, but the blocks grow moss and fall slower",
      412,
      3,
      {
        slug: "neon-stack",
        title: "Neon Stack",
        author: { username: "playerone", display_name: "Player One" },
      },
    ),
    game(
      now,
      "cloud-hopper",
      "Cloud Hopper",
      AUTHORS.mei,
      "modern",
      "platformer",
      "A platformer across moving clouds with a double jump",
      388,
      2,
    ),
    game(
      now,
      "comet-guard",
      "Comet Guard",
      AUTHORS.ada,
      "8bit",
      "shooter",
      "Defend a base from falling comets with one cannon",
      240,
      20,
    ),
    game(
      now,
      "harbour-dash",
      "Harbour Dash",
      AUTHORS.kofi,
      "modern",
      "kart",
      "A boat race around a harbour against the clock",
      97,
      1,
    ),
  ];

  const scores: ArcadeState["scores"] = {
    "neon-stack": [
      { player: AUTHORS.mei, value: 48200 },
      { player: AUTHORS.ada, value: 41750 },
      { player: AUTHORS.kofi, value: 39900 },
      { player: AUTHORS.tunde, value: 21300 },
    ].map((row, index) => ({
      ...row,
      submitted_at: iso(now - (index + 1) * DAY),
    })),
    "coin-run": [
      { player: AUTHORS.kofi, value: 320 },
      { player: AUTHORS.tunde, value: 275 },
    ].map((row, index) => ({
      ...row,
      submitted_at: iso(now - (index + 2) * DAY),
    })),
  };

  return { games, scores, reports: [] };
}

export function buildSeed(now: number): MockDb {
  return { seededAt: now, seq: 0, users: {}, arcade: seededArcade(now) };
}
