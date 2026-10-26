import { NextResponse } from "next/server";

import { parseLobbyInput } from "@/lib/ai";
import { invalidArgument, readJsonBody } from "@/lib/request";
import { MOCK_LOBBY_CHATTER } from "@/mocks/ai";

export async function POST(request: Request) {
  if (!parseLobbyInput(await readJsonBody(request))) {
    return invalidArgument("gameTitle (1-120 chars) is required.");
  }
  return NextResponse.json({ text: MOCK_LOBBY_CHATTER });
}
