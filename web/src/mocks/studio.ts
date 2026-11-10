import type {
  Check,
  ConsoleStyleId,
  Generation,
  Project,
  ProjectFile,
  Version,
  VersionDetail,
} from "@/models/types";
import type { UserState } from "./seed";
import { nextId } from "./store";

/**
 * The Studio's mock engine: generations move through their steps by elapsed
 * time, so polling the status row behaves as it will against the real API.
 *
 * Two prompts drive the unhappy paths in TEST_MODE: a prompt containing
 * `[fail]` fails its checks, and one containing `[refuse]` is refused.
 */
export const TIMING = {
  /** Queued until this many ms after the request. */
  queued: 500,
  /** Generating until this many ms after the request. */
  generating: 1500,
  /** Checking until this many ms after the request. */
  checking: 2200,
  /** A hand edit is checked for this long. */
  check: 700,
} as const;

export const MAX_ATTEMPTS = 3;
export const GAME_FILE = "game.ts";

type Outcome = "ready" | "failed" | "refused";

export interface StoredGeneration extends Generation {
  requested_ms: number;
  outcome: Outcome;
  settled: boolean;
}

export interface StoredCheck extends Check {
  requested_ms: number;
  content: string;
  settled: boolean;
}

export interface StudioState {
  versions: VersionDetail[];
  generations: StoredGeneration[];
  checks: StoredCheck[];
}

const HOUR = 60 * 60 * 1000;

const REFINEMENTS = [
  { prompt: "Make it a little faster", summary: "Made the game faster" },
  { prompt: "Add a score counter", summary: "Added a score counter" },
  { prompt: "Change the colours", summary: "Changed the colours" },
  { prompt: "Add a pause screen", summary: "Added a pause screen" },
  { prompt: "Make the level longer", summary: "Made the level longer" },
];

export function sampleCode(
  title: string,
  style: ConsoleStyleId,
  version: number,
): string {
  return [
    'import { defineGame } from "@consoless/engine";',
    "",
    "export default defineGame({",
    `  title: ${JSON.stringify(title)},`,
    `  style: ${JSON.stringify(style)},`,
    "",
    "  setup(game) {",
    `    game.speed = ${version + 1};`,
    "    game.score = 0;",
    '    game.spawn("player", { x: 4, y: 12 });',
    "  },",
    "",
    "  update(game, input) {",
    '    if (input.pressed("left")) game.move("player", -1, 0);',
    '    if (input.pressed("right")) game.move("player", 1, 0);',
    '    if (input.pressed("action")) game.act("player");',
    "    game.tick();",
    "  },",
    "});",
    "",
  ].join("\n");
}

function summaryOf(prompt: string): string {
  const text = prompt.replace(/\s+/g, " ").trim();
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
}

function addVersion(
  project: Project,
  studio: StudioState,
  source: Version["source"],
  summary: string,
  files: ProjectFile[],
  at: number,
): VersionDetail {
  const version: VersionDetail = {
    id: nextId("ver"),
    project_id: project.id,
    number: studio.versions.length + 1,
    source,
    summary,
    created_at: new Date(at).toISOString(),
    files,
  };
  studio.versions.push(version);
  project.head_version_id = version.id;
  project.version_count = studio.versions.length;
  project.updated_at = version.created_at;
  return version;
}

function readyGeneration(
  project: Project,
  prompt: string,
  version: VersionDetail,
  message: string,
): StoredGeneration {
  const at = new Date(version.created_at).getTime();
  return {
    id: nextId("gen"),
    project_id: project.id,
    prompt,
    status: "ready",
    attempt: 1,
    max_attempts: MAX_ATTEMPTS,
    reason_code: null,
    message,
    version_id: version.id,
    requested_at: version.created_at,
    updated_at: version.created_at,
    requested_ms: at,
    outcome: "ready",
    settled: true,
  };
}

const FIRST_MESSAGE =
  "I built your game. The arrow keys move and Space is the action button.";

/** A project's Studio state, seeded from its version count on first use. */
export function studioOf(state: UserState, project: Project): StudioState {
  const existing = state.studio[project.id];
  if (existing) return existing;

  const studio: StudioState = { versions: [], generations: [], checks: [] };
  state.studio[project.id] = studio;
  const total = project.version_count;
  const updatedAt = project.updated_at;
  const end = new Date(updatedAt).getTime();
  const remixed = project.title.endsWith(" remix") && total === 1;

  for (let index = 0; index < total; index += 1) {
    const at = end - (total - 1 - index) * HOUR;
    const step = REFINEMENTS[(index - 1) % REFINEMENTS.length];
    const first = index === 0;
    const version = addVersion(
      project,
      studio,
      remixed ? "remixed" : "generated",
      first ? "First version" : step.summary,
      [
        {
          path: GAME_FILE,
          content: sampleCode(project.title, project.style_id, index + 1),
        },
      ],
      at,
    );
    if (!remixed) {
      studio.generations.push(
        readyGeneration(
          project,
          first ? project.prompt : step.prompt,
          version,
          first ? FIRST_MESSAGE : `Done. ${step.summary}.`,
        ),
      );
    }
  }
  // Seeding must not move the project in the list.
  project.updated_at = updatedAt;
  return studio;
}

export function startGeneration(
  project: Project,
  studio: StudioState,
  prompt: string,
  now: number,
): StoredGeneration {
  const iso = new Date(now).toISOString();
  const generation: StoredGeneration = {
    id: nextId("gen"),
    project_id: project.id,
    prompt,
    status: "queued",
    attempt: 1,
    max_attempts: MAX_ATTEMPTS,
    reason_code: null,
    message: null,
    version_id: null,
    requested_at: iso,
    updated_at: iso,
    requested_ms: now,
    outcome: prompt.includes("[refuse]")
      ? "refused"
      : prompt.includes("[fail]")
        ? "failed"
        : "ready",
    settled: false,
  };
  studio.generations.push(generation);
  return generation;
}

function settleGeneration(
  state: UserState,
  project: Project,
  studio: StudioState,
  generation: StoredGeneration,
  now: number,
): void {
  if (generation.settled) return;
  const elapsed = now - generation.requested_ms;
  const finish = (status: Generation["status"]) => {
    generation.status = status;
    generation.settled = true;
    generation.updated_at = new Date(now).toISOString();
  };
  const refund = () => {
    state.me.quota.used = Math.max(0, state.me.quota.used - 1);
  };

  if (elapsed < TIMING.queued) {
    generation.status = "queued";
  } else if (generation.outcome === "refused") {
    // The policy check runs before any code is written.
    generation.reason_code = "content_policy";
    generation.message =
      "This prompt breaks the content rules, so nothing was built. It did not use a generation.";
    refund();
    finish("refused");
  } else if (elapsed < TIMING.generating) {
    generation.status = "generating";
  } else if (elapsed < TIMING.checking) {
    generation.status = "checking";
  } else if (generation.outcome === "failed") {
    generation.attempt = MAX_ATTEMPTS;
    generation.reason_code = "check_failed";
    refund();
    finish("failed");
  } else {
    const first = studio.versions.length === 0;
    const version = addVersion(
      project,
      studio,
      "generated",
      first ? "First version" : summaryOf(generation.prompt),
      [
        {
          path: GAME_FILE,
          content: sampleCode(
            project.title,
            project.style_id,
            studio.versions.length + 1,
          ),
        },
      ],
      now,
    );
    generation.version_id = version.id;
    generation.message = first
      ? FIRST_MESSAGE
      : "Done. I changed the game as you asked.";
    finish("ready");
  }
}

/** Finds an unbalanced brace: the mock's stand-in for the type check. */
function checkContent(content: string): Check["error"] {
  let depth = 0;
  const lines = content.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    for (const char of lines[index]) {
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth < 0) {
        return { path: GAME_FILE, line: index + 1, message: "Unexpected '}'." };
      }
    }
  }
  return depth > 0
    ? { path: GAME_FILE, line: lines.length, message: "Expected '}'." }
    : null;
}

export function startCheck(
  project: Project,
  studio: StudioState,
  content: string,
  now: number,
): StoredCheck {
  const check: StoredCheck = {
    id: nextId("chk"),
    project_id: project.id,
    status: "checking",
    error: null,
    version_id: null,
    requested_ms: now,
    content,
    settled: false,
  };
  studio.checks.push(check);
  return check;
}

function settleCheck(
  project: Project,
  studio: StudioState,
  check: StoredCheck,
  now: number,
): void {
  if (check.settled || now - check.requested_ms < TIMING.check) return;
  check.settled = true;
  check.error = checkContent(check.content);
  if (check.error) {
    // A failed edit never becomes a version (CON-007).
    check.status = "failed";
    return;
  }
  const version = addVersion(
    project,
    studio,
    "edited",
    "Edited the code by hand",
    [{ path: GAME_FILE, content: check.content }],
    now,
  );
  check.status = "passed";
  check.version_id = version.id;
}

/** Brings every in-flight generation and check up to `now`. */
export function syncStudio(
  state: UserState,
  project: Project,
  now: number,
): StudioState {
  const studio = studioOf(state, project);
  for (const generation of studio.generations) {
    settleGeneration(state, project, studio, generation, now);
  }
  for (const check of studio.checks) settleCheck(project, studio, check, now);
  return studio;
}

/** Brings every project of a user up to `now`. */
export function syncAll(state: UserState, now: number): void {
  for (const project of state.projects) syncStudio(state, project, now);
}

export function restoreVersion(
  project: Project,
  studio: StudioState,
  source: VersionDetail,
  now: number,
): VersionDetail {
  return addVersion(
    project,
    studio,
    "restored",
    `Restored version ${source.number}`,
    source.files.map((file) => ({ ...file })),
    now,
  );
}

/** The wire shape: no bookkeeping fields. */
export function publicGeneration(generation: StoredGeneration): Generation {
  const { requested_ms, outcome, settled, ...wire } = generation;
  void requested_ms;
  void outcome;
  void settled;
  return wire;
}

export function publicCheck(check: StoredCheck): Check {
  const { id, project_id, status, error, version_id } = check;
  return { id, project_id, status, error, version_id };
}

export function publicVersion(version: VersionDetail): Version {
  const { files, ...wire } = version;
  void files;
  return wire;
}
