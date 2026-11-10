import {
  jsonError,
  jsonOk,
  notFound,
  readJson,
  type RouteContext,
} from "@/mocks/http";
import { getDb } from "@/mocks/store";
import type { ReportReason } from "@/models/types";

const REASONS: ReportReason[] = ["copied", "inappropriate", "broken", "other"];

/**
 * POST /arcade/games/{slug}/reports: report a game (PRD section 7).
 * Anyone can report; no account is needed.
 */
export async function POST(
  req: Request,
  { params }: RouteContext<{ slug: string }>,
) {
  const { slug } = await params;
  const db = getDb();
  if (!db.arcade.games.some((game) => game.slug === slug)) {
    return notFound("game");
  }
  const body = await readJson<{ reason?: unknown; details?: unknown }>(req);
  const reason = REASONS.find((item) => item === body?.reason);
  const details = typeof body?.details === "string" ? body.details.trim() : "";
  if (!reason) {
    return jsonError(422, "validation_failed", "Choose a reason.", {
      field: "reason",
    });
  }
  if (details.length > 500) {
    return jsonError(
      422,
      "validation_failed",
      "Details are 500 characters at most.",
      { field: "details" },
    );
  }
  db.arcade.reports.push({ slug, reason, details });
  return jsonOk({ received: true }, 202);
}
