# Admin guide

## Login

1. Open `/admin/login` (subtle **Staff** link on member home).
2. Demo: `admin@ymca-quebec.demo` / `demo1234`.
3. Middleware protects `/admin/*` except login via JWT cookie `gym_qr_session` (7-day expiry).

Logout: admin nav → `POST /api/auth/logout`.

## Machines dashboard (`/admin`)

- Machines for the signed-in user’s gym
- Summary: machine count, total views, open issues
- Per row: QR download, edit, delete
- **+ Add machine**, **Print QR sheet**

## Create / edit

- `/admin/machines/new` · `/admin/machines/[id]/edit`
- Required: `nameEn`, `nameFr`, `slug`, ≥1 step EN and FR
- Optional: category, muscle groups, descriptions, tips, warnings, sort order, active
- **imageUrls**: up to **3** HTTPS or relative URLs (newline- or comma-separated). JSON on `Machine.imageUrls`.

## QR download & print

- `GET /api/machines/[id]/qr?format=png|svg` (auth required) → `{APP_URL}/q/{token}`
- `/admin/print` — browser print / PDF floor sheet

Set `APP_URL` to the public origin before printing for a real floor.

## Issues (`/admin/issues`)

Member notes from guides. Resolve with `PATCH /api/issues/[id]`.

## ROI insights (`/admin/insights`)

Real Prisma metrics only:

- Total views, open vs resolved issues
- Top machines by views
- Zero-view **content gaps**

Pitch language: scans = guided members; open issues = maintenance backlog; zero views = promote stickers or add photos.
