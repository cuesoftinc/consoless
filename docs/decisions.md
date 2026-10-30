# Consoless — Decisions

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
| P-07 | Date idiom per surface class | relative for activity, absolute for bookings | Under review: bookings are retired (C-2); system design S-15 proposes a new value |
| P-08 | Command palette | none | |
| P-09 | Data store | n/a | Backend is planned |
| P-10 | Services and host ports | web 3000; api/common 8080 when built | The standard's defaults |
| P-11 | Service transport | n/a | Backend is planned |
| P-12 | KYC tier contents | Tier 1: username, email, date of birth (16 or older, enforced at sign-up); tier 2 n/a | Under review: the wallet is retired (C-2) and the sign-up form that checked age is replaced by Google sign-in (C-3); system design S-15 and PRD open question "Minimum Age" |
| P-13 | Destructive-confirm token | The user's username | |
| P-14 | Discord channel | #consoless-lab | Exists on the CueLABS server |
| P-15 | Lint extensions | `src/legacy/**` ignored (quarantined code is not linted); `no-restricted-imports` bans `src/legacy` (quarantine), `@mui/*` and `@emotion/*` (styled kits are pruned), `dayjs` and `moment` (date-fns is the standard) and chart libraries such as `recharts` (charts are bespoke SVG from tokens); `eslint-plugin-testing-library` React rules on `src/**/*.test.{ts,tsx}` (test hygiene) | Additions to the Next core-web-vitals and TypeScript base |
| P-16 | Mobile application ID | n/a | Mobile is planned |

## Decisions

Record each ratified decision below with a stable ID, the decision, and its
reason.

### C-1 — Consoless is a prompt-to-game platform

Consoless changes from a console-rental concept to an open-source platform
where people make games by describing them, as set out in the Consoless PRD.
The engine, runtime and game format are MIT-licensed; CueLABS™ runs the
hosted service. Delivery is staged: retro and 2D in the browser, then 3D,
then installable desktop games. The rental scope is replaced.

### C-2 — The rental prototype is retired

Phase 0 removes the screens and code that only served renting and
streaming: console rentals, the active streaming session, the crypto and
fiat wallet, tournaments, the commercial game library with linked platform
accounts, and the AI coaching and lobby routes with their Gemini proxy
client. The hub and the leaderboard stay (the PRD reuses the leaderboard).
Reason: none of it is in the PRD, and the library and seed data used
trademarked game names (PRD section 7). Model calls move to the backend in
the system design (`docs/system-design.md`).

### C-3 — Google sign-in only

The email and password form is replaced by a single "Continue with Google"
call to action behind the `AuthProvider` seam (PRD decision X-1, the
CueLABS identity policy). `TestModeAuthProvider` is the only provider
until the backend lands; the Firebase provider follows with `api/common`.

### C-4 — UI is rebuilt only from the Figma design

The new landing page, Studio, Arcade, My Games and console-style frames are
designed in Figma first. Until those designs are signed off, web changes are
limited to clean-up and copy within the existing layouts. Engine and backend
work may proceed in parallel (system design §14, phase D).
