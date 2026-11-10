# Consoless — Roadmap

> The ordered plan, taken from the migration plan in
> [`system-design.md`](system-design.md) §14. Each phase lists what it
> delivers and where it stands. Markers: **[Current]** is on `main` today,
> **[Planned]** is not started.

Consoless is delivered in three stages: retro and 2D games in the browser,
then 3D, then installable desktop games (decision C-1). The phases below are
the steps to get there.

## Where things stand

- **[Current]** Phase 0, Phase D and the web half of Phases 1b and 1c are
  done. Every Stage 1 screen runs against the in-app mock API.
- **[Planned]** The engine and the backend services (Phase 1a) come next.
  Until they exist, games cannot be played: the console frame shows a
  picture of the game.

## Phase 0 — Clean-up **[Current]**

The console-rental prototype is retired (C-2): rentals, the streaming
session, the wallet, tournaments and the commercial game library are gone.
Sign-in is a single "Continue with Google" button (C-3).

## Phase D — Designs **[Current]**

The Figma designs for all three stages, recorded in
[`design.md`](design.md) and [`pages.md`](pages.md), were accepted as the
basis for the web build (C-5). The independent design QA loop is still owed.

## Phase 1a — Engine and services **[Planned]**

| Item | Requirement |
| --- | --- |
| `engine/`: the TypeScript runtime, the game format and the console styles as data | CON-003, CON-004 |
| `api/common` (Go): users, projects, versions, publishing, scores and quotas | CON-001, CON-002 |
| `api/generate` (Python): every model call, the content policy and moderation | CON-001 |
| `api/verify` (Python): type-checks and plays each version headlessly | CON-004 |
| The shared Kafka bus between them | S-3 |

**Exit criteria:** a hand-written game in the format runs headlessly in
`api/verify`, and a prompt produces a checked version through the API.

## Phase 1b — The Studio **[Current on mocks]**

| Item | Requirement | Status |
| --- | --- | --- |
| New game, chat, build status, versions, restore, style switch, code view with checked edits | CON-001, CON-002, CON-003, CON-007 | **[Current]** on the mock API |
| The play origin and playing in the preview | CON-004, CON-005 | **[Planned]**, needs Phase 1a |
| The Studio on the real API | — | **[Planned]**, needs Phase 1a |

**Exit criteria:** a prompt produces a checked, playable version in the
Studio preview.

## Phase 1c — Publishing and the Arcade **[Current on mocks]**

| Item | Requirement | Status |
| --- | --- | --- |
| The Arcade, game pages, share, report, remix, leaderboards | CON-006, CON-008 | **[Current]** on the mock API |
| My Games, Settings, account deletion | CON-014 | **[Current]** on the mock API |
| Publishing through review | CON-006 | **[Current]** up to "in review"; the review outcome is **[Planned]** |
| Export, the in-app privacy page, score submission from a running game | CON-007, CON-014, CON-008 | **[Planned]** |

**Exit criteria:** a published game plays from a public link and records
scores.

## Phase 2 — 3D **[Planned]**

3D in the engine, `api/intake` for uploads, asset generation, multi-file
projects, and online multiplayer through `api/realtime` (S-17, S-26).
Covers CON-009 to CON-011.

**Exit criteria:** a 3D prompt runs at a stable frame rate on a mid-range
laptop.

## Phase 3 — Installable games **[Planned]**

`api/build`, desktop installers for Windows, macOS and Linux, and
collaboration. Covers CON-012 and CON-013.

**Exit criteria:** a Stage 1 game exports to all three desktop platforms
unchanged.
