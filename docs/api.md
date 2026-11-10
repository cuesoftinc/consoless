# Consoless — API surface

> The HTTP API the web app talks to. **[Current]** Every route below is
> implemented by the in-app mock server under `/api/mock/v1`, which is the
> contract `api/common` will implement at `/api/v1` (system design §7).
> There is no OpenAPI document yet.

## Conventions

- JSON in and out, with snake_case field names.
- Errors use one envelope: `{"error": {"code", "message", "details"?}}`.
  Codes are stable snake_case strings such as `not_found`,
  `validation_failed` and `quota_exhausted`.
- Signed-in routes take `Authorization: Bearer <token>`. Another user's
  resource answers `404`, never `403`.
- Lists use cursor pagination: `{"items": [...], "next_cursor": "..."}`.
- Generations, edits, publishing, remix and scores take an
  `Idempotency-Key` header.

## Account

| Route | Purpose |
| --- | --- |
| `GET /me` | The signed-in user, with today's quota |
| `PATCH /me` | Change the display name |
| `POST /me/attestation` | Record the one-time 16-or-older attestation (S-15) |
| `DELETE /me` | Delete the account and everything it owns (CON-014) |

## Projects and the Studio

| Route | Purpose |
| --- | --- |
| `GET /projects` | The caller's projects, most recently changed first |
| `POST /projects` | Create a project from a first prompt; returns it with its first generation |
| `GET /projects/{id}` | One project |
| `PATCH /projects/{id}` | Rename, or switch the console style |
| `DELETE /projects/{id}` | Delete a project and take down its game |
| `GET /projects/{id}/generations` | Every prompt and its outcome, oldest first |
| `POST /projects/{id}/generations` | Ask for a change. One at a time per project (`409 generation_in_flight`), one of the day's quota each (`429 quota_exhausted`) |
| `GET /generations/{id}` | The status row the Studio polls: `queued`, `generating`, `checking`, then `ready`, `failed` or `refused` |
| `GET /projects/{id}/versions` | Every version, newest first |
| `GET /versions/{id}` | One version with its files |
| `POST /versions/{id}/restore` | Make a new version that copies an older one |
| `PUT /projects/{id}/files` | Save a hand edit; it is checked before it becomes a version (CON-007) |
| `GET /checks/{id}` | The status of that check: `checking`, `passed` or `failed` with the line |
| `POST /projects/{id}/publish` | Send the current version for review (CON-006) |
| `DELETE /projects/{id}/publish` | Unpublish, or withdraw from review |

## Arcade

These read routes are public: no token is needed.

| Route | Purpose |
| --- | --- |
| `GET /arcade/games` | Published games, most played first. `q` searches; `style` filters |
| `GET /arcade/games/{slug}` | One published game |
| `GET /arcade/games/{slug}/scores` | The top ten, plus the caller's own row when signed in |
| `POST /arcade/games/{slug}/scores` | Submit a score (signed in). Keeps each player's best |
| `POST /arcade/games/{slug}/reports` | Report a game. No account needed |
| `POST /arcade/games/{slug}/remix` | Copy a game into a new project (signed in, attested) |

## Not built yet

`GET /versions/{id}/play` and `GET /arcade/games/{slug}/play` (signed play
URLs), `GET /versions/{id}/files/{path}` and `GET /projects/{id}/export`
are in the system design and arrive with the engine and `api/common`.

## Added with the web dashboards

These are not in the ratified surface and are to be confirmed when
`api/common` is built: `PATCH /me`, `POST /me/attestation`,
`DELETE /projects/{id}/publish`, `GET /projects/{id}/generations`, the
console style on `PATCH /projects/{id}`, and `POST /projects` returning the
first generation with the project.
