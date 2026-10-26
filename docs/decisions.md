# Consoless — Decisions

The ratification register for Consoless. Other docs defer to this file.

## Standard parameters

Values Consoless chooses where the CueLABS™ standard leaves a choice. The
IDs and allowed values are defined in `product-decisions.md` in the
`cuelabs-engineering-standards` skill. Leave a value as `—` until it is
decided; a parameter whose surface is `absent` or `planned` may read `n/a`.

| ID | Parameter | Value | Notes |
|----|-----------|-------|-------|
| P-01 | Product slug | consoless | Matches `name` in `.cuelabs/project.yaml` |
| P-02 | Display name | Consoless | |
| P-03 | Marketing product slot | Consoles | |
| P-04 | Default theme | dark | Gaming product; the prototype is already dark |
| P-05 | Playwright port | 3150 | Siblings use 3100, 3131 and 3311 |
| P-06 | Settings IA | tabs | |
| P-07 | Date idiom per surface class | relative for activity, absolute for bookings | Rentals are time-bound |
| P-08 | Command palette | none | |
| P-09 | Data store | n/a | Backend is planned |
| P-10 | Services and host ports | — | |
| P-11 | Service transport | n/a | Backend is planned |
| P-12 | KYC tier contents | — | |
| P-13 | Destructive-confirm token | — | |
| P-14 | Discord channel | #consoless-lab | Must exist on the CueLABS server before copy ships |
| P-15 | Lint extensions | none | |
| P-16 | Mobile application ID | n/a | Mobile is planned |

## Decisions

Record each ratified decision below with a stable ID, the decision, and its
reason.
