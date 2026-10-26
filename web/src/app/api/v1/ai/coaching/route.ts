import { NextResponse } from "next/server";

import {
  COACHING_FALLBACK,
  COACHING_SYSTEM_PROMPT,
  coachingPrompt,
  parseCoachingInput,
  parseCoachingText,
} from "@/lib/ai";
import { guardPaidRoute, invalidArgument, readJsonBody } from "@/lib/request";
import { generateText } from "@/models/repositories/gemini-proxy";

export async function POST(request: Request) {
  const refused = guardPaidRoute(request);
  if (refused) return refused;
  const input = parseCoachingInput(await readJsonBody(request));
  if (!input) {
    return invalidArgument(
      "gameTitle (1-120 chars) and playerContext (1-500 chars) are required.",
    );
  }

  try {
    const text = await generateText({
      prompt: coachingPrompt(input),
      systemPrompt: COACHING_SYSTEM_PROMPT,
    });
    const coaching = parseCoachingText(text);
    if (coaching) return NextResponse.json(coaching);
    console.error(JSON.stringify({ event: "ai_coaching_unparseable" }));
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "ai_coaching_failed",
        reason: error instanceof Error ? error.message : "unknown",
      }),
    );
  }
  return NextResponse.json(COACHING_FALLBACK);
}
