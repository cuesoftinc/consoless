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
| P-07 | Date idiom per surface class | relative for activity and versions | Ratified S-15; bookings are retired (C-2) |
| P-08 | Command palette | none | |
| P-09 | Data store | postgres (Aiven, database `consoless`); `REDIS_DB` index — | Ratified S-4; the shared Redis index is assigned when `api/common` is provisioned |
| P-10 | Services and host ports | web 3000; api/common 8080, api/generate 8081, api/verify 8082 when built; api/intake 8083 (Stage 2) and api/build 8084 (Stage 3) | Ports in the order services were added (S-1) |
| P-11 | Service transport | web → api/common `http` (through the `/api/v1` proxy); api/common ↔ api/generate and api/verify `pubsub` (the shared Kafka bus, so services never call each other synchronously); data-free wake-ups over `http` | Ratified S-3, S-12, S-14 |
| P-12 | KYC tier contents | Tier 0: Google identity; tier 1: a one-time 16-or-older attestation for creators (playing a published game needs no account); tier 2 n/a | Ratified S-15; the wallet is retired (C-2) |
| P-13 | Destructive-confirm token | The user's username | |
| P-14 | Discord channel | #consoless-lab | Exists on the CueLABS server |
| P-15 | Lint extensions | `src/legacy/**` ignored (quarantined code is not linted); `no-restricted-imports` bans `src/legacy` (quarantine), `@mui/*` and `@emotion/*` (styled kits are pruned), `dayjs` and `moment` (date-fns is the standard) and chart libraries such as `recharts` (charts are bespoke SVG from tokens); `eslint-plugin-testing-library` React rules on `src/**/*.test.{ts,tsx}` (test hygiene) | Additions to the Next core-web-vitals and TypeScript base |
| P-16 | Mobile application ID | n/a | Mobile is planned |
| P-17 | Messaging | shared bus; Kafka user `consoless`; groups `consoless-common`, `consoless-generate`, `consoless-verify` (`consoless-build` in Stage 3); not the keep-alive owner | Ratified S-3 |

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

### S-1 to S-15 — System design v1 (ratified 2026-10-30)

The full text, reasons and alternatives are in
[`system-design.md`](system-design.md) §13.

| ID | Decision |
| --- | --- |
| S-1 | Services: `web`, `api/common` (Go, CRUD owner), `api/generate` (Python), `api/verify` (Python); later `api/intake` (Node, Stage 2) and `api/build` (Stage 3) |
| S-2 | `generate` and `verify` are separate services so untrusted code never runs beside model credentials; moderation runs inside `generate` |
| S-3 | The shared CueLABS Kafka bus (lanes `cuelabs.requests`, `cuelabs.results`, `cuelabs.uploads`); Consoless is not the keep-alive owner (P-11, P-17) |
| S-4 | Aiven Postgres is the data store (P-09) |
| S-5 | Game format: a manifest plus a `path → sha256` file tree, files content-addressed in `blobs/`; one format for 2D, 3D and desktop |
| S-6 | Games are served only from `play.cuesoft.io`, a sibling host of `consoless.cuesoft.io`, from a dedicated play bucket behind signed Cloud CDN requests. Every response carries `Content-Security-Policy: sandbox allow-scripts`, and no Cuesoft site may set a `Domain=cuesoft.io` cookie |
| S-7 | The game runtime never calls the API; scores reach the host page by `postMessage` |
| S-8 | Every version passes `verify` before it can be previewed; at most 3 attempts, counted by `api/common` |
| S-9 | Generation requires sign-in; per-user quotas and per-project locks live in shared Redis, enforced by `api/common` |
| S-10 | Vertex AI (Gemini) over ADC, in `api/generate` only; self-hosters bring their own key |
| S-11 | The Studio polls status rows; no token streaming in Stage 1 |
| S-12 | Every service runs at min 0 with wake-ups; sweeps are Cloud Scheduler jobs |
| S-13 | The MIT engine lives in a top-level `engine/` workspace in this repository (a documented deviation in `.cuelabs/project.yaml`) |
| S-14 | The browser reaches the API through the web server's `/api/v1` proxy |
| S-15 | P-07 and P-12 take the values above: creators attest they are 16 or older once after sign-in; players need no account |
