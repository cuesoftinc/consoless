# Changelog

All notable changes to Consoless are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Proposed system design for the prompt-to-game platform (`docs/system-design.md`, `.json`, `.html`).
- Decisions C-1 to C-4: the new product direction, the retired prototype, Google sign-in only, and design-first UI.
- A single "Continue with Google" sign-in button.

- CueLABS project manifest, decision register and community health files.
- Next.js web app in `web/`, ported from the Vite prototype with every screen kept.
- Server routes for AI coaching and lobby messages through the Cuesoft Gemini proxy.
- Firebase App Hosting configuration for consoless.cuesoft.io.

### Changed

- README rewritten for the prompt-to-game direction.
- Landing page copy describes making games instead of renting consoles; layouts are unchanged until the Figma designs land.
- Leaderboard seed data uses original game names instead of trademarked titles.
- Charts drawn in SVG from design tokens; recharts removed.
- Every colour comes from a design token.

### Removed

- Console rentals, the streaming session, the wallet, tournaments and the commercial game library.
- The AI coaching and lobby routes, the Gemini proxy client and `GEMINI_PROXY_*` variables. Model calls move to the backend.
- The email and password sign-in form.

### Security

- The Gemini key no longer ships in the browser bundle.
