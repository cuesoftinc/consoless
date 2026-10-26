import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import testingLibrary from "eslint-plugin-testing-library";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/legacy/**",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/legacy/**", "@/legacy/**"],
              message:
                "src/legacy is quarantined (web-implementation.md); live code must not import it.",
            },
            {
              group: ["@mui/*", "@emotion/*"],
              message:
                "Styled kits are pruned org-wide; build from the token layer (Tailwind + design tokens).",
            },
            {
              group: ["dayjs", "moment"],
              message: "Use date-fns, the standard date library.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.test.{ts,tsx}"],
    ...testingLibrary.configs["flat/react"],
  },
]);

export default eslintConfig;
