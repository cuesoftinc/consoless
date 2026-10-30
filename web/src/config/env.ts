// Typed access to public (browser-exposed) environment variables.
// NEXT_PUBLIC_* values are inlined at build time.
export const env = {
  /**
   * TEST_MODE (web-standard): NEXT_PUBLIC_TEST_MODE=true points the repository
   * client at the in-app mock routes (/api/mock) and lets the Google sign-in
   * button open the dashboard without Firebase.
   */
  testMode: process.env.NEXT_PUBLIC_TEST_MODE === "true",
} as const;
