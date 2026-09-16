# HTTP APIs

Base URL: your `APP_URL` (local default `http://localhost:3000`).

JSON unless noted. Admin routes need `gym_qr_session` cookie.

## Auth

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/auth/login` | Public | `{ email, password }` → session cookie; `{ ok, user }` |
| `POST` | `/api/auth/logout` | Session | Clears cookie |

## Machines

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/machines` | Admin | Create machine for session gym (`nameEn`, `nameFr`, `slug`, steps EN/FR required). Optional media via `imageUrls` (max 3). Auto `token`. |
| `PUT` | `/api/machines/[id]` | Admin | Update (gym-scoped). |
| `DELETE` | `/api/machines/[id]` | Admin | Delete (gym-scoped). |
| `GET` | `/api/machines/[id]/qr` | Admin | QR download; `?format=png|svg`. Target `{APP_URL}/q/{token}`. |

## Issues

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/issues` | Public | `{ token, note }` member report |
| `PATCH` | `/api/issues/[id]` | Admin | Mark `RESOLVED` |

## Non-API member pages

- `GET /` — member home (Machines / Workout / Progress / Scan)
- `GET /scan` — scanner
- `GET /q/[token]` — guide (+ `viewCount++`)
- `GET /m/[gymSlug]/[machineSlug]` — slug guide

No workout REST API — localStorage only.
