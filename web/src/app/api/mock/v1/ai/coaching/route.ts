import { NextResponse } from "next/server";

import { parseCoachingInput } from "@/lib/ai";
import { invalidArgument, readJsonBody } from "@/lib/request";
import { MOCK_COACHING } from "@/mocks/ai";

export async function POST(request: Request) {
  if (!parseCoachingInput(await readJsonBody(request))) {
    return invalidArgument(
      "gameTitle (1-120 chars) and playerContext (1-500 chars) are required.",
    );
  }
  return NextResponse.json(MOCK_COACHING);
}
