import type { AIAssistanceResponse } from "@/models/types";

export const COACHING_FALLBACK: AIAssistanceResponse = {
  tip: "Stay focused and watch your health bar!",
  strategy: "Try to explore alternative routes.",
  relevantStats: [{ label: "Confidence", value: "High" }],
};

export const LOBBY_EMPTY_FALLBACK = "Ready to play!";
export const LOBBY_ERROR_FALLBACK = "Game on!";

export const AI_INPUT_LIMITS = {
  gameTitle: 120,
  playerContext: 500,
} as const;

export const COACHING_SYSTEM_PROMPT = [
  "You are an expert AI Gaming Coach. Keep advice concise, action-oriented, and encouraging. Format output as JSON.",
  'Reply with one JSON object and nothing else, shaped exactly as {"tip": string, "strategy": string, "relevantStats": [{"label": string, "value": string}]}.',
  '"tip" is a quick tactical tip, "strategy" is a broader strategic goal, and "relevantStats" lists 3 stats to track.',
].join("\n");

export interface CoachingInput {
  gameTitle: string;
  playerContext: string;
}

export interface LobbyInput {
  gameTitle: string;
}

export function coachingPrompt({
  gameTitle,
  playerContext,
}: CoachingInput): string {
  return `I am playing ${gameTitle}. The current situation is: ${playerContext}.
Provide a helpful coaching tip, a strategic recommendation, and 3 relevant stats to track.`;
}

export function lobbyPrompt({ gameTitle }: LobbyInput): string {
  return `Generate a short, hype message for a gaming lobby for the game ${gameTitle}. Under 15 words.`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

export function parseCoachingInput(body: unknown): CoachingInput | null {
  if (!isRecord(body)) return null;
  const gameTitle = boundedString(body.gameTitle, AI_INPUT_LIMITS.gameTitle);
  const playerContext = boundedString(
    body.playerContext,
    AI_INPUT_LIMITS.playerContext,
  );
  if (!gameTitle || !playerContext) return null;
  return { gameTitle, playerContext };
}

export function parseLobbyInput(body: unknown): LobbyInput | null {
  if (!isRecord(body)) return null;
  const gameTitle = boundedString(body.gameTitle, AI_INPUT_LIMITS.gameTitle);
  return gameTitle ? { gameTitle } : null;
}

export function isCoachingResponse(
  value: unknown,
): value is AIAssistanceResponse {
  if (!isRecord(value)) return false;
  if (typeof value.tip !== "string" || typeof value.strategy !== "string") {
    return false;
  }
  return (
    Array.isArray(value.relevantStats) &&
    value.relevantStats.every(
      (stat) =>
        isRecord(stat) &&
        typeof stat.label === "string" &&
        typeof stat.value === "string",
    )
  );
}

/** Reads the model's JSON reply, tolerating Markdown code fences around it. */
export function parseCoachingText(text: string): AIAssistanceResponse | null {
  let body = text.trim();
  const fenced = body.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) body = fenced[1];
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const parsed: unknown = JSON.parse(body.slice(start, end + 1));
    return isCoachingResponse(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
