// Typed access to public (browser-exposed) environment variables.
// NEXT_PUBLIC_* values are inlined at build time.
const testMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

export const env = {
  /**
   * TEST_MODE (web standard): NEXT_PUBLIC_TEST_MODE=true points the repository
   * client at the in-app mock server and lets the Google sign-in button open
   * the dashboard without Firebase.
   */
  testMode,
  /**
   * Base path for the repository client. The mock server mirrors the API
   * path for path; outside TEST_MODE the browser calls the web server's
   * /api/v1 proxy (S-14).
   */
  apiBase: testMode ? "/api/mock/v1" : "/api/v1",
  /**
   * Endpoint of the shared analytics service. Unset by default: events then
   * stay on the in-page queue (S-23).
   */
  analyticsUrl: process.env.NEXT_PUBLIC_UPSTAT_EVENTS_URL || undefined,
} as const;
