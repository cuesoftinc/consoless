import { describe, expect, it } from "vitest";
import {
  AI_INPUT_LIMITS,
  COACHING_FALLBACK,
  isCoachingResponse,
  parseCoachingInput,
  parseCoachingText,
  parseLobbyInput,
} from "./ai";

const reply = {
  tip: "Dodge left.",
  strategy: "Save potions for the boss.",
  relevantStats: [{ label: "HP", value: "80%" }],
};

describe("parseCoachingText", () => {
  it("parses a bare JSON reply", () => {
    expect(parseCoachingText(JSON.stringify(reply))).toEqual(reply);
  });

  it("strips a json code fence", () => {
    const text = "```json\n" + JSON.stringify(reply, null, 2) + "\n```";
    expect(parseCoachingText(text)).toEqual(reply);
  });

  it("strips a fence without a language tag", () => {
    expect(
      parseCoachingText("```\n" + JSON.stringify(reply) + "\n```"),
    ).toEqual(reply);
  });

  it("finds the object inside surrounding prose", () => {
    expect(
      parseCoachingText(`Here you go: ${JSON.stringify(reply)} Good luck!`),
    ).toEqual(reply);
  });

  it("rejects malformed or mis-shaped replies", () => {
    expect(parseCoachingText("not json")).toBeNull();
    expect(parseCoachingText("{ broken")).toBeNull();
    expect(parseCoachingText(JSON.stringify({ tip: "x" }))).toBeNull();
    expect(
      parseCoachingText(
        JSON.stringify({ ...reply, relevantStats: [{ label: 1, value: "x" }] }),
      ),
    ).toBeNull();
  });
});

describe("input validation", () => {
  it("accepts trimmed strings within the limits", () => {
    expect(
      parseCoachingInput({ gameTitle: " Doom ", playerContext: "Level 1" }),
    ).toEqual({ gameTitle: "Doom", playerContext: "Level 1" });
    expect(parseLobbyInput({ gameTitle: "Doom" })).toEqual({
      gameTitle: "Doom",
    });
  });

  it("rejects missing, empty, non-string and oversized fields", () => {
    expect(parseCoachingInput(null)).toBeNull();
    expect(parseCoachingInput({ gameTitle: "Doom" })).toBeNull();
    expect(
      parseCoachingInput({ gameTitle: "  ", playerContext: "x" }),
    ).toBeNull();
    expect(parseLobbyInput({ gameTitle: 42 })).toBeNull();
    expect(
      parseLobbyInput({ gameTitle: "x".repeat(AI_INPUT_LIMITS.gameTitle + 1) }),
    ).toBeNull();
    expect(
      parseCoachingInput({
        gameTitle: "Doom",
        playerContext: "x".repeat(AI_INPUT_LIMITS.playerContext + 1),
      }),
    ).toBeNull();
  });
});

describe("COACHING_FALLBACK", () => {
  it("keeps the prototype's fallback tip", () => {
    expect(isCoachingResponse(COACHING_FALLBACK)).toBe(true);
    expect(COACHING_FALLBACK).toEqual({
      tip: "Stay focused and watch your health bar!",
      strategy: "Try to explore alternative routes.",
      relevantStats: [{ label: "Confidence", value: "High" }],
    });
  });
});
