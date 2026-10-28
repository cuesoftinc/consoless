# Consoless Decisions

The ratification register for Consoless. Other docs defer to this file.

## Standard parameters

Values Consoless chooses where the CueLABS™ standard leaves a choice. The
IDs and allowed values are defined in `product-decisions.md` in the
CueLABS engineering standards. Leave a value unset until it is
decided; a parameter whose surface is `absent` or `planned` may read `n/a`.

| ID | Parameter | Value | Notes |
|----|-----------|-------|-------|
| P-01 | Product slug | consoless | Matches `name` in `.cuelabs/project.yaml` |
| P-02 | Display name | Consoless | |
| P-03 | Marketing product slot | Consoles | |
| P-04 | Default theme | dark | Gaming product; the prototype is already dark |
| P-05 | Playwright port | 3150 | Siblings use 3100, 3131 and 3311 |
| P-06 | Settings IA | tabs | |
| P-07 | Date idiom per surface class | relative for activity, absolute for bookings | Rentals are time-bound |
| P-08 | Command palette | none | |
| P-09 | Data store | n/a | Backend is planned |
| P-10 | Services and host ports | web 3000; api/common 8080 when built | The standard's defaults |
| P-11 | Service transport | n/a | Backend is planned |
| P-12 | KYC tier contents | Tier 1: username, email, date of birth (16 or older, enforced at sign-up); tier 2 n/a | No real payments yet; the wallet is mock |
| P-13 | Destructive-confirm token | The user's username | |
| P-14 | Discord channel | #consoless-lab | Exists on the CueLABS server |
| P-15 | Lint extensions | `src/legacy/**` ignored (quarantined code is not linted); `no-restricted-imports` bans `src/legacy` (quarantine), `@mui/*` and `@emotion/*` (styled kits are pruned), `dayjs` and `moment` (date-fns is the standard) and chart libraries such as `recharts` (charts are bespoke SVG from tokens); `eslint-plugin-testing-library` React rules on `src/**/*.test.{ts,tsx}` (test hygiene) | Additions to the Next core-web-vitals and TypeScript base |
| P-16 | Mobile application ID | n/a | Mobile is planned |

## Decisions

Record each ratified decision below with a stable ID, the decision, and its
reason.
