import { NextResponse } from "next/server";

import {
  LOBBY_EMPTY_FALLBACK,
  LOBBY_ERROR_FALLBACK,
  lobbyPrompt,
  parseLobbyInput,
} from "@/lib/ai";
import { guardPaidRoute, invalidArgument, readJsonBody } from "@/lib/request";
import { generateText } from "@/models/repositories/gemini-proxy";

export async function POST(request: Request) {
  const refused = guardPaidRoute(request);
  if (refused) return refused;
  const input = parseLobbyInput(await readJsonBody(request));
  if (!input) return invalidArgument("gameTitle (1-120 chars) is required.");

  try {
    const text = (await generateText({ prompt: lobbyPrompt(input) })).trim();
    return NextResponse.json({ text: text || LOBBY_EMPTY_FALLBACK });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "ai_lobby_failed",
        reason: error instanceof Error ? error.message : "unknown",
      }),
    );
    return NextResponse.json({ text: LOBBY_ERROR_FALLBACK });
  }
}
