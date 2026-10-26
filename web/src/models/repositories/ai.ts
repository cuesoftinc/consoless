import {
  AI_INPUT_LIMITS,
  COACHING_FALLBACK,
  LOBBY_EMPTY_FALLBACK,
  LOBBY_ERROR_FALLBACK,
  isCoachingResponse,
} from "@/lib/ai";
import type { AIAssistanceResponse } from "@/models/types";
import { http } from "./client";

/** AI coaching for the active session; any failure yields the fallback tip. */
export async function getGameCoaching(
  gameTitle: string,
  playerContext: string,
): Promise<AIAssistanceResponse> {
  try {
    const data = await http.post<unknown>("/v1/ai/coaching", {
      gameTitle: gameTitle.slice(0, AI_INPUT_LIMITS.gameTitle),
      playerContext: playerContext.slice(0, AI_INPUT_LIMITS.playerContext),
    });
    return isCoachingResponse(data) ? data : COACHING_FALLBACK;
  } catch {
    return COACHING_FALLBACK;
  }
}

/** Hype line for the party chat when a friend joins the lobby. */
export async function getLobbyChatter(gameTitle: string): Promise<string> {
  try {
    const data = await http.post<{ text?: unknown }>("/v1/ai/lobby", {
      gameTitle: gameTitle.slice(0, AI_INPUT_LIMITS.gameTitle),
    });
    return typeof data?.text === "string" && data.text
      ? data.text
      : LOBBY_EMPTY_FALLBACK;
  } catch {
    return LOBBY_ERROR_FALLBACK;
  }
}
