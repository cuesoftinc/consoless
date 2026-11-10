# Consoless — Design

> **Status:** [Decided C-5] — the Figma file is accepted as the basis for
> the web build. The independent design QA loop has not been run yet, so
> findings from it are still to come.
>
> **Source of truth:** the Figma file
> [Consoless](https://www.figma.com/design/vy0wG6WXNLMq48GJgjUdHk), in the
> Cuesoft Inc. team. This document describes that file. Where the two
> disagree, the file wins and this document is corrected.

Claims are marked **[Current]**, **[PRD]**, **[Decided]** or **[Proposed]**.
`decisions.md` is the ratification register; this document defers to it.

## 1. Principles

- **A studio, with a retro signature.** [PRD] The product is playful,
  creative and technical. The retro console identity is a signature, used in
  console frames and short display moments, and never a limit on the
  interface.
- **The game is the hero.** The Studio puts the chat beside a live preview.
  Published games are shown in a console frame, next to the prompt that made
  them.
- **Light by default, dark by token.** [Decided D-2] Light is the default
  theme (P-04). Dark is a true variable mode, never a component variant.
- **Original artwork only.** [PRD §7] Console frames, game pictures and
  demo content are original. Nothing copies a real console, game, character
  or logo.
- **States are part of the screen.** Every data-driven screen has default,
  empty, loading and error frames.
- **Plain copy.** One thought per sentence. An error says what happened and
  what to do next.

## 2. Foundations

### 2.1 Colour tokens

[Decided D-1] Tokens are semantic. They live in the Figma variable collection
`consoless/tokens`, with **Light** (the default) and **Dark** modes, and alias the
`consoless/primitives` collection. The CSS custom property is the token name
with `/` replaced by `-`, for example `--color-bg-base`.

Every accent, brand, retro and danger fill pairs with an `on-` token for the
ink placed on it.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `color/bg/base` | `#f5f6fa` | `#0f0e17` | Page background |
| `color/bg/surface` | `#ffffff` | `#1a1a2e` | Cards, dialogs, panels |
| `color/bg/raised` | `#e9ecf3` | `#16213e` | Raised rows, chips, menus |
| `color/bg/inset` | `#e9ecf3` | `#08080f` | Preview stage, inputs, code |
| `color/bg/hover` | `#d0d5e2` | `#222b47` | Hover fill, skeletons, tracks |
| `color/border/default` | `#d0d5e2` | `#222b47` | Dividers, card borders |
| `color/border/strong` | `#aab2ca` | `#44517a` | Control borders |
| `color/text/primary` | `#0f0e17` | `#f5f6fa` | Headings and body |
| `color/text/secondary` | `#44517a` | `#aab2ca` | Supporting text |
| `color/text/muted` | `#556189` | `#8590b0` | Captions, placeholders |
| `color/accent/default` | `#0a6e78` | `#0ff0fc` | Primary action fill |
| `color/accent/hover` | `#085760` | `#7df7fd` | Primary action hover |
| `color/accent/on-accent` | `#ffffff` | `#0f0e17` | Ink on the accent fill |
| `color/accent/text` | `#0a6e78` | `#0ff0fc` | Accent text and icons |
| `color/accent/subtle` | `#e0f9fb` | `#0c2f3a` | Accent tint |
| `color/brand/default` | `#c8284a` | `#e94560` | Brand red-pink fill |
| `color/brand/on-brand` | `#ffffff` | `#0f0e17` | Ink on the brand fill |
| `color/brand/text` | `#c8284a` | `#f0708a` | Brand text |
| `color/brand/subtle` | `#fde8ec` | `#3a1420` | Brand tint |
| `color/retro/default` | `#a84a06` | `#ff8e3c` | Retro orange fill |
| `color/retro/on-retro` | `#ffffff` | `#0f0e17` | Ink on the retro fill |
| `color/retro/text` | `#a84a06` | `#ff8e3c` | Retro text |
| `color/retro/subtle` | `#fff0e3` | `#3a2210` | Retro tint |
| `color/success/text` | `#0b7a52` | `#34d399` | Success text and icons |
| `color/success/subtle` | `#e2f8ef` | `#0d2e24` | Success tint |
| `color/warning/text` | `#8a5a00` | `#facc15` | Warning text and icons |
| `color/warning/subtle` | `#fdf6d8` | `#33290a` | Warning tint |
| `color/danger/default` | `#c81e1e` | `#f87171` | Destructive fill, error border |
| `color/danger/on-danger` | `#ffffff` | `#0f0e17` | Ink on the danger fill |
| `color/danger/text` | `#c81e1e` | `#f87171` | Error text |
| `color/danger/subtle` | `#fde8e8` | `#3a1414` | Error tint |
| `color/focus/ring` | `#0a6e78` | `#0ff0fc` | Focus ring |
| `color/overlay/scrim` | `#0f0e17` at 50% | black at 70% | Behind dialogs |
| `color/rank/gold`, `silver`, `bronze` | `#eab308`, `#9ca3af`, `#c2410c` | same | Leaderboard ranks 1 to 3 |

**Console tokens** (`color/console/*`) colour game artwork and console
shells. They are the same in both modes: `screen-green #9bbc0f`,
`screen-green-mid #306230`, `screen-ink #0f380f`, `screen-black #08080f`,
`shell-cream #e4e0d6`, `shell-grey #b9b7b0`, `shell-charcoal #2a2a33`,
`shell-plum #5a4a78`, `shell-wood #3b2a20`, and the pixel colours `px-pink`,
`px-cyan`, `px-orange`, `px-yellow`, `px-green`, `px-white`, `px-sky`,
`px-grey` and `px-dirt`.

**Raw hex** is allowed only for the Google glyph (official colours) and
effect colours (shadows and the accent glow).

**Web mapping.** [Current] `web/src/design/tokens.css` carries these tokens,
with Light on `:root` and Dark on `[data-theme="dark"]`, and `globals.css`
maps them to Tailwind utilities such as `bg-bg-base` and `text-text-primary`.
The prototype screens still use the prototype tokens below. Those tokens go
when the screens are rebuilt:

| Prototype token | New token |
| --- | --- |
| `--gaming-900` | `color/bg/base` |
| `--gaming-800` | `color/bg/surface` |
| `--gaming-700` | `color/bg/raised` |
| `--gaming-neon` | `color/accent/default` |
| `--gaming-accent` | `color/brand/default` |
| `--gaming-retro` | `color/retro/default` |
| `--handheld-screen` | `color/console/screen-green` |

### 2.2 Typography

[Decided D-3] Inter for interface and reading text. Press Start 2P is the
retro signature, for short display moments inside console frames and never
for body text. JetBrains Mono for code.

| Style | Typeface | Size / line height |
| --- | --- | --- |
| `display/xl` | Inter Bold | 56 / 64 |
| `display/lg` | Inter Bold | 40 / 48 |
| `heading/lg` | Inter Semi Bold | 28 / 36 |
| `heading/md` | Inter Semi Bold | 20 / 28 |
| `heading/sm` | Inter Semi Bold | 16 / 24 |
| `body/lg` | Inter Regular | 18 / 28 |
| `body/md` | Inter Regular | 16 / 24 |
| `body/sm` | Inter Regular | 14 / 20 |
| `caption` | Inter Regular | 12 / 16 |
| `label/md` | Inter Medium | 14 / 20 |
| `label/sm` | Inter Medium | 12 / 16 |
| `code/md` | JetBrains Mono Regular | 13 / 20 |
| `code/sm` | JetBrains Mono Regular | 12 / 16 |
| `retro/lg` | Press Start 2P | 24 / 36 |
| `retro/md` | Press Start 2P | 14 / 24 |
| `retro/sm` | Press Start 2P | 10 / 16 |

Scores use tabular figures (`tnum`).

### 2.3 Shared foundations

These rows are identical across CueLABS™ products. Changing one is an
ecosystem change.

| Foundation | Values |
| --- | --- |
| Spacing (4px grid) | 4, 8, 12, 16, 24, 32, 48, 64 (`space/1` to `space/16`) |
| Radius | 4, 8, 12, 16, pill (`radius/sm` to `radius/full`) |
| Breakpoints | 640, 768, 1024, 1280, 1536 |
| Motion durations | 120, 200, 250, 300ms (`duration/fast`, `base`, `moderate`, `slow`) |
| Easing | ease-out to enter and for hover, ease-in to leave, ease-in-out to move |
| Layers | 0, 10, 20, 30, 40, 50 (`z/base`, `raised`, `sticky`, `overlay`, `modal`, `toast`) |
| Icons | Lucide, 2px stroke, at 16, 20 or 24px, named `icon/<lucide-slug>` |
| Focus ring | 2px `color/focus/ring`, offset 2, on `:focus-visible` only |

Elevation uses four effect styles: `shadow/sm`, `shadow/md`, `shadow/lg` and
`glow/accent`.

### 2.4 Layout

- Desktop screens are designed at 1440 wide. App screens are 900 high.
- The Studio is three columns: chat (432), workspace (fills), side panel
  (344). At tablet width (1024) the side panel is hidden and the chat is 360.
- Marketing and list pages use a 64px gutter. Reading pages use a 760px
  measure.
- Phone frames are 375 wide. The Arcade and game playback work on phones
  with touch controls. [PRD §5] The Studio targets laptops and tablets
  first.

## 3. Components

Component sets use PascalCase names and lowercase variant properties.
Screens are assembled from instances only.

| Group | Components |
| --- | --- |
| Actions | `Button` (kind, size), `IconButton`, `GoogleAuthButton` |
| Forms | `Input`, `Select`, `Menu`, `Checkbox`, `RadioGroup`, `Toggle`, `PromptInput` |
| Feedback | `Badge`, `Banner`, `Toast`, `Tooltip`, `Modal`, `Skeleton`, `EmptyState`, `QuotaMeter` |
| Navigation | `MarketingNav`, `MarketingFooter`, `Tabs`, `RouteTabs`, `Avatar`, `LogoPlaceholder` |
| Studio | `ChatMessage`, `GenerationStatus`, `VersionItem`, `StyleCard`, `CodeLine`, `FileTreeItem` |
| Arcade | `GameCard`, `GameCardSkeleton`, `LeaderboardRow`, `TouchControls` |
| Console | `ConsoleFrame` (handheld, 8-bit, 16-bit, arcade, modern, 3d), `GameScreen`, `PatternTile` |
| Stage 2 | `AssetCard` |
| Stage 3 | `BuildTargetCard`, `CollaboratorRow` |

Notes:

- [Current] The web builds each of these as one module in
  `web/src/components/ui/`, shown in the dev gallery at `/dev/components`.
  Stage 2 and Stage 3 components are built with their stages.
- `Button` has five kinds: primary, secondary, ghost, danger and
  quiet-danger. Quiet-danger is the row-level destructive action; the filled
  danger button is for confirm dialogs only.
- `MarketingNav` and `MarketingFooter` carry the shared CueLABS™ link
  inventory. The Figma `Navbar` and `Footer` are to be corrected to match.
- `GoogleAuthButton` is the only sign-in call to action (C-3).
- `GenerationStatus` has one state per API status: queued, generating,
  checking, retrying, ready, failed and refused (system design §6.1).
- `ConsoleFrame` is the visual form of a console style (CON-003). Its nested
  `GameScreen` is exposed, so the game picture and palette are set on the
  instance.
- [Decided D-4] `LogoPlaceholder` and `PatternTile` are placeholders. The
  official Consoless logo and the approved African geometric pattern replace
  them when they are supplied.
- `GameScreen` pictures, and every title, person, play count and score on
  the screens, are synthetic demo content.

## 4. Microinteraction catalog

| ID | Name | Behaviour |
| --- | --- | --- |
| MI-1 | Button press | Background eases to the hover token over 120ms (ease-out). On press the button scales to 0.98. |
| MI-2 | Sign-in | On click the label changes to "Signing in…" and the glyph becomes a spinner turning once per 800ms until the provider returns. |
| MI-3 | Tab switch | The active underline moves and the content dissolves over 200ms. |
| MI-4 | Toggle | The knob slides over 120ms. |
| MI-5 | Toast | Slides in from the right over 300ms (ease-out), stays 5 seconds, fades out over 300ms. Errors stay until dismissed. |
| MI-6 | Skeleton | Opacity pulses between 0.5 and 1 on a 1.5s loop. |
| MI-7 | Modal | The scrim fades in over 200ms while the panel rises 8px and fades in. Focus is trapped and returns to the trigger on close. |
| MI-8 | Send prompt | The message rises into the chat over 200ms. |
| MI-9 | Generation progress | The Studio polls the generation every 2 seconds (S-11). Each status change swaps the status card and is announced through a polite live region. |
| MI-10 | Build progress | The bar is indeterminate, sweeping left to right every 1.5s. |
| MI-11 | Style switch | The old console frame fades out and the new one fades in over 250ms while the game keeps running. |
| MI-12 | Card hover | The border strengthens and `shadow/md` fades in over 120ms. |

Each entry is also written in the description of the component it applies
to. `pages.md` refers to these IDs.

## 5. Accessibility and motion

- **Contrast.** Text and on-fill pairs reach at least 4.5:1 in both modes.
  Checked pairs include primary, secondary and muted text on each background,
  each `on-` token on its fill, and status text on its tint.
- **Colour is never the only signal.** Badges state the status in words.
  Leaderboard ranks show the number as well as the rank colour.
- **Focus.** Every interactive element shows the shared focus ring on
  keyboard focus.
- **Targets.** Touch controls and phone actions are at least 44px.
- **Announcements.** Generation status changes and form errors are announced
  to screen readers.
- **Reduced motion.** Movement is removed and opacity changes stay. The
  spinner becomes a static icon, the skeleton stops pulsing and the build bar
  stops sweeping. A "Reduce motion" setting sits in Settings, Appearance.
- **Input.** [PRD CON-005] Games take keyboard, gamepad and on-screen touch
  controls, mapped from the console style.

## 6. Platform parity

- **Web** is the only active surface. Desktop, tablet and phone widths are
  designed.
- **Mobile app** is planned (`.cuelabs/project.yaml`). No app screens are
  designed. Phone playback is designed as a web page.
- **Theme.** Every screen is drawn in Light. Dark-mode checks exist for the
  Studio, the Arcade, My Games, the 3D Studio and Builds, alongside the
  Light and Dark QA frames on the Components page.

## 7. Prototype journeys

Flows are wired as named starting points on each page. Clicks navigate with
a 200ms dissolve, pushes use smart animate, and asynchronous steps advance
after a timeout. Empty, loading and error frames stay out of the flows.

| Page | Flow | Starts at |
| --- | --- | --- |
| Landing & Auth | Sign up and start building | Landing |
| Landing & Auth | Sign up on a phone | Landing / Mobile |
| Studio | Make a first game | Studio / New project |
| Studio | Refine, versions and styles | Studio / Ready |
| Studio | Read and edit the code | Studio / Code |
| Studio | Publish a game | Studio / Publish dialog |
| Arcade & Play | Find and play a game | Arcade |
| Arcade & Play | Share, report and remix | Game |
| Arcade & Play | Play as a guest | Game / Signed out |
| Arcade & Play | Play on a phone | Arcade / Mobile |
| My Games & Account | Manage my games | My Games |
| My Games & Account | Settings and my data | Settings / Profile |
| Stage 2 · 3D & Assets | Make a 3D game | 3D / First version ready |
| Stage 2 · 3D & Assets | Generate and upload assets | Assets |
| Stage 3 · Export & Collaboration | Build a desktop installer | Builds |
| Stage 3 · Export & Collaboration | Invite a collaborator | People |
| Stage 3 · Export & Collaboration | Accept an invitation | Invitation |

## 8. Figma Style Guide

The file's pages, in order:

| Page | Contents |
| --- | --- |
| Style Guide | Cover, colour in Light and Dark, typography, foundations |
| Components | An About card, one stage frame per component in the left column, Light and Dark QA frames with live instances in the right column |
| Assets | Logo placeholder, pattern, console frames, game pictures, attributions |
| Landing & Auth | Landing, sign-in, the 16-or-older check |
| Studio | The Studio in every state |
| Arcade & Play | Arcade, game page, leaderboard, dialogs, phone play |
| My Games & Account | Projects, settings, privacy page, not found |
| Stage 2 · 3D & Assets | 3D games, multi-file projects, assets |
| Stage 3 · Export & Collaboration | Desktop builds, people, invitations |
| Deprecated | Empty |

Attributions: Lucide icons (ISC licence); Inter, Press Start 2P and JetBrains
Mono (SIL Open Font License); the Google G is a trademark of Google, used
only on the sign-in button. The file uses no photography.

## 9. Open items

These are in the designs as proposals and need a decision before sign-off.

| Item | State |
| --- | --- |
| Design QA loop | [Proposed] Not run. The standard asks for independent auditors across completeness, content and polish. |
| Logo and pattern | [Decided D-4] Placeholders until the brand owner supplies the assets. |
| Console style specifications | [Proposed] The resolutions and colour counts on the style cards are illustrative. The engine's style files define the real values in Phase 1a. |
| Engine API in code samples | [Proposed] The code shown in the Studio is illustrative. The engine API is defined in Phase 1a. |
| Upload file types | [Proposed] The upload dialog names "images, 3D models and audio". The accepted formats and size limits are set with `api/intake`. |
| Online multiplayer | [Proposed] One provisional lobby frame. The realtime design (system design v2, S-26) comes first. |
| Landing page audiences | [Current] The web landing page has the contributor band, the self-hosting band and the FAQ. The Figma frames do not have them yet. See `pages.md` Part A. |
