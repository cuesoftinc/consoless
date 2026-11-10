# Consoless — Setup

## Prerequisites

- **Node.js** 24 (see `web/.nvmrc`)
- **npm**

Only the web app exists today. It needs no backend: in TEST_MODE it talks to
an in-app mock server and signs you in as a local test user.

## Run the web app

```bash
git clone https://github.com/cuesoftinc/consoless.git
cd consoless/web
npm ci
NEXT_PUBLIC_TEST_MODE=true npm run dev
```

Open `http://localhost:3000` and choose Sign in. "Continue with Google"
signs you in without contacting Google.

| Route | What it is |
| --- | --- |
| `/` | The landing page |
| `/signin` | Sign-in (Google only) |
| `/arcade` | The Arcade: published games, open to everyone |
| `/arcade/{slug}` | A game's page: leaderboard, share, remix and report |
| `/dashboard` | My Games, behind the one-time 16-or-older check |
| `/dashboard/studio/new` | New game: a first prompt and a console style |
| `/dashboard/studio/{id}` | The Studio: chat, preview, code, versions, style and publish |
| `/dashboard/settings` | Settings: Profile, Appearance, Data and privacy |
| `/dev/components` | The component gallery (dev and TEST_MODE builds only) |
| `/api/mock/v1/*` | The mock server, mirroring the API path for path |

## Configuration

Never commit secrets. Configuration comes from environment variables;
`web/.env.example` lists them.

| Variable | Used by | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_TEST_MODE` | web | `true` points the API client at the mock server and uses the test-mode sign-in. The hosted site sets it in `web/apphosting.yaml` until `api/common` exists |
| `PW_PORT` | web end-to-end tests | Port for the Playwright server. Defaults to 3150 |

## Checks

Run these from `web/` before opening a pull request. CI runs the same set.

```bash
npm run lint         # prettier, eslint and the layer boundary check
npm run typecheck
npm test             # unit and integration tests (Vitest)
npm run build
npm run test:e2e     # Playwright, against the TEST_MODE app
```

`POST /api/mock/v1/testing/reset` re-seeds the mock server. The mock keeps
state per signed-in user, so journeys that change data do not affect each
other: send `{"user_id": "usr_..."}` to re-seed one user. In TEST_MODE the
Google button signs in `usr_playerone`, a returning creator with sample
games. To sign in as someone else, set `localStorage["consoless.test-user"]`
to a user id before clicking it; ids beginning `usr_new` are first-time
users with no games who have not answered the age check.

The mock builds every prompt into a version after a few seconds. Two
prompts drive the other outcomes: one containing `[fail]` fails its checks,
and one containing `[refuse]` is refused. A code edit fails its check when
its braces do not balance.

## Docker

```bash
docker compose up --build -d   # or: make up
```

This builds `web/Dockerfile` in TEST_MODE and serves the app on port 3000.
The compose file holds only the web app today; the engine and the services
join it as they are built.

## Theme

Light is the default theme. The preference (light, dark or system) is stored
in the browser at `consoless.theme`.
