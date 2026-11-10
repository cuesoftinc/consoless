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

Open `http://localhost:3000`. "Continue with Google" signs you in without
contacting Google.

| Route | What it is |
| --- | --- |
| `/` | The landing page |
| `/dashboard` | The signed-in hub |
| `/dashboard/leaderboard` | The leaderboard |
| `/api/mock/v1/*` | The mock server, mirroring the API path for path |

## Configuration

Never commit secrets. Configuration comes from environment variables;
`web/.env.example` lists them.

| Variable | Used by | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_TEST_MODE` | web | `true` points the API client at the mock server and uses the test-mode sign-in |
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

`POST /api/mock/v1/testing/reset` re-seeds the mock server. The end-to-end
tests call it so that runs do not depend on each other.

## Theme

Light is the default theme. The preference (light, dark or system) is stored
in the browser at `consoless.theme`.
