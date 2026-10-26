# Changelog

All notable changes to Consoless are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- CueLABS project manifest, decision register and community health files.
- Next.js web app in `web/`, ported from the Vite prototype with every screen kept.
- Server routes for AI coaching and lobby messages through the Cuesoft Gemini proxy.
- Firebase App Hosting configuration for consoless.cuesoft.io.

### Changed

- Charts drawn in SVG from design tokens; recharts removed.
- Every colour comes from a design token.

### Security

- The Gemini key no longer ships in the browser bundle.
