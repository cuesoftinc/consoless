import "server-only";

export const GEMINI_PROXY_URL = "https://gemini-proxy.cuesoft.io";

/** Server-side key for the Cuesoft Gemini proxy; null when unset. */
export function getGeminiProxyApiKey(): string | null {
  return process.env.GEMINI_PROXY_API_KEY?.trim() || null;
}
