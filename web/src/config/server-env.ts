import "server-only";

const DEFAULT_GEMINI_PROXY_URL = "https://gemini-proxy.cuesoft.io";

/** Gemini proxy endpoint; the hosted Cuesoft proxy when unset or empty. */
export function getGeminiProxyUrl(): string {
  return process.env.GEMINI_PROXY_URL?.trim() || DEFAULT_GEMINI_PROXY_URL;
}

/** Server-side key for the Cuesoft Gemini proxy; null when unset. */
export function getGeminiProxyApiKey(): string | null {
  return process.env.GEMINI_PROXY_API_KEY?.trim() || null;
}
