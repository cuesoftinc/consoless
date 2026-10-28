import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Vitest: the single unit/integration runner; tests co-locate under src/**.
 * jsdom by default (components); server-side suites pin
 * `@vitest-environment node` per file. `globals` enables RTL auto-cleanup.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // Repo-specific: route handlers import `server-only`, which Next resolves
  // at build time; tests alias it to an empty module.
  resolve: {
    alias: {
      "server-only": fileURLToPath(
        new URL("./vitest.server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", "src/legacy/**", "e2e/**"],
    env: {
      NEXT_PUBLIC_TEST_MODE: "true",
    },
  },
});
