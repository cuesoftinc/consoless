# Changelog

All notable changes to Consoless are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Web component library: 35 components in `web/src/components/ui/`, built from the design tokens with a test file each, and a dev-only gallery at `/dev/components`.
- Web foundations: semantic design tokens with Light as the default theme and a Dark mode, the theme provider and toggle, the mock server base with a reset route, a request hook for controllers, and an HTTP client that sends bearer tokens and idempotency keys.
- Decision C-5: the Figma designs are the basis for the web build.
- Design contract (`docs/design.md`) and screen inventory (`docs/pages.md`) for the Figma designs of all three stages, which await sign-off.
- Decisions D-1 to D-5: semantic colour tokens, light as the default theme, the typefaces, placeholder brand assets and one design file.
- Ratified system design (S-1 to S-26) for the prompt-to-game platform (`docs/system-design.md`, `.json`, `.html`).
- Decisions C-1 to C-4: the new product direction, the retired prototype, Google sign-in only, and design-first UI.
- A single "Continue with Google" sign-in button.

- CueLABS project manifest, decision register and community health files.
- Next.js web app in `web/`, ported from the Vite prototype with every screen kept.
- Server routes for AI coaching and lobby messages through the Cuesoft Gemini proxy.
- Firebase App Hosting configuration for consoless.cuesoft.io.

### Fixed

- Design token colours now reach Tailwind: the colour utilities (`bg-bg-base`, `text-text-primary` and the rest) were missing from the theme mapping.

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
