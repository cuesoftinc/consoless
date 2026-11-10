# Consoless — Deployment and self-hosting

> How Consoless runs in the cloud and how to run it yourself. The topology
> is decided in [`system-design.md`](system-design.md) §10. Markers:
> **[Current]** works today, **[Planned]** arrives with the service it
> names.

## Run it yourself **[Current]**

Only the web app exists today, so the self-host stack is one service. It is
built in TEST_MODE: the app runs on its built-in mock API and the Google
button signs in a local test user.

```bash
git clone https://github.com/cuesoftinc/consoless
cd consoless && docker compose up --build -d
```

Open `http://localhost:3000`. `make up` runs the same command, and
`make down` stops the stack. Without Docker:

```bash
git clone https://github.com/cuesoftinc/consoless
cd consoless/web && npm ci && NEXT_PUBLIC_TEST_MODE=true npm run dev
```

What this gives you today:

- The landing page, sign-in, the Arcade, My Games, the Studio and Settings.
- A mock API that keeps its data in memory. It resets when the container
  restarts.
- No real game generation and no playing: both need the engine and the
  services below.

## The full self-host stack **[Planned]**

As the engine and the services are built, they join the same
`docker-compose.yml`, so the command above stays the same.

| Service | Role |
| --- | --- |
| `web` | The Next.js app. Proxies `/api/v1` to `api-common` |
| `api-common` | Owns all data. Also serves the play files on a second listener with signed paths (`PLAY_URL`) |
| `api-generate` | Makes the model calls. Self-hosters set `GEMINI_API_KEY` |
| `api-verify` | Type-checks and plays each version headlessly |
| Postgres, Redis, Kafka, MinIO | The data store, quotas and locks, the bus, and object storage |

Your prompts, code and games stay on your own infrastructure, and you
bring your own model key. Self-hosting is free forever.

## Cloud topology **[Decided S-12]**

| Unit | Runs as | Scaling |
| --- | --- | --- |
| `web` | Firebase App Hosting, behind Cloudflare | Managed |
| `api-common`, `api-generate`, `api-verify` | Cloud Run services | Min 0, max 2, woken on demand |
| Play origin (`play.cuesoft.io`) | A load balancer and a dedicated bucket with Cloud CDN and signed requests | Managed |
| Sweeps | Cloud Scheduler calling `api-common` | — |

Everything is provisioned in the Pulumi infrastructure-as-code stack.

**[Current]** Only `web` is deployed. Its App Hosting build sets
`NEXT_PUBLIC_TEST_MODE=true` in `web/apphosting.yaml`, so the hosted site
runs on the mock API until `api-common` exists. Every visitor shares one
sample user until then.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_TEST_MODE` | web (build time) | `true` uses the mock API and the test-mode sign-in |
| `NEXT_PUBLIC_UPSTAT_EVENTS_URL` | web | Where analytics events are sent. Unset: they stay on the page |

The variables of the planned services are listed in
[`system-design.md`](system-design.md) §10.
