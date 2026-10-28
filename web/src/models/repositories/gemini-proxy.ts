import "server-only";

import { getGeminiProxyApiKey, getGeminiProxyUrl } from "@/config/server-env";

const PROXY_TIMEOUT_MS = 20_000;

export class GeminiProxyError extends Error {
  constructor(readonly reason: string) {
    super(`gemini_proxy_${reason}`);
    this.name = "GeminiProxyError";
  }
}

export interface GenerateTextRequest {
  prompt: string;
  systemPrompt?: string;
}

/**
 * Calls the Cuesoft Gemini proxy, which fixes the model itself. Server-only:
 * the key never leaves the route handlers.
 */
export async function generateText({
  prompt,
  systemPrompt,
}: GenerateTextRequest): Promise<string> {
  const key = getGeminiProxyApiKey();
  if (!key) throw new GeminiProxyError("missing_key");

  let response: Response;
  try {
    response = await fetch(getGeminiProxyUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
      },
      body: JSON.stringify(
        systemPrompt ? { prompt, systemPrompt } : { prompt },
      ),
      cache: "no-store",
      signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
    });
  } catch {
    throw new GeminiProxyError("unreachable");
  }

  if (!response.ok) throw new GeminiProxyError(`status_${response.status}`);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new GeminiProxyError("invalid_json");
  }

  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as { text?: unknown }).text !== "string"
  ) {
    throw new GeminiProxyError("invalid_shape");
  }
  return (data as { text: string }).text;
}
