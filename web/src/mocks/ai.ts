import type { AIAssistanceResponse } from "@/models/types";

/** Deterministic AI replies served by /api/mock in TEST_MODE. */
export const MOCK_COACHING: AIAssistanceResponse = {
  tip: "Hug the left wall to skip the first ambush.",
  strategy: "Bank resources early so the second act is a sprint, not a grind.",
  relevantStats: [
    { label: "Accuracy", value: "72%" },
    { label: "Deaths", value: "0" },
    { label: "Split Time", value: "01:42" },
  ],
};

export const MOCK_LOBBY_CHATTER =
  "Lobby is live. Let's make this run legendary!";
