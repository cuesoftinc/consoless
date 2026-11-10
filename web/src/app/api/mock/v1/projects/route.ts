import {
  isResponse,
  jsonError,
  jsonOk,
  paginate,
  readJson,
  requireUser,
} from "@/mocks/http";
import { nextId } from "@/mocks/store";
import {
  publicGeneration,
  startGeneration,
  studioOf,
  syncAll,
} from "@/mocks/studio";
import type { ConsoleStyleId, Project, ProjectArtwork } from "@/models/types";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/** GET /projects: the caller's projects, most recently updated first. */
export async function GET(req: Request) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;

  const url = new URL(req.url);
  // TEST_MODE only: `?fail=1` answers 500 so the error state can be driven.
  if (url.searchParams.get("fail") === "1") {
    return jsonError(500, "internal", "Something went wrong on our side.");
  }
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit")) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  syncAll(auth.state, Date.now());
  const sorted = [...auth.state.projects].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  );
  const page = paginate(sorted, url.searchParams.get("cursor"), limit);
  if (!page) {
    return jsonError(422, "invalid_cursor", "That page no longer exists.");
  }
  return jsonOk(page);
}

const STYLES: ConsoleStyleId[] = [
  "handheld",
  "8bit",
  "16bit",
  "arcade",
  "modern",
];

/** Picks sample artwork from the words of the prompt. */
function artworkFor(prompt: string): ProjectArtwork {
  const text = prompt.toLowerCase();
  if (/(race|kart|car|boat|track)/.test(text)) return "kart";
  if (/(shoot|space|ship|enem|comet)/.test(text)) return "shooter";
  if (/(platform|jump|coin|run)/.test(text)) return "platformer";
  return "blocks";
}

const STOP_WORDS =
  /^(the|and|with|for|you|where|that|which|your|who|from|into|onto|over|against)$/i;

/** A short title from the first words of the prompt. */
function titleFor(prompt: string): string {
  const words = prompt
    .replace(/\[[a-z]+\]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.test(word))
    .slice(0, 3);
  const title = words
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return title || "Untitled game";
}

/**
 * POST /projects: creates a project from a first prompt and starts its
 * first generation. Needs the 16-or-older attestation (S-15) and a
 * generation left today (S-21).
 */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  const { me } = auth.state;
  if (!me.creator_attested_at) {
    return jsonError(
      403,
      "attestation_required",
      "Confirm you are 16 or older before making games.",
    );
  }
  const body = await readJson<{ prompt?: unknown; style_id?: unknown }>(req);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const style = STYLES.find((item) => item === body?.style_id);
  if (prompt.length < 1 || prompt.length > 2000) {
    return jsonError(
      422,
      "validation_failed",
      "A prompt is between 1 and 2,000 characters.",
      { field: "prompt" },
    );
  }
  if (!style) {
    return jsonError(422, "validation_failed", "Choose a console style.", {
      field: "style_id",
    });
  }
  if (me.quota.used >= me.quota.limit) {
    return jsonError(
      429,
      "quota_exhausted",
      "You have used today's generations. They reset tomorrow.",
    );
  }

  const now = Date.now();
  const iso = new Date(now).toISOString();
  const project: Project = {
    id: nextId("prj"),
    title: titleFor(prompt),
    style_id: style,
    prompt,
    status: "draft",
    slug: null,
    version_count: 0,
    head_version_id: null,
    artwork: artworkFor(prompt),
    created_at: iso,
    updated_at: iso,
  };
  auth.state.projects.push(project);
  me.quota.used += 1;
  const generation = startGeneration(
    project,
    studioOf(auth.state, project),
    prompt,
    now,
  );
  return jsonOk({ project, generation: publicGeneration(generation) }, 201);
}
