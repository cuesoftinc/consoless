# Consoless — Pages

> **Status:** [Proposed] — this is the screen inventory of the Figma file
> [Consoless](https://www.figma.com/design/vy0wG6WXNLMq48GJgjUdHk), which
> is the basis for the web build (decision C-5). The web app has the
> Stage 1 screens built from it: the landing page, sign-in, the age check,
> the Arcade, My Games, the Studio and Settings.

Screen names below are the frame names in the Figma file. `MI-n` refers to
the microinteraction catalog in [`design.md`](design.md) §4. `CON-nnn` refers
to the PRD requirements.

## Part A — Home

### Landing (`/`)

[Current] Built in the web app. Sign-in happens at `/signin`; "Start
building" and "Try Cloud" lead there.

| Band | Content | Refs |
| --- | --- | --- |
| Navigation | The shared marketing navigation: logo, Features, Consoles, Docs, the GitHub star badge (a neutral "Star" in TEST_MODE), the theme toggle, Sign in, Try Cloud. A menu button below 768px | — |
| Hero | "Describe it. Play it. Share it.", a filled prompt input, three starter prompts, a handheld console frame. Calls to action: Start building, See what you can make, View on GitHub | MI-1 |
| How it works (`#features`) | Describe it, Play it, Keep changing it, Share it | CON-001, CON-002, CON-006 |
| From a sentence to a game (`#example`) | A sample of the Studio chat beside a console frame | CON-001 |
| Pick a look (`#consoles`) | The five Stage 1 console styles. Choosing one swaps the frame | CON-003 |
| What you can make (`#arcade`) | Four example games with the prompt that would make each. Examples only: no authors or play counts until the Arcade has real games | CON-006 |
| Built in the open (`#developers`) | For contributors: the engine, the checks, console styles as data. GitHub, good first issues, the contributing guide | — |
| Hosted, or run it yourself (`#self-host`) | The hosted service (free, 20 generations a day, S-21) and self-hosting ("Self-hosting is free forever"), then the commands to run it yourself in a copyable block with Docker Compose and npm tabs | — |
| Community (`#community`) | A Discord card, the public roadmap and CueLABS™ | — |
| Questions and answers (`#faq`) | Seven questions, one open at a time | — |
| Final call to action | Start building, View on GitHub | — |
| Footer | The shared marketing footer: Product, Docs, Community and Legal columns, and the legal bar | — |

Frames: `Landing`, `Landing / Mobile`.

**Differences from the Figma frames.** [Current] The web follows the
CueLABS web standard where the frames differ (C-5): the navigation and
footer use the standard link inventory, and the page adds the contributor
band, the self-hosting band and the FAQ that the standard asks for. The
"Made on Consoless" band became "What you can make" because there are no
published games to show yet. The Figma frames are corrected to match.

### Sign-in and the 16-or-older check

| Frame | Purpose | Refs |
| --- | --- | --- |
| `Sign in`, `Sign in / Loading`, `Sign in / Error` | Google is the only login method. Playing needs no account. [Current] Built at `/signin`; signed-in visitors go straight to `/dashboard` | C-3, MI-2 |
| `Age check`, `Age check / Confirmed` | A one-time attestation for creators. [Current] Built: it shows in place of My Games until answered, and Settings stay reachable | S-15, P-12 |
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

[Current] Built in the web app at `/dashboard/studio/new` and
`/dashboard/studio/{id}`: the first prompt with a style picker, the chat
with the queued, generating, checking, ready, failed and refused states
(polled every two seconds), the locked prompt while a game builds or the
daily quota is used up, versions with preview and restore, the style
switch, the code view with hand edits that are checked before they become
a version, and the publish dialog. Not built yet: playing in the preview
(the frame shows a picture until the engine exists), Export, Compare
versions, the "retrying" and "generation paused" states, the original-take
notice, and the review outcome (a game stays in review in the mock).

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

[Current] Built in the web app as public routes: the Arcade at `/arcade`
(search, console-style filter, loading, empty, no-results and error
states) and the game page at `/arcade/{slug}` (the console frame, the
prompt, the remix credit, the leaderboard, share, report, remix, and the
not-available state). Signed-in players get a link back to My Games, and
remixing creates a draft there. Not built yet: playing. The frame shows a
picture of the game until the engine and the play origin exist, so score
submission has an API mock but no screen, and the phone touch controls
(`Play / Mobile`) wait for it too.

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

[Current] Built in the web app: My Games at `/dashboard` (list, loading,
empty and error states, rename, unpublish or withdraw from review, delete)
and Settings at `/dashboard/settings` with routed tabs for Profile,
Appearance and Data and privacy, including account deletion. The app bar
carries the area links, today's generations, the theme toggle and the
account menu. Not built yet: the
in-app Privacy page (Settings link to privacy.cuesoft.io). The prototype's
hub and its ratings leaderboard are removed; the leaderboard is now per
game, on the game page.

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
