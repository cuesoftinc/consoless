# Consoless — Pages

> **Status:** [Proposed] — this is the screen inventory of the Figma file
> [Consoless](https://www.figma.com/design/vy0wG6WXNLMq48GJgjUdHk), which
> awaits review and sign-off (decision C-4). The web app on `main` still
> shows the prototype's landing page, hub and leaderboard.

Screen names below are the frame names in the Figma file. `MI-n` refers to
the microinteraction catalog in [`design.md`](design.md) §4. `CON-nnn` refers
to the PRD requirements.

## Part A — Home

### Landing (`/`)

| Band | Content | Refs |
| --- | --- | --- |
| Navigation | Logo, Studio, Arcade, My Games, Docs, a GitHub "Star" action with no count, Sign in | — |
| Hero | "Describe it. Play it. Share it.", a filled prompt input, three starter prompts, a handheld console frame. Calls to action: Start building, Play in the Arcade, View on GitHub | MI-1 |
| How it works | Describe it, Play it, Keep changing it, Share it | CON-001, CON-002, CON-006 |
| From a sentence to a game | A sample of the Studio chat beside a console frame | CON-001 |
| Pick a look | The five Stage 1 console styles | CON-003 |
| Made on Consoless | Four game cards and a link to the Arcade | CON-006, MI-12 |
| Open source, with a hosted service | The MIT engine ("Self-hosting is free forever") and the hosted service (free, 20 generations a day, S-21) | — |
| Footer | Licence line, Docs, GitHub, Privacy, Terms, Support | — |

Frames: `Landing`, `Landing / Mobile`.

**Gap against the landing dual-audience rule.** [Proposed] The standard asks
the landing page to sell to contributor-developers (stack, interesting
problems, good first issues, community links) and to self-hosting adopters
(data ownership, one-line install, what ships), with an FAQ. The current
design covers the open-source and hosted pitch in one band. A contributor
band, a self-hosting band and an FAQ are not designed yet.

### Sign-in and the 16-or-older check

| Frame | Purpose | Refs |
| --- | --- | --- |
| `Sign in`, `Sign in / Loading`, `Sign in / Error` | Google is the only login method. Playing needs no account | C-3, MI-2 |
| `Age check`, `Age check / Confirmed` | A one-time attestation for creators | S-15, P-12 |
| `Age check / Under 16` | Explains that playing in the Arcade is still open | S-15 |

## Part B — App

### Studio (`/studio/{project}`)

Three columns: chat and prompt input, workspace (Preview and Code tabs), and
a side panel (Versions and Style tabs). The project bar carries the title,
the status badge, the daily quota, Export and Publish.

| Group | Frames | Refs |
| --- | --- | --- |
| First game | `Studio / New project`, `Queued`, `Generating`, `Checking`, `First version ready` | CON-001, MI-8, MI-9 |
| Refine and versions | `Studio / Ready`, `Retrying`, `Version preview`, `Compare versions` | CON-002, S-8 |
| Console styles | `Studio / Style picker` | CON-003, MI-11 |
| Problems and limits | `Studio / Failed`, `Refused`, `Original take on a named game`, `Quota used up`, `Generation paused`, `Loading` | S-8, S-21, S-25, PRD §7 |
| Code | `Studio / Code`, `Code edited`, `Code checking`, `Code check failed`, `Code saved` | CON-007 |
| Publish | `Studio / Publish dialog`, `In review`, `Published`, `Publish rejected` | CON-006 |
| Export | `Studio / Export dialog` | CON-007 |
| Layout checks | `Studio / Tablet`, `Studio / Ready (Dark theme)` | — |

Behaviour the frames record:

- The prompt input is disabled while a generation is in flight, when the
  daily quota is used up, and while generation is paused.
- A failed generation keeps the last version that passed its checks in the
  preview and offers "Try again".
- A prompt that names an existing game gets an original take and an
  explanation. "Refused" is for prompts that break the content policy, and
  does not use quota.
- A failed code edit never becomes a version. The error names the line and
  the user's text is kept.
- Publishing goes through review before the game is live.

### Arcade and play (`/arcade`, `/arcade/{slug}`)

| Group | Frames | Refs |
| --- | --- | --- |
| Arcade | `Arcade`, `Arcade / Loading`, `No results`, `Error`, `Empty`, `Arcade (Dark theme)` | CON-006, MI-6, MI-12 |
| Game page | `Game`, `Game / Signed out`, `Score saved`, `No scores yet`, `Loading`, `Remix of another game`, `Not available` | CON-004, CON-006, CON-008 |
| Share | `Game / Share dialog`, `Link copied` | CON-006, MI-5 |
| Report | `Game / Report dialog`, `Report sent` | PRD §7 |
| Remix | `Game / Remix dialog`, `Sign in to remix` | CON-006 |
| Leaderboard | `Leaderboard`, `Leaderboard / Empty`, `Leaderboard / Loading` | CON-008, S-18 |

Behaviour the frames record:

- Anyone can play. Only signed-in players can submit a score or remix.
- A remix credits the original game and its author.
- The game page shows the prompt that made the game.

### My Games and account

| Group | Frames | Refs |
| --- | --- | --- |
| Projects | `My Games`, `Loading`, `Empty`, `Error`, `Project menu`, `My Games (Dark theme)` | — |
| Rename and unpublish | `My Games / Rename`, `Unpublish` | — |
| Delete a project | `My Games / Delete`, `Delete confirmed`, `Deleted` | CON-014, P-13 |
| Settings (tabs, P-06) | `Settings / Profile`, `Appearance`, `Data and privacy`, `Delete account` | CON-014, P-13 |
| Account | `Account menu` | — |
| Privacy page | `Privacy` | CON-014 |
| Not found | `Not found` | — |

Destructive confirms ask the user to type their username (P-13).

### Stage 2 — 3D and assets

| Group | Frames | Refs |
| --- | --- | --- |
| 3D games | `3D / First version ready`, `Low frame rate`, `First version ready (Dark theme)` | CON-009 |
| Multi-file projects | `3D / Files changed`, `Code, multi-file` | CON-011 |
| Assets | `Assets`, `Empty`, `Loading`, `Generate dialog`, `Generating`, `Generation failed`, `Upload dialog` | CON-010 |
| Online multiplayer | `Multiplayer lobby (provisional)` | S-17, S-26 |

The multiplayer lobby is one provisional frame. It is redesigned once the
realtime design exists.

### Stage 3 — Export and collaboration

| Group | Frames | Refs |
| --- | --- | --- |
| Desktop builds | `Builds`, `Building`, `Ready`, `Failed`, `Loading`, `Ready (Dark theme)` | CON-012, S-20, MI-10 |
| People | `People`, `Only you`, `Invite error`, `Invite sent`, `Remove person` | CON-013 |
| Working together | `Versions with authors`, `Another editor is generating` | CON-013 |
| Invitations | `Invitation`, `Invitation / No longer valid` | CON-013 |

## Part C — Mobile

No mobile app is designed; the mobile surface is planned
(`.cuelabs/project.yaml`). Phone-width web frames are:

| Frame | Purpose | Refs |
| --- | --- | --- |
| `Landing / Mobile` | The landing page at 375 wide | — |
| `Arcade / Mobile` | The Arcade as a single column | PRD §5 |
| `Play / Mobile` | A game with on-screen touch controls | CON-005 |

## Requirement coverage

| Requirement | Designed in |
| --- | --- |
| CON-001 Prompt to playable game | Studio, first game |
| CON-002 Chat refinement and versions | Studio, refine and versions |
| CON-003 Console styles | Studio style picker, `ConsoleFrame` |
| CON-004 Sandboxed preview | No visible design; the preview and game page hold the sandboxed frame |
| CON-005 Input support | `TouchControls`, `Play / Mobile`, control hints under the preview |
| CON-006 Publish, share and remix | Studio publish, Arcade, game page |
| CON-007 Code view and project export | Studio code, export dialog |
| CON-008 Per-game leaderboards | Game page, leaderboard |
| CON-009 3D games | Stage 2, 3D games |
| CON-010 Asset generation and upload | Stage 2, assets |
| CON-011 Multi-file projects | Stage 2, multi-file projects |
| CON-012 Desktop export | Stage 3, desktop builds |
| CON-013 Collaboration | Stage 3, people and invitations |
| CON-014 Privacy disclosure | Privacy page, Settings data and privacy |
